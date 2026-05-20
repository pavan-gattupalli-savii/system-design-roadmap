// ── Seed knowledge checks ─────────────────────────────────────────────────────
// Upserts authored content from `server/data/knowledge-checks.ts` into the
// week_checks / week_check_mcq / week_check_code_problems / week_check_code_tests
// tables. Idempotent: re-running fully replaces the children of each entry.
//
// Run: npm run seed:knowledge-checks
//
// After seeding, the data is served by /api/knowledge-checks. The route's
// in-memory cache (`queryCache`) needs to be flushed (POST /api/admin/flush-cache)
// or the server restarted to surface changes immediately in prod.

import "dotenv/config";
import { sql } from "../src/db/client.js";
import { KNOWLEDGE_CHECKS } from "../data/knowledge-checks.js";

async function seed() {
  console.log("▶ Seeding knowledge checks…");

  // Sanity-check the migration ran. Failing fast here beats a confusing
  // "column does not exist" later on.
  try {
    await sql`SELECT 1 FROM week_checks LIMIT 1`;
  } catch {
    console.error("❌ week_checks table missing — run `npm run migrate` first.");
    process.exit(1);
  }

  let checkCount = 0, mcqCount = 0, numericCount = 0, problemCount = 0, testCount = 0;

  for (const seed of KNOWLEDGE_CHECKS) {
    // Upsert the parent week_check row by natural key. ON CONFLICT updates the
    // mutable fields so authoring tweaks (title, passPct) propagate without a
    // manual delete.
    const [parent] = await sql`
      INSERT INTO week_checks (language, phase_number, week_number, title, pass_pct)
      VALUES (${seed.language}, ${seed.phase}, ${seed.week},
              ${seed.title ?? "Knowledge check"}, ${seed.passPct ?? 70})
      ON CONFLICT (language, phase_number, week_number)
      DO UPDATE SET title = EXCLUDED.title, pass_pct = EXCLUDED.pass_pct
      RETURNING id
    ` as { id: number }[];
    const checkId = parent.id;
    checkCount++;

    // Wipe children before reinserting. Two-level cascade handles code tests
    // when their parent problem row is deleted. Doing this inside a single
    // statement-per-table keeps the script fast even on large content sets.
    await sql`DELETE FROM week_check_mcq            WHERE week_check_id = ${checkId}`;
    await sql`DELETE FROM week_check_numeric        WHERE week_check_id = ${checkId}`;
    await sql`DELETE FROM week_check_code_problems  WHERE week_check_id = ${checkId}`;

    for (let i = 0; i < seed.mcq.length; i++) {
      const m = seed.mcq[i];
      await sql`
        INSERT INTO week_check_mcq (week_check_id, prompt, options, correct, explanation, points, sort_order)
        VALUES (
          ${checkId}, ${m.prompt},
          ${JSON.stringify(m.options)}::jsonb,
          ${JSON.stringify(m.correct)}::jsonb,
          ${m.explanation ?? ""}, ${m.points ?? 1}, ${i}
        )
      `;
      mcqCount++;
    }

    const numericSeeds = seed.numeric ?? [];
    for (let i = 0; i < numericSeeds.length; i++) {
      const n = numericSeeds[i];
      await sql`
        INSERT INTO week_check_numeric
          (week_check_id, prompt, expected, tolerance_pct, unit, explanation, points, sort_order)
        VALUES (
          ${checkId}, ${n.prompt}, ${n.expected}, ${n.tolerancePct ?? 10},
          ${n.unit ?? ""}, ${n.explanation ?? ""}, ${n.points ?? 2}, ${i}
        )
      `;
      numericCount++;
    }

    const codeSeeds = seed.code ?? [];
    for (let i = 0; i < codeSeeds.length; i++) {
      const p = codeSeeds[i];
      const [prob] = await sql`
        INSERT INTO week_check_code_problems
          (week_check_id, runtime, title, prompt, starter, entry_fn, timeout_ms, points, sort_order)
        VALUES (
          ${checkId}, ${p.runtime}, ${p.title}, ${p.prompt}, ${p.starter},
          ${p.entryFn}, ${p.timeoutMs ?? 3000}, ${p.points ?? 3}, ${i}
        )
        RETURNING id
      ` as { id: number }[];
      problemCount++;

      for (let ti = 0; ti < p.tests.length; ti++) {
        const t = p.tests[ti];
        await sql`
          INSERT INTO week_check_code_tests
            (problem_id, name, input, expected, hidden, weight, sort_order)
          VALUES (
            ${prob.id}, ${t.name},
            ${JSON.stringify(t.input)}::jsonb,
            ${JSON.stringify(t.expected)}::jsonb,
            ${t.hidden ?? false}, ${t.weight ?? 1}, ${ti}
          )
        `;
        testCount++;
      }
    }
  }

  console.log(`✅ Seeded ${checkCount} week check(s), ${mcqCount} MCQ, ${numericCount} numeric, ${problemCount} code problem(s), ${testCount} test case(s).`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
