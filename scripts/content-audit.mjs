// Read-only with respect to application data. Never imports database/seed scripts.
// node scripts/content-audit.mjs [--probe] [--out path.json]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { contentSnapshot } from './content-source.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cache = new Map();
function load(relative) {
  let file = path.resolve(root, relative);
  if (!path.extname(file)) file += '.ts';
  if (file.endsWith('.js') && !fs.existsSync(file)) file = file.slice(0, -3) + '.ts';
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const source = fs.readFileSync(file, 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(js, {
    exports,
    require(specifier) {
      if (!specifier.startsWith('.')) throw new Error(`Unexpected dependency: ${specifier}`);
      return load(path.resolve(path.dirname(file), specifier));
    },
    URL,
  }, { filename: file });
  return exports;
}

const { getResourceUrl } = load('src/utils/url.ts');
const { KNOWLEDGE_CHECKS } = load('server/data/knowledge-checks.ts');
const snapshot = contentSnapshot();
const resources = [];
const weeks = [];
const errors = [];
for (const language of ['python', 'java']) {
  const phases = load(`server/data/roadmap-${language}.ts`)[`${language}Roadmap`];
  const seen = new Set();
  for (const phase of phases) for (const week of phase.weeks) {
    if (seen.has(week.n)) errors.push(`Duplicate ${language} week ${week.n}`);
    seen.add(week.n);
    const check = KNOWLEDGE_CHECKS.find(c => c.language === language && c.week === week.n && c.phase === phase.phase);
    weeks.push({ language, phase: phase.phase, week: week.n, title: week.title,
      objectives: week.learningObjectives ?? [], sourceKnowledgeCheck: !!check,
      minutes: week.sessions.flatMap(s => s.resources).reduce((n, r) => n + r.mins, 0) });
    week.sessions.forEach((session, si) => session.resources.forEach((resource, ri) => {
      const key = `${language}:${phase.phase}_${week.n}_${si}_${ri}`;
      if (!resource.item || !resource.where || !Number.isFinite(resource.mins) || resource.mins < 0) errors.push(`Invalid resource ${key}`);
      const url = getResourceUrl(resource);
      if (url) {
        try { if (!['https:', 'http:'].includes(new URL(url).protocol)) throw new Error(); }
        catch { errors.push(`Invalid URL ${key}: ${url}`); }
      }
      resources.push({ key, language, phase: phase.phase, week: week.n, type: resource.type,
        item: resource.item, where: resource.where, url,
        destination: !url ? 'none' : /[?&](search_query|q)=|\/search(?:\?|\/)/.test(url) ? 'search' : 'direct',
        explicit: !!resource.url,
        sourceBuildSpec: resource.type === 'Build' ? !!snapshot.build_specs[key] : undefined });
    }));
  }
}
for (const check of KNOWLEDGE_CHECKS) {
  const key = `${check.language}:${check.phase}:${check.week}`;
  if (!weeks.some(w => w.language === check.language && w.phase === check.phase && w.week === check.week)) errors.push(`Orphan check ${key}`);
  for (const q of check.mcq) {
    if (!q.prompt || !q.explanation || !q.correct.length || new Set(q.correct).size !== q.correct.length || q.correct.some(i => !Number.isInteger(i) || i < 0 || i >= q.options.length)) errors.push(`Invalid question ${key}: ${q.prompt}`);
  }
}

// Extract supplemental authored URLs without executing scripts with DB side effects.
const supplementary = [];
for (const dir of ['server/scripts', 'server/data', 'src/data']) for (const name of fs.readdirSync(path.join(root, dir))) {
  // Roadmap URLs are already resolved and inventoried above.
  if (dir === 'server/data' && name.startsWith('roadmap-')) continue;
  if (!name.endsWith('.ts') || (dir === 'server/scripts' && !name.startsWith('seed-'))) continue;
  const relative = `${dir}/${name}`;
  const source = fs.readFileSync(path.join(root, relative), 'utf8');
  const ast = ts.createSourceFile(relative, source, ts.ScriptTarget.Latest, true);
  function visit(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      for (const match of node.text.matchAll(/https?:\/\/[^\s<>"'`]+/g)) {
        const url = match[0].replace(/[),.;]+$/, '');
        if (!/localhost|127\.0\.0\.1|example\.(com|org)|your[-.]/.test(url)) supplementary.push({ source: relative, line: ast.getLineAndCharacterOfPosition(node.getStart()).line + 1, url });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
}

async function request(url, method) {
  const response = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(12000), headers: { 'User-Agent': 'RoadmapContentAudit/1.0' } });
  // Do not download media/PDFs or unbounded bodies just to check a destination.
  await response.body?.cancel();
  return { status: response.status, finalUrl: response.url, redirected: response.redirected };
}
async function probe(url) {
  let result;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      result = await request(url, 'HEAD');
      if ([400, 403, 404, 405, 501].includes(result.status)) result = await request(url, 'GET');
      if (result.status < 500 && result.status !== 429) break;
    } catch (error) {
      result = { status: null, reason: error.cause?.code ?? error.name };
    }
    if (attempt === 0) await new Promise(resolve => setTimeout(resolve, 500));
  }
  const status = result.status;
  const state = status === 404 || status === 410 ? 'missing'
    : status === 401 || status === 403 ? 'access-blocked'
    : status === 429 ? 'rate-limited'
    : status >= 200 && status < 400 ? (result.redirected ? 'redirected' : 'reachable')
    : 'inconclusive';
  return { url, ...result, state, checkedAt: new Date().toISOString() };
}

const urls = [...new Set([...resources.map(r => r.url), ...supplementary.map(r => r.url)].filter(Boolean))].sort();
const probes = [];
if (process.argv.includes('--probe')) {
  const previousIndex = process.argv.indexOf('--previous');
  const previous = previousIndex >= 0 ? JSON.parse(fs.readFileSync(process.argv[previousIndex + 1], 'utf8')).probes : [];
  const recent = new Map(previous.filter(p => Date.now() - Date.parse(p.checkedAt) < 86400000).map(p => [p.url, p]));
  // One worker per host, at most eight hosts at once.
  const hosts = Map.groupBy ? Map.groupBy(urls, url => new URL(url).host) : urls.reduce((m, url) => { const host = new URL(url).host; m.set(host, [...(m.get(host) ?? []), url]); return m; }, new Map());
  const queue = [...hosts.values()];
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (queue.length) for (const url of queue.shift()) {
      probes.push(recent.get(url) ?? await probe(url));
      if (probes.length % 25 === 0) console.log(`Checked ${probes.length}/${urls.length} URLs`);
    }
  }));
}
const summary = {
  weeks: weeks.length, resources: resources.length, uniqueUrls: urls.length,
  searchDestinations: resources.filter(r => r.destination === 'search').length,
  explicitUrls: resources.filter(r => r.explicit).length,
  sourceKnowledgeChecks: KNOWLEDGE_CHECKS.length,
  probeStates: probes.reduce((counts, p) => ({ ...counts, [p.state]: (counts[p.state] ?? 0) + 1 }), {}),
  errors,
};
const report = { generatedAt: new Date().toISOString(), scope: 'Repository source; DB enrichments are not inferred from base files', summary, weeks, resources, supplementary, probes: probes.sort((a, b) => a.url.localeCompare(b.url)) };
const outIndex = process.argv.indexOf('--out');
if (outIndex >= 0) {
  if (!process.argv[outIndex + 1]) throw new Error('--out requires a path');
  fs.writeFileSync(process.argv[outIndex + 1], JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify(summary, null, 2));
if (errors.length) process.exitCode = 1;
