import fs from 'node:fs';

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

if (html.includes('READING LISTENING-SUITE VISUAL REFRESH')) {
  console.log('Visual refresh already applied.');
  process.exit(0);
}

const oldHeader = `<header class="app-header">
  <div class="header-inner">
    <div class="header-brand">
      <div class="header-logo">0511</div>
      <div class="header-titles">
        <h1>Reading Papers Dashboard</h1>
        <div class="subtitle">IGCSE English as a Second Language — three full reading-only practice papers</div>
      </div>
    </div>
    <div class="header-qual">
      Paper 1 practice<br>Exercises 1–4 only<br>Classroom training tool
    </div>
    <div class="header-actions">
      <button id="btnStudentMode" class="active" onclick="setRoleMode('student')">Student Mode</button>
      <button id="btnTeacherMode" onclick="requestTeacherMode()">Teacher Mode</button>
    </div>
  </div>
</header>`;

const newHeader = `<header class="app-header">
  <div class="hero-shell">
    <div class="brand-panel">
      <img src="cambridge-english-header.png" alt="Cambridge English" class="cambridge-brand">
    </div>
    <div class="hero-copy">
      <div class="hero-kicker">CAMBRIDGE IGCSE · ENGLISH AS A SECOND LANGUAGE</div>
      <h1>Cambridge IGCSE 0511 Reading Resource</h1>
      <p>Interactive reading practice with full papers, exam-mode practice, guided review and progress feedback.</p>
    </div>
    <div class="hero-reading-tools">
      <div class="hero-reading-icon" aria-hidden="true">
        <svg viewBox="0 0 96 96" role="presentation">
          <circle cx="48" cy="48" r="44" fill="currentColor" opacity=".10"/>
          <path d="M25 28h20c7 0 12 4 12 10v34c-3-4-7-6-13-6H25zM71 28H51c-7 0-12 4-12 10v34c3-4 7-6 13-6h19z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>
          <path d="M48 39v30" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="header-actions">
        <button id="btnStudentMode" class="active" onclick="setRoleMode('student')">Student Mode</button>
        <button id="btnTeacherMode" onclick="requestTeacherMode()">Teacher Mode</button>
      </div>
    </div>
  </div>
</header>`;

if (!html.includes(oldHeader)) throw new Error('Expected Reading header block not found.');
html = html.replace(oldHeader, newHeader);

