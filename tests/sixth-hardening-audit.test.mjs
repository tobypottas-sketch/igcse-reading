import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('Reading reset uses the same safe storage abstraction as normal persistence', () => {
  assert.match(html, /function\s+removeStoredState\s*\(/, 'expected a safe removeStoredState helper');
  const resetStart = html.indexOf('function resetAll()');
  const resetEnd = html.indexOf('\n}', resetStart) + 2;
  const resetBlock = html.slice(resetStart, resetEnd);
  assert.match(resetBlock, /removeStoredState\s*\(\s*\)/, 'resetAll should use removeStoredState');
  assert.doesNotMatch(resetBlock, /localStorage\.removeItem/, 'resetAll must not bypass safe storage');
});
