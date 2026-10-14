import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('Reading uses the Cambridge branded hero treatment', () => {
  assert.match(html, /class="hero-shell"/);
  assert.match(html, /cambridge-english-header\.png/);
  assert.match(html, /Cambridge IGCSE 0511 Reading Resource/);
  assert.match(html, /CAMBRIDGE IGCSE · ENGLISH AS A SECOND LANGUAGE/i);
});

test('Reading carries the Listening visual palette and mode styling', () => {
  assert.match(html, /--teal:#149b96/);
  assert.match(html, /--plum:#bf8aa2/);
  assert.match(html, /#practiceModeButton\.active/);
  assert.match(html, /#examModeButton\.active/);
  assert.match(html, /radial-gradient/);
});

test('existing Reading controls remain present', () => {
  assert.match(html, /id="btnStudentMode"/);
  assert.match(html, /id="btnTeacherMode"/);
  assert.match(html, /id="studyModeControls"/);
  assert.match(html, /id="submitExamButton"/);
});