const polish = String.raw`
/* ==========================================================
   READING LISTENING-SUITE VISUAL REFRESH
   Visual-only layer aligned to the Cambridge Listening app.
   Reading content, scoring and Practice/Exam behaviour unchanged.
   ========================================================== */
:root{
  --teal:#149b96;
  --teal-deep:#0d7f7b;
  --teal-lite:#eaf8f7;
  --plum:#bf8aa2;
  --plum-deep:#94637a;
  --plum-lite:#f8e8f0;
  --suite-sage:#8fb39a;
  --suite-sage-lite:#eaf5ee;
  --suite-line:#dfe8e6;
  --surface:#ffffff;
  --surface-soft:#f7fbfa;
  --shadow-soft:0 10px 30px rgba(38,57,54,.07);
  --shadow-card:0 4px 18px rgba(38,57,54,.06);
}
body{
  background:
    radial-gradient(circle at 8% 0%,rgba(191,138,162,.09),transparent 28%),
    radial-gradient(circle at 92% 3%,rgba(20,155,150,.08),transparent 30%),
    #f7faf9;
  color:#2f3435;
  line-height:1.55;
}
.app-header{
  position:relative;
  top:auto;
  z-index:10;
  max-width:1360px;
  margin:18px auto 0;
  padding:0 18px;
  background:transparent;
  color:#2f2c2e;
  box-shadow:none;
}
.hero-shell{
  position:relative;
  overflow:hidden;
  display:grid;
  grid-template-columns:minmax(220px,290px) 1fr 180px;
  gap:28px;
  align-items:center;
  min-height:218px;
  padding:24px 28px;
  border:1px solid #cfe6e3;
  border-radius:24px;
  background:linear-gradient(100deg,rgba(255,255,255,.98) 0%,rgba(248,253,252,.98) 56%,rgba(231,248,246,.96) 100%);
  box-shadow:var(--shadow-soft);
}
.hero-shell::before{
  content:'';
  position:absolute;
  inset:auto 0 18px 0;
  height:72px;
  opacity:.10;
  background:repeating-linear-gradient(90deg,transparent 0 11px,var(--teal) 12px 14px,transparent 15px 26px);
  clip-path:polygon(0 48%,3% 35%,6% 70%,9% 28%,12% 62%,15% 18%,18% 75%,21% 42%,24% 66%,27% 29%,30% 54%,33% 20%,36% 72%,39% 38%,42% 60%,45% 26%,48% 68%,51% 35%,54% 58%,57% 24%,60% 71%,63% 41%,66% 64%,69% 31%,72% 56%,75% 21%,78% 70%,81% 36%,84% 61%,87% 27%,90% 66%,93% 39%,96% 57%,100% 46%,100% 100%,0 100%);
  pointer-events:none;
}
.brand-panel{
  position:relative;
  z-index:1;
  display:flex;
  align-items:center;
  justify-content:center;
  min-height:150px;
  padding:10px 14px;
  border-right:1px solid #b9deda;
}
.cambridge-brand{display:block;width:100%;max-width:260px;height:auto;object-fit:contain;filter:contrast(1.02)}
.hero-copy{position:relative;z-index:1;min-width:0}
.hero-kicker{
  display:inline-flex;
  margin-bottom:10px;
  padding:6px 10px;
  border:1px solid #cfe8e6;
  border-radius:999px;
  background:rgba(234,248,247,.8);
  color:var(--teal-deep);
  font-size:.76rem;
  font-weight:800;
  letter-spacing:.05em;
  text-transform:uppercase;
}
.hero-copy h1{margin:0;max-width:780px;font-size:clamp(2rem,3vw,2.8rem);line-height:1.06;letter-spacing:-.03em;color:#202527}
.hero-copy p{margin:13px 0 0;max-width:760px;font-size:1.08rem;line-height:1.5;color:#4e5a5a}
.hero-reading-tools{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:14px}
.hero-reading-icon{
  display:grid;place-items:center;width:96px;height:96px;border-radius:50%;color:var(--teal);
  background:rgba(255,255,255,.72);border:1px solid #bfe2df;box-shadow:0 8px 24px rgba(20,155,150,.12)
}
.hero-reading-icon svg{width:74px;height:74px}
.header-actions{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
.header-actions button{
  background:#f3f8f7;color:#475453;border:1px solid #d8e7e4;padding:7px 11px;border-radius:999px;
  font-size:.74rem;font-weight:800;box-shadow:none
}
.header-actions button.active{background:var(--teal-lite);color:var(--teal-deep);border-color:#c8e6e3}
.app-container{max-width:1360px;padding-top:16px}
.tab-bar{
  gap:4px;padding:9px 10px;margin-bottom:18px;border:1px solid #dce8e6;border-radius:18px;
  background:rgba(255,255,255,.92);box-shadow:var(--shadow-card)
}
.tab-btn{padding:11px 16px;border-radius:12px;font-size:.96rem;font-weight:750;color:#53605f;transition:background .18s ease,color .18s ease,box-shadow .18s ease}
.tab-btn.active{background:var(--teal-lite);color:var(--teal-deep);box-shadow:inset 0 0 0 1px #c9e7e4}
.card{border-color:var(--suite-line);border-radius:20px;background:rgba(255,255,255,.97);box-shadow:var(--shadow-card);padding:22px}
.card-header{font-size:1.12rem;color:#263331;border-bottom:1px solid #e3ecea;padding-bottom:12px;margin-bottom:16px}
.sidebar-box{border-color:#dce8e6;border-radius:16px;background:linear-gradient(180deg,#fff 0%,#f9fcfb 100%);box-shadow:0 2px 9px rgba(38,57,54,.035);padding:16px}
.layout{grid-template-columns:320px 1fr;gap:20px}
.btn{border:1px solid transparent;border-radius:12px;padding:9px 15px;transition:background .18s ease,border-color .18s ease,box-shadow .18s ease}
.btn-primary{background:var(--teal);color:#fff;box-shadow:0 4px 12px rgba(20,155,150,.13)}
.btn-primary:hover{background:var(--teal-deep)}
.btn-secondary{background:#f3f8f7;color:#344240;border-color:#d9e7e4}
.btn-secondary:hover{background:#eaf3f1}
.btn-danger{background:#ae728d;color:#fff;border-color:#ae728d;box-shadow:0 4px 12px rgba(155,98,124,.12)}
.study-mode-bar{
  padding:14px 16px;border-color:#dce8e6;border-radius:16px;background:linear-gradient(90deg,#f9fcfb 0%,#fff 100%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.8)
}
.study-mode-label{color:#263331}
.study-mode-btn{border-color:#d9e7e4;border-radius:12px;background:#fff;color:#4c5958;padding:9px 15px}
#practiceModeButton.active{background:var(--teal-lite);border-color:#bfe3df;color:var(--teal-deep);box-shadow:0 0 0 3px rgba(20,155,150,.08)}
#examModeButton.active{background:var(--plum-lite);border-color:#e2c4d1;color:var(--plum-deep);box-shadow:0 0 0 3px rgba(191,138,162,.10)}
#submitExamButton{background:linear-gradient(135deg,#ae728d,#8e667b);border-color:#9c667f;box-shadow:0 4px 12px rgba(155,98,124,.16)}
.study-mode-status{font-size:.84rem;color:#667270}
.exercise-nav{gap:8px;margin-bottom:16px}
.exercise-btn{border-color:#dce7e5;border-radius:12px;background:#fff;padding:11px 15px;color:#374341;transition:background .18s ease,border-color .18s ease,box-shadow .18s ease}
.exercise-btn:hover{border-color:#b9dcd8;box-shadow:0 3px 12px rgba(38,57,54,.05)}
.exercise-btn.active{background:linear-gradient(135deg,#149b96 0%,#5b9f98 100%);color:#fff;border-color:#149b96;box-shadow:0 5px 15px rgba(20,155,150,.13)}
.notice{border-radius:13px;font-size:.88rem;line-height:1.5}
.notice-blue{background:#edf7fa;border-color:#d5e8ed}
.notice-green{background:var(--suite-sage-lite);border-color:#d5e8da}
.notice-gold{background:#faf2f6;border-color:#ead7df}
.notice-rose{background:var(--plum-lite);border-color:#ead0dc}
.passage-box{background:#fffdfb;border-color:#ebe4dc;border-radius:17px;padding:24px 26px;line-height:1.9;box-shadow:inset 0 1px 0 rgba(255,255,255,.85)}
.passage-line{border-radius:10px;padding:5px 7px}
.passage-line:hover{background:#f2f9f8}
.keyword-chip{border-color:#dce7e5;border-radius:999px;background:#fff;padding:6px 12px;font-weight:700}
.keyword-chip.active{background:var(--teal-lite);border-color:#bfe1dd;color:var(--teal-deep)}
.question-block{border-color:#dfe8e6;border-radius:17px;padding:17px;background:#fff;box-shadow:0 2px 9px rgba(38,57,54,.035)}
.q-title{font-size:.98rem;color:#26302f}
.option{border-color:#e0e9e7;border-radius:12px;padding:10px 12px}
.option:hover{background:#f6fbfa;border-color:#c9dfdc}
input[type="text"],input[type="password"],textarea,select{border-color:#d8e5e2;border-radius:11px;background:#fff}
input:focus,textarea:focus,select:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(20,155,150,.10)}
.stat-card{border-color:#dfe8e6;border-radius:17px;background:linear-gradient(180deg,#fff 0%,#fbfdfc 100%);box-shadow:0 2px 9px rgba(38,57,54,.035)}
.stat-value{color:var(--teal-deep)}
.progress-bg{background:#e8f1ef;border-radius:999px}
.progress-fill{background:linear-gradient(90deg,var(--teal),var(--suite-sage));border-radius:999px}
.review-item{border-color:#dfe8e6;border-radius:16px;box-shadow:0 2px 8px rgba(38,57,54,.03)}
.answer-box{background:#f8fbfa;border-color:#e2ebe9;border-radius:12px}
.app-footer{border-top-color:#dfe8e6;color:#6e7b79}
@media(max-width:1180px){
  .hero-shell{grid-template-columns:220px 1fr 150px;gap:18px;padding:22px;min-height:190px}
  .brand-panel{min-height:130px;padding:8px 10px}
  .hero-reading-icon{width:78px;height:78px}.hero-reading-icon svg{width:62px;height:62px}
  .layout{grid-template-columns:1fr}
}
@media(max-width:699px){
  .app-header{margin-top:10px;padding:0 10px}
  .hero-shell{grid-template-columns:1fr;gap:12px;padding:18px;min-height:0}
  .brand-panel{justify-content:flex-start;min-height:0;padding:0 0 14px;border-right:0;border-bottom:1px solid #cfe4e1}
  .cambridge-brand{max-width:230px}
  .hero-reading-tools{align-items:flex-start}.hero-reading-icon{display:none}
  .hero-kicker{font-size:.68rem}.hero-copy h1{font-size:1.85rem}.hero-copy p{font-size:1rem}
  .header-actions{justify-content:flex-start}
  .tab-bar{padding:8px}
  .card{padding:17px}
  .passage-box{padding:17px 15px}
}
`;

if (!html.includes('</style>')) throw new Error('Closing style tag not found.');
html = html.replace('</style>', `${polish}\n</style>`);
html = html.replace('<title>IGCSE 0511 Reading Papers Dashboard</title>', '<title>Cambridge IGCSE 0511 Reading Resource</title>');

fs.writeFileSync(file, html);
console.log('Applied Listening-suite visual refresh to Reading.');
