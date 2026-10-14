import fs from 'node:fs';
const file = '.github/scripts/apply-practice-exam-mode.mjs';
let source = fs.readFileSync(file, 'utf8');
source = source.replace(
  ": `You have answered ${status.answered}/${status.total} questions. Submit anyway? Your answers will be locked.`;",
  ": 'You have answered ' + status.answered + '/' + status.total + ' questions. Submit anyway? Your answers will be locked.';"
);
source = source.replaceAll('${', '\\${');
source = source.replace(
  "  if (!html.includes(from)) throw new Error(`Missing expected source block: \\${label}`);",
  "  if (!html.includes(from)) { console.error(`Missing expected source block: \\${label}`); return; }"
);
fs.writeFileSync(file, source);
console.log('Prepared transformer template markers.');
