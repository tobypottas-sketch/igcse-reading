import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('stores practice/exam mode and exam submission state', () => {
  assert.match(html, /studyMode\s*:\s*'practice'/);
  assert.match(html, /examSubmitted\s*:\s*false/);
  assert.match(html, /function\s+setStudyMode\s*\(/);
  assert.match(html, /function\s+submitExam\s*\(/);
  assert.match(html, /function\s+startNewExamAttempt\s*\(/);
});

test('shows explicit Practice Mode and Exam Mode controls', () => {
  assert.match(html, /Practice Mode/);
  assert.match(html, /Exam Mode/);
  assert.match(html, /id="studyModeControls"/);
  assert.match(html, /id="submitExamButton"/);
});

test('keeps results and review locked before exam submission', () => {
  assert.match(html, /function\s+canViewFeedback\s*\(/);
  assert.match(html, /if\s*\(\s*!canViewFeedback\(\)\s*&&\s*\(tab==='results'\|\|tab==='review'\)\s*\)/);
  assert.match(html, /Exam feedback unlocks after you submit the paper\./);
});

test('locks answer editing after an exam is submitted', () => {
  assert.match(html, /function\s+answersLocked\s*\(/);
  assert.match(html, /if\s*\(answersLocked\(\)\)\s*return;/);
  assert.match(html, /answerDisabledAttr\(\)/);
});

test('exam submit locks the attempt and new attempt clears it', () => {
  assert.match(html, /st\.examSubmitted\s*=\s*true/);
  assert.match(html, /function\s+clearPaperAnswersFromState\s*\(/);
  assert.match(html, /clearPaperAnswersFromState\(st\)/);
  assert.match(html, /Start a new exam attempt\?/);
});

test('renames existing teacher/student setMode to avoid mode collision', () => {
  assert.doesNotMatch(html, /function\s+setMode\s*\(/);
  assert.match(html, /function\s+setRoleMode\s*\(/);
  assert.match(html, /onclick="setRoleMode\('student'\)"/);
});
