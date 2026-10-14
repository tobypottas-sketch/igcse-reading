import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('Reading Exam submission is blocked until the full paper is answered', () => {
  assert.match(html, /function\s+submitExam\s*\([\s\S]*?if\s*\(\s*!status\.complete\s*\)\s*\{[\s\S]*?return;[\s\S]*?\}/);
  assert.doesNotMatch(html, /Submit anyway\?/);
});
