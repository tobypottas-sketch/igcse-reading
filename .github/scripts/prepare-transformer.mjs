import fs from 'node:fs';
const file = '.github/scripts/apply-practice-exam-mode.mjs';
let source = fs.readFileSync(file, 'utf8');
source = source.replaceAll('${', '\\${');
fs.writeFileSync(file, source);
console.log('Prepared transformer template markers.');
