import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function sourceReader(ref) {
  const cache = new Map();
  function read(file) {
    return ref ? execFileSync('git', ['show', `${ref}:${file}`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) : fs.readFileSync(path.join(root, file), 'utf8');
  }
  function evaluate(source, file) {
    const exports = {};
    const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    vm.runInNewContext(js, { exports, URL, require(specifier) {
      if (!specifier.startsWith('.')) throw Error(`Non-data dependency: ${specifier}`);
      return load(path.posix.join(path.posix.dirname(file), specifier));
    } }, { filename: file });
    return exports;
  }
  function load(file) {
    file = file.replace(/\.js$/, '.ts');
    if (!path.extname(file)) file += '.ts';
    if (!cache.has(file)) cache.set(file, evaluate(read(file), file));
    return cache.get(file);
  }
  function constant(file, name) {
    const source = read(file);
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
    for (const statement of ast.statements) if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) if (declaration.name.getText(ast) === name) {
        return evaluate(`export const value = ${declaration.initializer.getText(ast)};`, file).value;
      }
    }
    throw Error(`Missing authored constant ${file}:${name}`);
  }
  return { load, constant };
}

export function contentSnapshot(ref, reader = sourceReader(ref)) {
  const snapshot = { roadmap_phases: {}, roadmap_weeks: {}, roadmap_resources: {}, build_specs: {} };
  const pythonSpecs = reader.load('server/data/build-specs.ts').BUILD_SPECS;
  const javaSpecs = reader.constant('server/scripts/seed-java-build-specs.ts', 'JAVA_SPECS');
  const extras = reader.constant('server/scripts/seed-build-enrichments.ts', 'ENRICH');
  const deepens = ['seed-java-deepen.ts', 'seed-java-deepen-2.ts'].map(file => reader.constant(`server/scripts/${file}`, 'DEEPEN'));
  for (const language of ['python', 'java']) {
    const phases = reader.load(`server/data/roadmap-${language}.ts`)[`${language}Roadmap`];
    // Modern revisions carry outcomes on the roadmap itself. Only legacy
    // revisions need constants extracted from the old seed scripts.
    const legacyFile = `server/scripts/${language === 'python' ? 'seed-example-content.ts' : 'seed-java-content.ts'}`;
    const objectives = phases.some(p => p.weeks.some(w => w.learningObjectives === undefined))
      ? reader.constant(legacyFile, 'WEEK_OBJECTIVES') : {};
    const outcomes = phases.some(p => p.outcomes === undefined)
      ? reader.constant(legacyFile, 'PHASE_OUTCOMES') : {};
    const resolver = reader.load('src/utils/url.ts').getResourceUrl;
    for (const phase of phases) {
      snapshot.roadmap_phases[`${language}:${phase.phase}`] = { title: phase.title, description: phase.desc, outcomes: phase.outcomes ?? (language === 'python' ? outcomes.python : outcomes)?.[phase.phase] ?? [] };
      for (const week of phase.weeks) {
        snapshot.roadmap_weeks[`${language}:${phase.phase}_${week.n}`] = { title: week.title, learning_objectives: week.learningObjectives ?? (language === 'python' ? objectives.python : objectives)?.[week.n] ?? [] };
        let buildIndex = 0;
        week.sessions.forEach((session, si) => session.resources.forEach((resource, ri) => {
          const key = `${language}:${phase.phase}_${week.n}_${si}_${ri}`;
          snapshot.roadmap_resources[key] = { type: resource.type, item: resource.item, where_text: resource.where, mins: resource.mins, url: resolver(resource), is_core: resource.isCore ?? true };
          if (resource.type !== 'Build') return;
          const tag = `p${phase.phase}w${week.n}.${buildIndex++}`;
          const base = language === 'python' ? pythonSpecs[resource.item] : javaSpecs[tag];
          if (!base) return;
          const spec = JSON.parse(JSON.stringify(base));
          if (language === 'java') for (const deepen of deepens) {
            const addition = deepen[tag] ?? {};
            for (const [extra, field] of [['extraReqs', 'requirements'], ['extraAccept', 'acceptance'], ['extraHints', 'hints']]) spec[field] = [...new Set([...(spec[field] ?? []), ...(addition[extra] ?? [])])];
          }
          Object.assign(spec, extras[language]?.[tag] ?? {});
          delete spec.diagram; // Preserve database diagrams; they may have additional authored improvements.
          const renames = { stretchGoals: 'stretch_goals', estHours: 'est_hours' };
          snapshot.build_specs[key] = Object.fromEntries(Object.entries(spec).map(([k, v]) => [renames[k] ?? k, v]));
        }));
      }
    }
  }
  return snapshot;
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  return value;
}
export const equal = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
// Preserve DB-only additions to arrays; refuse ambiguous changes instead of replacing them.
export function mergeEditedValue(before, after, actual) {
  if (equal(actual, after)) return { value: actual };
  if (equal(actual, before)) return { value: after };
  if (Array.isArray(before) && Array.isArray(after) && Array.isArray(actual)) {
    const removed = before.filter(x => !after.some(y => equal(x, y)));
    const added = after.filter(x => !before.some(y => equal(x, y)));
    if (removed.every(x => !actual.some(y => equal(x, y))) && added.every(x => actual.some(y => equal(x, y)))) return { value: actual };
    if (removed.every(x => actual.some(y => equal(x, y)))) {
      return { value: [...actual.filter(x => !removed.some(y => equal(x, y))), ...added.filter(x => !actual.some(y => equal(x, y)))] };
    }
  }
  return { conflict: true };
}
