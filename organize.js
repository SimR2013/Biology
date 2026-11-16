(()=>{
function setup(){
const nav=document.getElementById('nav'),home=document.getElementById('home');if(!nav||!home)return;
const css=[
':root{--bg:#0a1921;--panel:#142d35;--accent:#91ecd4;--sub:#b6cfca}',
'body{background:radial-gradient(ellipse at 85% 0%,#173e42,transparent 40%),var(--bg)}',
'header{background:linear-gradient(115deg,#11413f,#142d42 75%)}',
'header .inside,main{max-width:1180px}',
'header h1{letter-spacing:-.035em}',
'#nav.nav{display:flex;flex-wrap:wrap;gap:8px;align-items:flex-start;margin-top:16px}',
'#nav .nav-group{flex:1 1 210px;min-width:190px}',
'#nav .nav-group summary{list-style:none;cursor:pointer;background:#1b4148;border:1px solid #46787a;border-radius:12px;padding:12px 15px;font-weight:850;color:#f3fff9;display:flex;justify-content:space-between}',
'#nav .nav-group summary:after{content:"▾";color:#a4efda}',
'#nav .nav-group summary::-webkit-details-marker{display:none}',
'#nav .nav-group[open] summary{border-radius:12px 12px 0 0;background:#26565a}',
'#nav .nav-group[open] summary:after{content:"▴"}',
'#nav .nav-links{display:grid;gap:3px;padding:6px;background:#102e37;border:1px solid #46787a;border-top:0;border-radius:0 0 12px 12px}',
'#nav .nav-links button{background:transparent;border:0;color:#dceee9;text-align:left;padding:10px 12px;width:100%;border-radius:9px;white-space:normal}',
'#nav .nav-links button:hover{background:#235158}',
'#nav .nav-links button.active{background:#91ecd4;color:#09342e}',
'#nav>.nav-home{background:#9bf0d7;color:#0b2b2c;flex:0 0 auto}',
'.organize-banner{margin:16px 0 4px;background:linear-gradient(110deg,#1d5450,#1a3d53);border:1px solid #6dbfae;border-radius:16px;padding:16px;display:flex;justify-content:space-between;align-items:center;gap:14px}',
'.organize-banner strong{display:block;color:#d0fff2;font-size:1.1rem}',
'.organize-banner p{margin:4px 0;font-size:.88rem;color:#c4ded5}',
'.organize-banner a,.organize-path button,.organize-path a{background:#93e9d6;border:0;border-radius:11px;color:#10332f;text-decoration:none;padding:11px 14px;display:inline-block;font-weight:850;cursor:pointer}',
'.organize-lead{background:linear-gradient(125deg,#1a4b4a,#153143);border:1px solid #578f88;padding:22px;border-radius:20px;margin-bottom:16px}',
'.organize-lead h2{font-size:clamp(1.5rem,3vw,2.15rem);margin:8px 0;letter-spacing:-.035em}',
'.organize-lead p{max-width:690px;margin:0}',
'.organize-paths{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px;margin:16px 0}',
'.organize-path{border:1px solid #3e6b6c;background:#152e39;border-radius:17px;padding:20px;display:flex;flex-direction:column;gap:8px}',
'.organize-path h3{margin:0;font-size:1.12rem;color:#ebfff5}',
'.organize-path p{font-size:.91rem;margin:0 0 10px;flex:1}',
'.organize-path button{width:100%;margin-top:auto}',
'.organize-shortcuts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:12px 0 18px}',
'.organize-shortcuts button{background:#1e3d46;border:1px solid #47777a;color:#edfdf8;text-align:center;border-radius:12px;padding:14px 8px;font-weight:800}',
'.organize-shortcuts small{display:block;color:#bad2ca;font-size:.72rem;font-weight:500;margin-top:4px}',
'@media(max-width:720px){.organize-paths{grid-template-columns:1fr}.organize-shortcuts{grid-template-columns:1fr 1fr}.organize-banner{align-items:flex-start;flex-direction:column}#nav .nav-group{flex:1 1 100%}#nav>.nav-home{flex:1 1 100%}}'
].join('\n');
const st=document.createElement('style');st.textContent=css;document.head.append(st);
const buttons=[...nav.querySelectorAll('button[data-page]')],by=new Map(buttons.map(b=>[b.dataset.page,b]));
nav.replaceChildren();const dash=by.get('home');if(dash){dash.classList.add('nav-home');dash.textContent='⌂ Dashboard';nav.append(dash)}
const groups=[
['📚 Study & Memorize',['learn','everything','flash','tutor','ai-live']],
['📝 Tests & Exam Prep',['practice','exam','hardcore','written','generator']],
['🎮 Play & Explore',['path','lab']]
];
for(const [label,pages] of groups){const d=document.createElement('details');d.className='nav-group';d.open=label.includes('Study');const sum=document.createElement('summary');sum.textContent=label;const wrap=document.createElement('div');wrap.className='nav-links';for(const p of pages){const b=by.get(p);if(b)wrap.append(b)}d.append(sum,wrap);nav.append(d)}
const oldBanner=[...document.querySelectorAll('header .inside>div')].find(e=>e!==nav&&e.textContent.includes('NEW • BIOFORGE ECOSYSTEM COMMAND CENTER'));if(oldBanner)oldBanner.remove();
const feature=document.createElement('div');feature.className='organize-banner';feature.innerHTML='<div><strong>🧬 BioForge: Ecosystem Command Center</strong><p>Interactive ecological experiments, missions, XP, and science reasoning — separate from your regular tests.</p></div><a href="bioforge.html">Launch BioForge ↗</a>';
nav.before(feature);
const lead=document.createElement('div');lead.className='organize-lead';lead.innerHTML='<div class="tag">YOUR CHAPTER 4 STUDY HQ</div><h2>Choose how you want to learn.</h2><p>Everything is grouped into three paths: master the material, prepare for the actual test, or use your knowledge in ecosystem simulations.</p>';
home.prepend(lead);
function open(p){const b=by.get(p);if(b)b.click()}
const paths=document.createElement('div');paths.className='organize-paths';
for(const entry of [
['📚','Study & Memorize','Read the lesson notes, review definitions, and use the flashcards with recall checks.','Open study notes','learn'],
['🎯','Test Preparation','Practice the teacher-style exam format: 23 questions, including 2 written responses.','Start mock exam','exam'],
['🌎','Explore & Play','Control food webs, runoff and carbon pathways in original BioForge missions.','Launch BioForge','bioforge']]){
const [ico,title,desc,action,page]=entry;const box=document.createElement('div');box.className='organize-path';box.innerHTML='<div style="font-size:2rem">'+ico+'</div><h3>'+title+'</h3><p>'+desc+'</p><button type="button">'+action+'</button>';box.querySelector('button').onclick=()=>page==='bioforge'?location.assign('bioforge.html'):open(page);paths.append(box)}
lead.after(paths);
const quick=document.createElement('div');quick.className='organize-shortcuts';
for(const [title,subtitle,page] of [['🧠 Flashcards','Recall concepts','flash'],['♾️ Endless Tests','New scenarios','generator'],['✍️ Written Prep','CER reasoning','written'],['🔥 Hardcore','High difficulty','hardcore']]){
const b=document.createElement('button');b.innerHTML=title+'<small>'+subtitle+'</small>';b.onclick=()=>open(page);quick.append(b)}
paths.after(quick);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();