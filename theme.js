/* Shared, persistent, accessible color-theme selector. */
(function(){
'use strict';
const key='biology:color-theme';
const themes=[['blue','💙 Calm Blue'],['midnight','🌙 Midnight'],['lavender','💜 Lavender'],['forest','🌲 Forest'],['light','☀️ Light']];
const allowed=new Set(themes.map(t=>t[0]));
let saved='blue';
try{const s=localStorage.getItem(key);if(allowed.has(s))saved=s}catch(e){}
function apply(id){const name=allowed.has(id)?id:'blue';document.documentElement.setAttribute('data-study-theme',name);document.body.classList.remove('light');try{localStorage.setItem(key,name)}catch(e){}document.querySelectorAll('.study-theme-select').forEach(s=>s.value=name);const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=name==='light'?'#eaf2fb':name==='forest'?'#102822':name==='lavender'?'#211d3b':name==='midnight'?'#101626':'#0e2038'}
function init(){const header=document.querySelector('header');if(!header)return;const wrap=document.createElement('div');wrap.className='study-theme-wrap';const label=document.createElement('label');label.textContent='Theme';const picker=document.createElement('select');picker.className='study-theme-select';picker.setAttribute('aria-label','Choose color theme');picker.id='studyThemeSelect';label.htmlFor=picker.id;for(const [id,name] of themes){const option=document.createElement('option');option.value=id;option.textContent=name;picker.append(option)}picker.value=saved;picker.addEventListener('change',()=>apply(picker.value));wrap.append(label,picker);const homeSlot=document.querySelector('.header-links');const forgeSlot=document.querySelector('header .bar');if(homeSlot)homeSlot.prepend(wrap);else if(forgeSlot)forgeSlot.append(wrap);else{const inside=header.querySelector('.inside')||header;inside.prepend(wrap)}apply(saved)}
document.documentElement.setAttribute('data-study-theme',saved);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
