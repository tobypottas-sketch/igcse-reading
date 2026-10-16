import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('Reading Results shows a June 2026 0511 Component 12 grade only after completion', () => {
  assert.match(html, /Estimated 0511 R&W grade/);
  assert.match(html, /estimate0511Component12Grade/);
  assert.match(html, /55\s*,\s*50\s*,\s*45\s*,\s*40\s*,\s*35\s*,\s*30\s*,\s*25/);
  assert.match(html, /answered\s*>=\s*total/);
  assert.match(html, /June 2026/);
  assert.match(html, /not an official Cambridge result/i);
});

// Regression guard for the student-facing grade result.
