import fs from 'node:fs';

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

if (html.includes('id="studyModeControls"')) {
  console.log('Practice/Exam mode already applied.');
  process.exit(0);
}

function replaceOnce(from, to, label) {
  if (!html.includes(from)) throw new Error(`Missing expected source block: ${label}`);
  html = html.replace(from, to);
}

replaceOnce(
`.layout{display:grid;grid-template-columns:310px 1fr;gap:18px}`,
`.study-mode-bar{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;padding:12px 14px;margin-bottom:16px;border:1px solid var(--line);border-radius:11px;background:#fbfcfb}\n.study-mode-left{display:flex;align-items:center;gap:10px;flex-wrap:wrap}\n.study-mode-label{font-weight:800;color:var(--sage-dark)}\n.study-mode-btn{border:1px solid var(--line);background:#fff;color:var(--ink);padding:8px 14px;border-radius:9px;cursor:pointer;font:inherit;font-size:.82rem;font-weight:800}\n.study-mode-btn.active{background:var(--sage);border-color:var(--sage);color:#fff}\n.study-mode-status{font-size:.8rem;color:var(--ink-soft)}\n.study-mode-actions{display:flex;gap:8px;flex-wrap:wrap}\n.layout{display:grid;grid-template-columns:310px 1fr;gap:18px}`,
'practice/exam styles');

replaceOnce(
`<button id="btnStudentMode" class="active" onclick="setMode('student')">Student Mode</button>`,
`<button id="btnStudentMode" class="active" onclick="setRoleMode('student')">Student Mode</button>`,
'role mode header button');

replaceOnce(
`      <div class="card-header">Paper Practice</div>\n      <div class="layout">`,
`      <div class="card-header">Paper Practice</div>\n      <div class="study-mode-bar" id="studyModeControls">\n        <div class="study-mode-left">\n          <span class="study-mode-label">Working mode</span>\n          <button class="study-mode-btn" id="practiceModeButton" onclick="setStudyMode('practice')">Practice Mode</button>\n          <button class="study-mode-btn" id="examModeButton" onclick="setStudyMode('exam')">Exam Mode</button>\n          <span class="study-mode-status" id="studyModeStatus"></span>\n        </div>\n        <div class="study-mode-actions">\n          <button class="btn btn-primary" id="submitExamButton" onclick="submitExam()" style="display:none">Submit Paper</button>\n          <button class="btn btn-secondary" id="newExamAttemptButton" onclick="startNewExamAttempt()" style="display:none">Start new attempt</button>\n        </div>\n      </div>\n      <div class="layout">`,
'mode controls');

replaceOnce(
`function defaultState(){\n  return {paperId:PAPERS[0].id, answers:{}, teacherNotes:'', revealReviewAnswers:false};\n}`,
`function defaultState(){\n  return {paperId:PAPERS[0].id, answers:{}, teacherNotes:'', revealReviewAnswers:false, studyMode:'practice', examSubmitted:false};\n}\nfunction normalizeState(state){\n  const next = state && typeof state==='object' ? state : defaultState();\n  next.studyMode = next.studyMode==='exam' ? 'exam' : 'practice';\n  next.examSubmitted = !!next.examSubmitted;\n  if(!next.answers || typeof next.answers!=='object') next.answers = {};\n  return next;\n}`,
'default state');

replaceOnce(
`    try{return JSON.parse(raw);}catch(e){}`,
`    try{return normalizeState(JSON.parse(raw));}catch(e){}`,
'normalize stored state');

replaceOnce(
`  st.paperId = document.getElementById('paperSelect').value;\n  saveState(st);`,
`  st.paperId = document.getElementById('paperSelect').value;\n  st.examSubmitted = false;\n  st.revealReviewAnswers = false;\n  saveState(st);`,
'paper switch resets exam submission');

replaceOnce(
`function switchTab(tab){\n  currentTab = tab;`,
`function canViewFeedback(){\n  const st = getState();\n  return st.studyMode!=='exam' || st.examSubmitted;\n}\nfunction answersLocked(){\n  const st = getState();\n  return st.studyMode==='exam' && st.examSubmitted;\n}\nfunction answerDisabledAttr(){\n  return answersLocked() ? 'disabled aria-disabled="true"' : '';\n}\nfunction switchTab(tab){\n  if(!canViewFeedback()&&(tab==='results'||tab==='review')){\n    alert('Exam feedback unlocks after you submit the paper.');\n    tab = 'paper';\n  }\n  currentTab = tab;`,
'tab feedback guard');

