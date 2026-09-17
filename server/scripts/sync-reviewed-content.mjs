// Editorial updates and new weekly checks only: no deletes or learner-table writes.
// From server/: node scripts/sync-reviewed-content.mjs --baseline <git-ref> --out /tmp/content-update.json
// Inspect the plan, then: node scripts/sync-reviewed-content.mjs --rehearse /tmp/content-update.json
// Publish: node scripts/sync-reviewed-content.mjs --apply /tmp/content-update.json
import 'dotenv/config';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { neon, Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { contentSnapshot, sourceReader, equal, mergeEditedValue } from '../../scripts/content-source.mjs';

const allowed = {
  roadmap_phases: ['title', 'description', 'outcomes'],
  roadmap_weeks: ['title', 'learning_objectives'],
  roadmap_resources: ['type', 'item', 'where_text', 'mins', 'url', 'is_core'],
  build_specs: ['overview', 'requirements', 'acceptance', 'hints', 'difficulty', 'stretch_goals', 'pitfalls', 'est_hours', 'tags', 'prerequisites', 'references'],
};
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1]; };
const connection = process.env.DATABASE_URL;
if (!connection) throw Error('DATABASE_URL is required');
const url = new URL(connection);
const target = crypto.createHash('sha256').update(url.hostname + url.pathname).digest('hex');

async function prepare() {
  const baseline = arg('--baseline');
  const output = arg('--out');
  if (!baseline || !output) throw Error('--baseline <git-ref> and --out <path> are required');
  const before = contentSnapshot(baseline);
  const after = contentSnapshot();
  const sql = neon(connection);
  const [phases, weeks, resources, specs, existingChecks] = await Promise.all([
    sql('SELECT * FROM roadmap_phases'),
    sql('SELECT w.*, p.language, p.phase_number FROM roadmap_weeks w JOIN roadmap_phases p ON p.id=w.phase_id'),
    sql('SELECT r.*, p.language, p.phase_number, w.week_number, s.sort_order AS session_order FROM roadmap_resources r JOIN roadmap_sessions s ON s.id=r.session_id JOIN roadmap_weeks w ON w.id=s.week_id JOIN roadmap_phases p ON p.id=w.phase_id'),
    sql('SELECT * FROM build_specs'),
    sql('SELECT language, phase_number, week_number FROM week_checks'),
  ]);
  const map = (rows, key) => {
    const result = {};
    for (const row of rows) { const k = key(row); if (result[k]) throw Error(`Duplicate content identity ${k}`); result[k] = row; }
    return result;
  };
  const actual = {
    roadmap_phases: map(phases, r => `${r.language}:${r.phase_number}`),
    roadmap_weeks: map(weeks, r => `${r.language}:${r.phase_number}_${r.week_number}`),
    roadmap_resources: map(resources, r => `${r.language}:${r.phase_number}_${r.week_number}_${r.session_order}_${r.sort_order}`),
    build_specs: map(specs, r => `${r.language}:${r.resource_key}`),
  };
  const changes = [], conflicts = [], urlDrift = [];
  for (const table of Object.keys(allowed)) for (const [key, desired] of Object.entries(after[table])) {
    const previous = before[table][key];
    const current = actual[table][key];
    if (!previous || !current) { conflicts.push({ table, key, reason: 'Missing baseline or database identity' }); continue; }
    const oldFields = {}, newFields = {};
    for (const field of allowed[table]) {
      if (desired[field] === undefined || equal(previous[field], desired[field])) continue;
      const merged = mergeEditedValue(previous[field], desired[field], current[field]);
      if (merged.conflict) {
        // A reviewed canonical destination intentionally supersedes prior URL backfills.
        if (table === 'roadmap_resources' && field === 'url') {
          urlDrift.push({ key, previous: previous[field], current: current[field], desired: desired[field] });
          merged.value = desired[field];
        } else { conflicts.push({ table, key, field, previous: previous[field], current: current[field], desired: desired[field] }); continue; }
      }
      if (!equal(merged.value, current[field])) { oldFields[field] = current[field]; newFields[field] = merged.value; }
    }
    if (Object.keys(newFields).length) changes.push({ table, key, id: current.id, before: oldFields, after: newFields });
  }
  // A structural edit needs a separate migration; never silently change positional keys.
  for (const table of ['roadmap_phases', 'roadmap_weeks', 'roadmap_resources']) {
    if (!equal(Object.keys(before[table]).sort(), Object.keys(after[table]).sort())) conflicts.push({ table, reason: 'Source identities changed' });
    if (!equal(Object.keys(after[table]).sort(), Object.keys(actual[table]).sort())) conflicts.push({ table, reason: 'Database identities differ from reviewed source' });
  }
  const checks = sourceReader().load('server/data/knowledge-checks-review.ts').REVIEW_CHECKS;
  const newChecks = checks.filter(c => !existingChecks.some(e => e.language === c.language && e.phase_number === c.phase && e.week_number === c.week));
  fs.writeFileSync(output, JSON.stringify({ version: 1, target, baseline, createdAt: new Date().toISOString(), changes, newChecks, conflicts, urlDrift }, null, 2) + '\n');
  console.log(JSON.stringify({ changedRows: changes.length, newChecks: newChecks.length, conflicts: conflicts.length, reviewedUrlDrift: urlDrift.length, output }));
  if (conflicts.length) process.exitCode = 1;
}

