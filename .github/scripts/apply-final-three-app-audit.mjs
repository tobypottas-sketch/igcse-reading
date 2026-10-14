import fs from 'node:fs';

const file='index.html';
let html=fs.readFileSync(file,'utf8');
const before=`  const status = paperCompletionStatus();
  const message = status.complete
    ? 'Submit this paper? Your answers will be locked.'
    : 'You have answered ' + status.answered + '/' + status.total + ' questions. Submit anyway? Your answers will be locked.';
  if(!confirm(message)) return;`;
const after=`  const status = paperCompletionStatus();
  if(!status.complete){
    alert('Complete all questions before submitting Exam Mode. (' + status.answered + '/' + status.total + ' answered)');
    return;
  }
  if(!confirm('Submit this paper? Your answers will be locked.')) return;`;
if(!html.includes(after)){
  if(!html.includes(before)) throw new Error('Reading submitExam audit anchor not found');
  html=html.replace(before,after);
  fs.writeFileSync(file,html);
}