replaceOnce(
`function renderPaper(){\n  const p = activePaper();`,
`function renderStudyModeControls(){\n  const st = getState();\n  const exam = st.studyMode==='exam';\n  const submitted = exam && st.examSubmitted;\n  const practiceBtn = document.getElementById('practiceModeButton');\n  const examBtn = document.getElementById('examModeButton');\n  const status = document.getElementById('studyModeStatus');\n  const submit = document.getElementById('submitExamButton');\n  const restart = document.getElementById('newExamAttemptButton');\n  if(practiceBtn) practiceBtn.classList.toggle('active', !exam);\n  if(examBtn) examBtn.classList.toggle('active', exam);\n  if(status){\n    status.textContent = !exam\n      ? 'Feedback and review are available while you practise.'\n      : submitted\n        ? 'Exam submitted. Answers are locked and feedback is available.'\n        : 'Feedback stays hidden until you submit the paper.';\n  }\n  if(submit) submit.style.display = exam && !submitted ? '' : 'none';\n  if(restart) restart.style.display = submitted ? '' : 'none';\n}\nfunction renderPaper(){\n  const p = activePaper();\n  renderStudyModeControls();`,
'render mode controls');

replaceOnce(
`              <select onchange="saveAnswer('${q.id}', this.value)">`,
`              <select ${answerDisabledAttr()} onchange="saveAnswer('${q.id}', this.value)">`,
'lock matching answers');

replaceOnce(
`                <input type="text" class="short-input" value="${escapeAttr(getTripleAnswer(q.id,0))}" placeholder="Answer 1" oninput="saveTripleAnswer('${q.id}',0,this.value)">`,
`                <input type="text" class="short-input" ${answerDisabledAttr()} value="${escapeAttr(getTripleAnswer(q.id,0))}" placeholder="Answer 1" oninput="saveTripleAnswer('${q.id}',0,this.value)">`,
'lock triple answer 1');
replaceOnce(
`                <input type="text" class="short-input" value="${escapeAttr(getTripleAnswer(q.id,1))}" placeholder="Answer 2" oninput="saveTripleAnswer('${q.id}',1,this.value)">`,
`                <input type="text" class="short-input" ${answerDisabledAttr()} value="${escapeAttr(getTripleAnswer(q.id,1))}" placeholder="Answer 2" oninput="saveTripleAnswer('${q.id}',1,this.value)">`,
'lock triple answer 2');
replaceOnce(
`                <input type="text" class="short-input" value="${escapeAttr(getTripleAnswer(q.id,2))}" placeholder="Answer 3" oninput="saveTripleAnswer('${q.id}',2,this.value)">`,
`                <input type="text" class="short-input" ${answerDisabledAttr()} value="${escapeAttr(getTripleAnswer(q.id,2))}" placeholder="Answer 3" oninput="saveTripleAnswer('${q.id}',2,this.value)">`,
'lock triple answer 3');
replaceOnce(
`              <input type="text" class="short-input" value="${escapeAttr(getAnswer(q.id))}" oninput="saveAnswer('${q.id}', this.value)">`,
`              <input type="text" class="short-input" ${answerDisabledAttr()} value="${escapeAttr(getAnswer(q.id))}" oninput="saveAnswer('${q.id}', this.value)">`,
'lock short answer');
replaceOnce(
`              <input type="text" class="short-input" style="width:220px" value="${escapeAttr(getAnswer(n.id))}" oninput="saveAnswer('${n.id}', this.value)">`,
`              <input type="text" class="short-input" ${answerDisabledAttr()} style="width:220px" value="${escapeAttr(getAnswer(n.id))}" oninput="saveAnswer('${n.id}', this.value)">`,
'lock note answer');
replaceOnce(
`                <input type="radio" name="${q.id}" value="${escapeAttr(opt)}" ${getAnswer(q.id)===opt?'checked':''} onchange="saveAnswer('${q.id}', this.value)">`,
`                <input type="radio" name="${q.id}" value="${escapeAttr(opt)}" ${getAnswer(q.id)===opt?'checked':''} ${answerDisabledAttr()} onchange="saveAnswer('${q.id}', this.value)">`,
'lock mcq answer');

replaceOnce(
`function saveAnswer(id, value){\n  const st = getState();`,
`function saveAnswer(id, value){\n  if(answersLocked()) return;\n  const st = getState();`,
'guard saveAnswer');
replaceOnce(
`function saveTripleAnswer(id, idx, value){\n  const st = getState();`,
`function saveTripleAnswer(id, idx, value){\n  if(answersLocked()) return;\n  const st = getState();`,
'guard saveTripleAnswer');

replaceOnce(
`function renderResults(){\n  const p = activePaper();`,
`function renderResults(){\n  const p = activePaper();\n  if(!canViewFeedback()){\n    document.getElementById('scoreAnswered').textContent = '—';\n    document.getElementById('scoreCorrect').textContent = '—';\n    document.getElementById('scorePercent').textContent = '—';\n    document.getElementById('scorePaper').textContent = PAPERS.findIndex(x=>x.id===p.id)+1;\n    document.getElementById('progressFill').style.width = '0%';\n    renderChecklist('strengthList', ['Submit the paper to unlock exam feedback.'], 'ok');\n    renderChecklist('targetList', [], 'warn');\n    return;\n  }`,
'lock results before submit');

