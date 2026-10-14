import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('review explanations stay hidden until suggested answers are revealed', () => {
  assert.match(
    html,
    /reveal\s*\?\s*`<div class="answer-box"><strong>Why:<\/strong> \$\{escapeHtml\(q\.explanation\)\}<\/div>`\s*:\s*''/
  );
  assert.doesNotMatch(
    html,
    /\$\{reveal \? `<div class="answer-box"><strong>Suggested answer:[\s\S]*?Hidden until revealed<\/div>`\}\s*\n\s*<div class="answer-box"><strong>Why:<\/strong>/
  );
});

test('notes rationale is also hidden until accepted answers are revealed', () => {
  assert.match(
    html,
    /reveal\s*\?\s*`<div class="answer-box"><strong>Why:<\/strong> Answers in this heading can be given in any order\.<\/div>`\s*:\s*''/
  );
});
