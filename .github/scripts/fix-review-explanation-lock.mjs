import fs from 'node:fs';

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

const notesBefore = `            <div class="answer-box"><strong>Why:</strong> Answers in this heading can be given in any order.</div>\n            \${reveal ? \`<div class="answer-box"><strong>Accepted answers:</strong> \${escapeHtml(groupedCorrect)}</div>\` : \`<div class="answer-box"><strong>Accepted answers:</strong> Hidden until revealed</div>\`}`;
const notesAfter = `            \${reveal ? \`<div class="answer-box"><strong>Why:</strong> Answers in this heading can be given in any order.</div>\` : ''}\n            \${reveal ? \`<div class="answer-box"><strong>Accepted answers:</strong> \${escapeHtml(groupedCorrect)}</div>\` : \`<div class="answer-box"><strong>Accepted answers:</strong> Hidden until revealed</div>\`}`;

const questionBefore = `            \${reveal ? \`<div class="answer-box"><strong>Suggested answer:</strong> \${escapeHtml(correctAnswer)}</div>\` : \`<div class="answer-box"><strong>Suggested answer:</strong> Hidden until revealed</div>\`}\n            <div class="answer-box"><strong>Why:</strong> \${escapeHtml(q.explanation)}</div>`;
const questionAfter = `            \${reveal ? \`<div class="answer-box"><strong>Suggested answer:</strong> \${escapeHtml(correctAnswer)}</div>\` : \`<div class="answer-box"><strong>Suggested answer:</strong> Hidden until revealed</div>\`}\n            \${reveal ? \`<div class="answer-box"><strong>Why:</strong> \${escapeHtml(q.explanation)}</div>\` : ''}`;

if (!html.includes(notesBefore)) throw new Error('Notes review rationale block not found.');
if (!html.includes(questionBefore)) throw new Error('Question review rationale block not found.');

html = html.replace(notesBefore, notesAfter).replace(questionBefore, questionAfter);
fs.writeFileSync(file, html);