replaceOnce(
`function renderReview(){\n  const p = activePaper();\n  const st = getState();`,
`function renderReview(){\n  const p = activePaper();\n  const st = getState();\n  if(!canViewFeedback()){\n    document.getElementById('reviewContainer').innerHTML = '<div class="notice notice-gold">Exam feedback unlocks after you submit the paper.</div>';\n    const btn = document.getElementById('revealAnswersBtn');\n    const notice = document.getElementById('reviewRevealNotice');\n    if(btn){ btn.disabled = true; btn.style.opacity = '0.6'; btn.style.cursor = 'not-allowed'; }\n    if(notice){ notice.style.display = ''; notice.textContent = 'Submit the exam before reviewing answers.'; }\n    return;\n  }`,
'lock review before submit');

replaceOnce(
`function setMode(mode){\n  isTeacherMode = mode==='teacher';`,
`function setRoleMode(mode){\n  isTeacherMode = mode==='teacher';`,
'rename setMode');
replaceOnce(
`    setMode('teacher');`,
`    setRoleMode('teacher');`,
'teacher unlock rename');

replaceOnce(
`function closeModal(){ document.getElementById('modalPassword').classList.remove('show'); }`,
`function closeModal(){ document.getElementById('modalPassword').classList.remove('show'); }\nfunction clearPaperAnswersFromState(st){\n  const p = activePaper();\n  p.exercises.forEach(ex=>{\n    if(ex.type==='notes'){\n      ex.noteSections.forEach(section=>section.bullets.forEach(q=>delete st.answers[q.id]));\n    }else{\n      ex.questions.forEach(q=>delete st.answers[q.id]);\n    }\n  });\n}\nfunction setStudyMode(mode){\n  if(mode!=='practice' && mode!=='exam') return;\n  const st = getState();\n  if(st.studyMode===mode) return;\n  const status = paperCompletionStatus();\n  if(status.answered>0 && !confirm('Switch mode? This will clear the answers on the current paper so the new attempt starts clean.')) return;\n  clearPaperAnswersFromState(st);\n  st.studyMode = mode;\n  st.examSubmitted = false;\n  st.revealReviewAnswers = false;\n  saveState(st);\n  currentExercise = 0;\n  activeKeywords = [];\n  refreshAll();\n  switchTab('paper');\n}\nfunction submitExam(){\n  const st = getState();\n  if(st.studyMode!=='exam' || st.examSubmitted) return;\n  const status = paperCompletionStatus();\n  const message = status.complete\n    ? 'Submit this paper? Your answers will be locked.'\n    : `You have answered ${status.answered}/${status.total} questions. Submit anyway? Your answers will be locked.`;\n  if(!confirm(message)) return;\n  st.examSubmitted = true;\n  st.revealReviewAnswers = false;\n  saveState(st);\n  renderPaper();\n  renderResults();\n  renderReview();\n  switchTab('results');\n}\nfunction startNewExamAttempt(){\n  const st = getState();\n  if(st.studyMode!=='exam') return;\n  if(!confirm('Start a new exam attempt? This will clear the current paper answers.')) return;\n  clearPaperAnswersFromState(st);\n  st.examSubmitted = false;\n  st.revealReviewAnswers = false;\n  saveState(st);\n  currentExercise = 0;\n  activeKeywords = [];\n  refreshAll();\n  switchTab('paper');\n}`,
'exam lifecycle functions');

replaceOnce(
`function clearCurrentPaperAnswers(){\n  if(!confirm('Clear all answers from this practice paper?')) return;\n  const st = getState();\n  const p = activePaper();\n  p.exercises.forEach(ex=>{\n    if(ex.type==='notes'){\n      ex.noteSections.forEach(section=>{\n        section.bullets.forEach(q=>{\n          delete st.answers[q.id];\n        });\n      });\n    } else {\n      ex.questions.forEach(q=>{\n        delete st.answers[q.id];\n      });\n    }\n  });\n  st.revealReviewAnswers = false;`,
`function clearCurrentPaperAnswers(){\n  if(answersLocked()){ alert('This exam has been submitted. Start a new attempt to change answers.'); return; }\n  if(!confirm('Clear all answers from this practice paper?')) return;\n  const st = getState();\n  clearPaperAnswersFromState(st);\n  st.revealReviewAnswers = false;`,
'clear paper helper');

fs.writeFileSync(file, html);
console.log('Applied Practice/Exam mode to index.html');