async function apply(file, rehearsal) {
  const plan = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (plan.version !== 1 || plan.target !== target || plan.conflicts.length) throw Error('Plan target/version mismatch or unresolved conflicts');
  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: connection, connectionTimeoutMillis: 15000 });
  const client = await pool.connect();
  let updated = 0, alreadyApplied = 0, insertedChecks = 0;
  try {
    await client.query('BEGIN');
    await client.query("SET LOCAL lock_timeout = '5s'");
    // Reapply within the same rolled-back transaction to verify idempotence
    // against the updated rows and newly inserted checks.
    for (let pass = 0; pass < (rehearsal ? 2 : 1); pass++) {
      const writesBeforePass = updated + insertedChecks;
      for (const change of plan.changes) {
        const columns = Object.keys(change.after);
        if (!allowed[change.table] || !Number.isSafeInteger(change.id) || !columns.length || columns.some(c => !allowed[change.table].includes(c))) throw Error('Invalid plan operation');
        const { rows } = await client.query(`SELECT * FROM ${change.table} WHERE id=$1 FOR UPDATE`, [change.id]);
        if (rows.length !== 1) throw Error(`Missing row ${change.key}`);
        const current = rows[0];
        if (columns.every(c => equal(current[c], change.after[c]))) { alreadyApplied++; continue; }
        if (!columns.every(c => equal(current[c], change.before[c]))) throw Error(`Concurrent edit detected: ${change.key}; rebuild the dry-run plan`);
        const values = columns.map(c => c === 'references' ? JSON.stringify(change.after[c]) : change.after[c]);
        await client.query(`UPDATE ${change.table} SET ${columns.map((c, i) => `"${c}"=$${i + 1}`).join(', ')} WHERE id=$${columns.length + 1}`, [...values, change.id]);
        updated++;
      }
      for (const check of plan.newChecks ?? []) {
        if (!['python', 'java'].includes(check.language) || !Number.isInteger(check.week) || !Number.isInteger(check.phase) || !Array.isArray(check.mcq)) throw Error('Invalid knowledge check');
        const result = await client.query('INSERT INTO week_checks (language, phase_number, week_number, title, pass_pct) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (language, phase_number, week_number) DO NOTHING RETURNING id', [check.language, check.phase, check.week, check.title, check.passPct ?? 70]);
        if (!result.rows.length) {
          const existing = await client.query('SELECT q.prompt, q.options, q.correct, q.explanation FROM week_check_mcq q JOIN week_checks c ON c.id=q.week_check_id WHERE c.language=$1 AND c.phase_number=$2 AND c.week_number=$3 ORDER BY q.sort_order', [check.language, check.phase, check.week]);
          const intended = check.mcq.map(({ prompt, options, correct, explanation }) => ({ prompt, options, correct, explanation }));
          if (!equal(existing.rows, intended)) throw Error(`Concurrent knowledge-check edit: ${check.language}:${check.week}`);
          alreadyApplied++;
          continue;
        }
        for (const [order, question] of check.mcq.entries()) {
          await client.query('INSERT INTO week_check_mcq (week_check_id, prompt, options, correct, explanation, points, sort_order) VALUES ($1,$2,$3::jsonb,$4::jsonb,$5,$6,$7)', [result.rows[0].id, question.prompt, JSON.stringify(question.options), JSON.stringify(question.correct), question.explanation, question.points ?? 1, order]);
        }
        insertedChecks++;
      }
      if (pass === 1 && updated + insertedChecks !== writesBeforePass) throw Error('Rehearsal second pass was not idempotent');
    }
    await client.query(rehearsal ? 'ROLLBACK' : 'COMMIT');
    console.log(JSON.stringify({ mode: rehearsal ? 'rehearsal-rolled-back' : 'applied', updated, insertedChecks, alreadyApplied, ...(rehearsal ? { idempotenceVerified: true } : {}) }));
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); await pool.end(); }
}

try {
  if (arg('--apply')) await apply(arg('--apply'), false);
  else if (arg('--rehearse')) await apply(arg('--rehearse'), true);
  else await prepare();
} catch (error) { console.error(error.message.replaceAll(connection, '[redacted]')); process.exitCode = 1; }
