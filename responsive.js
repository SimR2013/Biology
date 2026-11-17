/* Adaptive navigation for the Biology Study Vault — works without dependencies */
(function(){
'use strict';
function init(){
const root=document.body,isHub=!!document.getElementById('chapters'),isChapter=!!document.getElementById('nav'),isForge=!!document.getElementById('missions');
if(!(isHub||isChapter||isForge))return;
const base=[['⌂','Home','index.html'],['📘','Learn','chapter4.html?mode=course'],['🎯','Tests','chapter4.html?mode=exam'],['🧠','Cards','chapter4.html?mode=flash'],['🚀','Smart','chapter4.html?mode=smart'],['🎮','Game','bioforge.html']];
const dock=document.createElement('nav');dock.className='vault-dock';dock.setAttribute('aria-label','Mobile quick navigation');
const currentMode=new URLSearchParams(location.search).get('mode');const here=isHub?'Home':isForge?'Game':currentMode==='smart'?'Smart':currentMode==='exam'?'Tests':currentMode==='flash'?'Cards':'Learn';
dock.innerHTML=base.map(([emoji,label,url])=>'<a href="'+url+'"'+(here===label?' aria-current="page"':'')+'><span aria-hidden="true">'+emoji+'</span>'+label+'</a>').join('');
root.appendChild(dock);
const top=document.createElement('button');top.className='vault-to-top';top.type='button';top.textContent='↑';top.setAttribute('aria-label','Return to top');top.onclick=()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});root.appendChild(top);
let raf=0;addEventListener('scroll',()=>{if(raf)return;raf=requestAnimationFrame(()=>{top.classList.toggle('visible',scrollY>550);raf=0})},{passive:true});
if(isChapter){const nav=document.getElementById('nav');const actions=document.createElement('div');actions.className='vault-screen-actions';const jump=document.createElement('select');jump.className='vault-view-chooser';jump.setAttribute('aria-label','Jump directly to a study mode');let buttons=[...nav.querySelectorAll('button[data-page]')];const labels={home:'Dashboard',smart:'Smart Study Hub',course:'Learn Everything (Guided)',learn:'Study notes',everything:'All concepts',flash:'Flashcards',tutor:'Offline tutor','ai-live':'Live AI (requires setup)',practice:'Practice questions',exam:'Mock exam',hardcore:'Hardcore',written:'Written responses',generator:'Endless tests',path:'Learning path',lab:'Ecology lab'};jump.innerHTML='<option value="">Jump to study mode…</option>'+buttons.map(b=>'<option value="'+b.dataset.page+'">'+(labels[b.dataset.page]||b.textContent.trim())+'</option>').join('');
jump.onchange=()=>{const b=nav.querySelector('button[data-page="'+jump.value+'"]');if(b){b.click();const heading=document.querySelector('.view.active h2,.view.active h1');(heading||document.querySelector('main'))?.scrollIntoView({behavior:'smooth',block:'start'})}jump.value=''};
const back=document.createElement('a');back.href='index.html';back.textContent='← All chapters';actions.append(jump,back);const main=document.querySelector('main');if(main)main.prepend(actions);
}
if(isHub){const tools=document.getElementById('vault-tools');if(tools){const s=document.createElement('a');s.href='#vault-tools';s.className='badge';s.textContent='⚡ Jump to dashboard';s.style.marginLeft='8px';const hero=document.querySelector('.hero .intro');hero?.after(s)}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();