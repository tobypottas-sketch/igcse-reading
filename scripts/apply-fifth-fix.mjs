import fs from 'node:fs';

const path = new URL('../index.html', import.meta.url);
let html = fs.readFileSync(path, 'utf8');
const before = html;

const oldTeacher = `function renderTeacher(){
  document.getElementById('teacherNotes').value = getState().teacherNotes || '';
  const comments = activePaper().comments || [];
  document.getElementById('commentBank').innerHTML = comments.map(c=>\`
    <button class="comment-btn" onclick="appendTeacherNote(\${JSON.stringify(c)})">\${escapeHtml(c)}</button>
  \`).join('');
}`;

const newTeacher = `function renderTeacher(){
  document.getElementById('teacherNotes').value = getState().teacherNotes || '';
  const comments = activePaper().comments || [];
  const bank = document.getElementById('commentBank');
  bank.replaceChildren();
  comments.forEach(c=>{
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'comment-btn';
    button.textContent = c;
    button.addEventListener('click', ()=>appendTeacherNote(c));
    bank.appendChild(button);
  });
}`;

const oldMatcher = `  const phraseMatch = (left, right) => {
    if(!left || !right) return false;
    if(left === right) return true;
    const shorter = left.length <= right.length ? left : right;
    const longer = left.length <= right.length ? right : left;
    if(!shorter.includes(' ') && shorter.length < 4) return false;
    return (\` \${longer} \`).includes(\` \${shorter} \`);
  };`;

const newMatcher = `  const hasNegation = value => /(?:^|\\s)(?:not|never|no|without|cannot|can't|cant|isn't|isnt|wasn't|wasnt|didn't|didnt|won't|wont)(?:\\s|$)/.test(value);
  const phraseMatch = (left, right) => {
    if(!left || !right) return false;
    if(left === right) return true;
    if(hasNegation(left) !== hasNegation(right)) return false;
    const shorter = left.length <= right.length ? left : right;
    const longer = left.length <= right.length ? right : left;
    if(!shorter.includes(' ') && shorter.length < 4) return false;
    return (\` \${longer} \`).includes(\` \${shorter} \`);
  };`;

if (html.includes(oldTeacher)) html = html.replace(oldTeacher, newTeacher);
else if (!html.includes("bank.replaceChildren();")) throw new Error('Reading Teacher target not found');

if (html.includes(oldMatcher)) html = html.replace(oldMatcher, newMatcher);
else if (!html.includes('const hasNegation = value =>')) throw new Error('Reading matcher target not found');

if (html === before) console.log('Reading fifth-audit fixes already applied.');
else {
  fs.writeFileSync(path, html);
  console.log('Applied Reading fifth-audit fixes.');
}
