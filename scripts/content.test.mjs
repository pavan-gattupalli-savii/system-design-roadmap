import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { sourceReader, contentSnapshot, mergeEditedValue, equal } from './content-source.mjs';

const { getResourceUrl } = sourceReader().load('src/utils/url.ts');
test('modern revision snapshots do not depend on removed seed constants', () => {
  const reader = sourceReader();
  const historical = contentSnapshot('modern-revision', {
    load: reader.load,
    constant(file, name) {
      assert.ok(!['WEEK_OBJECTIVES', 'PHASE_OUTCOMES'].includes(name));
      return reader.constant(file, name);
    },
  });
  assert.ok(equal(historical, contentSnapshot()));
});
test('audit reports Java build coverage and inventories data-file references', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'roadmap-audit-'));
  try {
    const output = path.join(dir, 'report.json');
    execFileSync(process.execPath, ['scripts/content-audit.mjs', '--out', output]);
    const report = JSON.parse(fs.readFileSync(output, 'utf8'));
    const builds = report.resources.filter(r => r.language === 'java' && r.type === 'Build');
    assert.ok(builds.length > 0);
    assert.ok(builds.every(r => r.sourceBuildSpec));
    assert.ok(report.supplementary.some(r => r.source === 'server/data/build-specs.ts'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
test('search queries preserve embedded apostrophes', () => {
  const url = getResourceUrl({ type: 'YouTube', item: 'Video', where: "YouTube → search 'CodeAesthetic shouldn't nest code' — optional" });
  assert.equal(new URL(url).searchParams.get('search_query'), "CodeAesthetic shouldn't nest code");
});
test('annotated URLs exclude prose and explicit URLs take priority', () => {
  assert.equal(getResourceUrl({ where: 'https://docs.python.org/3/ — read this' }), 'https://docs.python.org/3/');
  assert.equal(getResourceUrl({ url: 'https://dev.java/learn/', where: 'https://example.com' }), 'https://dev.java/learn/');
});
test('array edits preserve database-only enrichment and are idempotent', () => {
  const merged = mergeEditedValue(['old', 'keep'], ['new', 'keep'], ['old', 'keep', 'extra']);
  assert.deepEqual(merged.value, ['keep', 'extra', 'new']);
  assert.deepEqual(mergeEditedValue(['old', 'keep'], ['new', 'keep'], merged.value), { value: merged.value });
  assert.equal(equal(merged.value, ['keep', 'extra', 'new']), true);
});
test('independently edited values are conflicts, JSON object ordering is irrelevant', () => {
  assert.deepEqual(mergeEditedValue('old', 'new', 'user edit'), { conflict: true });
  assert.equal(equal([{ label: 'Book', url: 'https://example.com' }], [{ url: 'https://example.com', label: 'Book' }]), true);
});
test('all weeks have objectives and all core builds retain specs', () => {
  const data = contentSnapshot();
  assert.equal(Object.keys(data.roadmap_weeks).length, 103);
  assert.equal(Object.keys(data.roadmap_resources).length, 531);
  for (const [key, week] of Object.entries(data.roadmap_weeks)) assert.ok(week.learning_objectives.length, key);
  for (const [key, resource] of Object.entries(data.roadmap_resources)) {
    if (resource.type !== 'Build') continue;
    assert.ok(data.build_specs[key]?.requirements.length, `${key}: requirements`);
    assert.ok(data.build_specs[key]?.acceptance.length, `${key}: acceptance`);
  }
});
