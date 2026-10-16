import fs from 'node:fs';

const path = 'index.html';
let html = fs.readFileSync(path, 'utf8');
if (html.includes('id="scoreGrade"')) process.exit(0);

function replaceOnce(needle, replacement, label) {
  if (!html.includes(needle)) throw new Error(`Missing patch anchor: ${label}`);
  html = html.replace(needle, replacement);
}

const percentCard = '<div class="stat-card"><div class="stat-value" id="scorePercent">0%</div><div class="stat-label">Accuracy</div></div>';
replaceOnce(percentCard, percentCard + '\n        <div class="stat-card"><div class="stat-value" id="scoreGrade">—</div><div class="stat-label">Estimated 0511 R&W grade</div><div class="stat-label" style="margin-top:6px">June 2026 · Component 12 · practice estimate, not an official Cambridge result</div></div>', 'results grade card');

const renderAnchor = 'function renderResults(){';
const helper = `function estimate0511Component12Grade(percent){\n  const thresholds=[55,50,45,40,35,30,25];\n  const grades=['A','B','C','D','E','F','G'];\n  const raw=(Number(percent)||0)*60/100;\n  for(let i=0;i<thresholds.length;i++){ if(raw>=thresholds[i]) return grades[i]; }\n  return 'U';\n}\n\n`;
replaceOnce(renderAnchor, helper + renderAnchor, 'grade helper');

const lockedLine = "    document.getElementById('scorePercent').textContent = '—';";
replaceOnce(lockedLine, lockedLine + "\n    document.getElementById('scoreGrade').textContent = '—';", 'locked result grade');

const percentLine = "  document.getElementById('scorePercent').textContent = percent + '%';";
replaceOnce(percentLine, percentLine + "\n  const gradeComplete = total>0 && answered >= total;\n  document.getElementById('scoreGrade').textContent = gradeComplete ? estimate0511Component12Grade(percent) : '—';", 'completed result grade');

fs.writeFileSync(path, html);
