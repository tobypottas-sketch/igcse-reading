import fs from 'node:fs';
const file='index.html';
let html=fs.readFileSync(file,'utf8');
const once=(before,after,label)=>{ if(html.includes(after)) return; if(!html.includes(before)) throw new Error('Missing '+label); html=html.replace(before,after); };

once("const STORAGE_KEY = 'igcse0511readingpapersv2';\nconst TEACHER_PWD = 'NKCS1234';","const STORAGE_KEY_BASE = 'igcse0511readingpapersv2';\nlet hubStorageNamespace = 'anonymous';\nlet hubStaffAccess = false;\nlet readingAppInitialised = false;\nlet readingDomReady = false;",'storage constants');

once('<button id="btnTeacherMode" onclick="requestTeacherMode()">Teacher Mode</button>','<button id="btnTeacherMode" onclick="requestTeacherMode()" style="display:none">Teacher Mode</button>','teacher button default');

html=html.replaceAll('window.localStorage.getItem(STORAGE_KEY)','window.localStorage.getItem(storageKey())')
  .replaceAll('window.localStorage.setItem(STORAGE_KEY, value)','window.localStorage.setItem(storageKey(), value)')
  .replaceAll('localStorage.removeItem(STORAGE_KEY)','localStorage.removeItem(storageKey())');

once("let isTeacherMode = false;","let isTeacherMode = false;\n\nfunction storageKey(){\n  return hubStorageNamespace === 'anonymous' ? STORAGE_KEY_BASE : STORAGE_KEY_BASE + ':' + hubStorageNamespace;\n}\nfunction hasHubStaffAccess(){ return hubStaffAccess === true && window.parent !== window; }\nfunction applyHubStorageNamespace(namespace){\n  const clean=String(namespace||'').trim().replace(/[^a-zA-Z0-9_-]/g,'').slice(0,96);\n  if(!clean || clean===hubStorageNamespace) return;\n  hubStorageNamespace=clean;\n  MEMORY_STATE_CACHE=null;\n  if(readingAppInitialised) refreshAll();\n}\nfunction applyTeacherAccessUI(){\n  const teacherBtn=document.getElementById('btnTeacherMode');\n  if(teacherBtn) teacherBtn.style.display=hasHubStaffAccess() ? '' : 'none';\n  if(!hasHubStaffAccess() && isTeacherMode) setRoleMode('student');\n}\nwindow.addEventListener('message',function(event){\n  if(window.parent===window || event.source!==window.parent || event.origin!==window.location.origin) return;\n  const data=event.data;\n  if(!data || data.type!=='self-study-hub-context') return;\n  applyHubStorageNamespace(data.storageNamespace);\n  hubStaffAccess=data.staffAccess===true;\n  initialiseReadingApp();\n  applyTeacherAccessUI();\n});",'hub state');

once("function setRoleMode(mode){\n  isTeacherMode = mode==='teacher';","function setRoleMode(mode){\n  if(mode==='teacher' && !hasHubStaffAccess()) return;\n  isTeacherMode = mode==='teacher';",'role guard');

const oldTeacher=`function requestTeacherMode(){
  document.getElementById('modalPassword').classList.add('show');
  document.getElementById('teacherPwd').value='';
  document.getElementById('pwdError').style.display='none';
}
function checkTeacherPassword(){
  if(document.getElementById('teacherPwd').value===TEACHER_PWD){
    closeModal();
    setRoleMode('teacher');
    switchTab('teacher');
  } else {
    document.getElementById('pwdError').style.display='block';
  }
}`;
const newTeacher=`function requestTeacherMode(){
  if(!hasHubStaffAccess()){
    alert('Teacher tools are available through the authenticated Self-Study Hub.');
    return;
  }
  setRoleMode('teacher');
  switchTab('teacher');
}
function checkTeacherPassword(){ requestTeacherMode(); }`;
once(oldTeacher,newTeacher,'teacher password flow');

once("window.addEventListener('DOMContentLoaded', refreshAll);","function initialiseReadingApp(){\n  if(readingAppInitialised || !readingDomReady) return;\n  readingAppInitialised=true;\n  refreshAll();\n  applyTeacherAccessUI();\n}\nwindow.addEventListener('DOMContentLoaded',function(){\n  readingDomReady=true;\n  if(window.parent===window) initialiseReadingApp();\n});",'deferred init');

fs.writeFileSync(file,html);
