/* Biology Study Vault — consistent preset, automatic and color wheel themes */
(()=>{'use strict';
const KEY='biology:color-theme',HUE='biology:custom-hue',LIGHT='biology:custom-light';
const presets=[['blue','💙 Calm Blue'],['midnight','🌙 Midnight'],['lavender','💜 Lavender'],['forest','🌲 Forest'],['light','☀️ Light'],['ocean','🌊 Ocean'],['rose','🌹 Rose'],['sunset','🌅 Sunset'],['amber','🍯 Amber'],['mint','🍃 Mint'],['berry','🫐 Berry'],['slate','🪨 Slate'],['beach','🏖️ Beach Blue + Orange'],['tropical','🌴 Tropical Aqua + Coral'],['sunshine','☀️ Sunshine Yellow + Blue'],['candy','🍬 Candy Pink + Mint'],['lagoon','🐠 Lagoon Teal + Peach'],['festival','🎉 Festival Purple + Lime'],['auto','🌓 Auto (device)'],['custom','🎨 Custom color wheel']];
const known=new Set(presets.map(x=>x[0]));
const read=(key,def)=>{try{return localStorage.getItem(key)||def}catch(e){return def}};
const save=(key,val)=>{try{localStorage.setItem(key,val)}catch(e){}};
let chosen=known.has(read(KEY,'blue'))?read(KEY,'blue'):'blue';
let hue=Math.max(0,Math.min(359,Number(read(HUE,'210'))||210));
let lightChoice=read(LIGHT,'dark');
const mq=window.matchMedia?matchMedia('(prefers-color-scheme: light)'):null;
const root=document.documentElement;
function hex(h,s,l){s/=100;l/=100;const a=s*Math.min(l,1-l),fn=n=>{const k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1)))).toString(16).padStart(2,'0')};return '#'+fn(0)+fn(8)+fn(4)}
function customPalette(H,light){
const base=light?{bg:hex(H,34,96),head:hex(H,45,98),card:'#ffffff',card2:hex(H,34,90),border:hex(H,28,74),text:hex(H,40,19),muted:hex(H,24,37),accent:hex(H,72,34),accentText:'#ffffff',focus:hex((H+35)%360,66,37),soft:hex(H,50,32)}:{bg:hex(H,42,12),head:hex(H,45,16),card:hex(H,36,21),card2:hex(H,33,27),border:hex(H,23,43),text:'#f1f6ff',muted:hex(H,25,79),accent:hex(H,67,78),accentText:hex(H,42,13),focus:'#f0dba6',soft:hex(H,65,87)};
for(const [k,v] of Object.entries(base))root.style.setProperty('--t-'+k.replace(/[A-Z]/g,x=>'-'+x.toLowerCase()),v);
return base.bg
}
function clearPalette(){for(const s of ['bg','header','card','card2','border','text','muted','accent','accent-text','focus','soft'])root.style.removeProperty('--t-'+s)}
function apply(mode,remember=true){
chosen=known.has(mode)?mode:'blue';const resolved=chosen==='auto'?(mq?.matches?'light':'blue'):chosen;
root.setAttribute('data-study-theme',resolved==='custom'?'custom':resolved);
root.setAttribute('data-study-choice',chosen);
clearPalette();
const bg=resolved==='custom'?customPalette(hue,lightChoice==='light'):getComputedStyle(root).getPropertyValue('--t-bg').trim();
document.body?.classList.remove('light');
const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=bg||'#0e2038';
if(remember)save(KEY,chosen);
document.querySelectorAll('.study-theme-select').forEach(x=>x.value=chosen);
document.querySelectorAll('.theme-picked').forEach(x=>x.textContent=presets.find(x=>x[0]===chosen)?.[1]||'');
document.querySelectorAll('.custom-color-controls').forEach(x=>x.hidden=chosen!=='custom');
}
function decorate(){const page=document.getElementById('chapters')?'home':document.getElementById('nav')?'chapter':document.getElementById('missions')?'forge':'other';
const header=document.querySelector('header');if(!header)return;
const wrap=document.createElement('div');wrap.className='study-theme-wrap';
wrap.innerHTML='<label for="studyThemeSelect">🎨 Theme</label><select id="studyThemeSelect" class="study-theme-select" aria-label="Choose color theme"></select><button type="button" class="theme-more" aria-expanded="false" aria-controls="themePanel">Customize</button><div class="theme-panel" id="themePanel" hidden><strong>Color & appearance</strong><p>Pick a preset, match your device automatically, or make your own color.</p><div class="theme-swatch-grid" id="themeSwatches"></div><div class="custom-color-controls" hidden><label for="themeWheel">Color wheel</label><input id="themeWheel" type="color" value="#3976bd" aria-label="Custom theme color wheel"><label for="themeHue">Fine-tune color</label><input id="themeHue" type="range" min="0" max="359" value="210"><label for="themeCustomLight">Custom background</label><select id="themeCustomLight"><option value="dark">Dark</option><option value="light">Light</option></select></div><p class="theme-help">Auto follows your phone or computer light/dark setting. Your choice is saved on this device.</p></div>';
const selector=wrap.querySelector('.study-theme-select');
presets.forEach(([id,label])=>{const option=document.createElement('option');option.value=id;option.textContent=label;selector.append(option)});
selector.onchange=()=>apply(selector.value);
const toggle=wrap.querySelector('.theme-more'),panel=wrap.querySelector('#themePanel');toggle.onclick=()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden))};
const grid=wrap.querySelector('#themeSwatches');
presets.forEach(([id,label])=>{let b=document.createElement('button');b.type='button';b.className='theme-swatch';b.dataset.theme=id;b.innerHTML='<span class="theme-swatch-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>'+label+'</span>';b.setAttribute('aria-label','Use '+label+' theme');b.onclick=()=>apply(id);grid.append(b)});
const wheel=wrap.querySelector('#themeWheel'),slider=wrap.querySelector('#themeHue'),mode=wrap.querySelector('#themeCustomLight');
function rgbToHue(v){const num=parseInt(v.slice(1),16);let r=(num>>16)/255,g=((num>>8)&255)/255,b=(num&255)/255;let min=Math.min(r,g,b),max=Math.max(r,g,b),d=max-min;if(!d)return 210;let h=max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4;return Math.round((h*60+360)%360)}
wheel.value=hex(hue,65,52);slider.value=hue;mode.value=lightChoice;
wheel.oninput=()=>{hue=rgbToHue(wheel.value);slider.value=hue;save(HUE,String(hue));apply('custom')};
slider.oninput=()=>{hue=Number(slider.value);wheel.value=hex(hue,65,52);save(HUE,String(hue));apply('custom')};
mode.onchange=()=>{lightChoice=mode.value;save(LIGHT,lightChoice);apply('custom')};
const slot=header.querySelector('.header-links')||header.querySelector('.bar')||header.querySelector('.inside')||header;slot.prepend(wrap);
apply(chosen,false);
if(page==='home'||page==='chapter')addGuide(page);
}
const links=[
['📘 Learn Everything','Illustrated lessons with quick understanding checks','chapter4.html?mode=course'],
['🧠 Flashcards','Questions, definitions, missed cards and scheduled reviews','chapter4.html?mode=flash'],
['🎯 Mock Exam','Original 23-question practice exam','chapter4.html?mode=exam'],
['🚀 Smart Hub','Timed test, weakness trainer, diagrams and mastery scores','chapter4.html?mode=smart'],
['✍️ Written Practice','Practice explaining your reasoning in words','chapter4.html?mode=written'],
['🌿 BioForge','Open the separate biology simulation game','bioforge.html']
];
function addGuide(page){
const guide=document.createElement('section');guide.className='where-guide';guide.id='where-guide';
guide.innerHTML='<div class="where-guide-head"><div><span class="tag">QUICK NAVIGATION GUIDE</span><h2>Where does everything go?</h2><p>Tap any card to open that exact activity. No extra selections or starting screens.</p></div><button type="button" class="where-guide-toggle" aria-expanded="true">Hide guide</button></div><div class="where-guide-grid">'+links.map(([title,description,href])=>'<a href="'+href+'"><strong>'+title+' <span aria-hidden="true">↗</span></strong><small>'+description+'</small><em>Opens → '+(href.startsWith('bioforge')?'BioForge game':'Chapter 4 → '+title.replace(/^\S+\s/,'').replace('Mock Exam','Mock Exam'))+'</em></a>').join('')+'</div>';
guide.querySelector('.where-guide-toggle').onclick=e=>{const grid=guide.querySelector('.where-guide-grid');grid.hidden=!grid.hidden;e.currentTarget.textContent=grid.hidden?'Show guide':'Hide guide';e.currentTarget.setAttribute('aria-expanded',String(!grid.hidden))};
if(page==='home'){const hero=document.querySelector('main .hero'),timer=document.querySelector('.focus-banner');(timer||hero)?.after(guide)}
else{const main=document.querySelector('main'),home=document.getElementById('home');if(home)home.prepend(guide);else main?.prepend(guide)}
}
if(mq){if(mq.addEventListener)mq.addEventListener('change',()=>{if(chosen==='auto')apply('auto',false)});else mq.addListener?.(()=>{if(chosen==='auto')apply('auto',false)})}
root.setAttribute('data-study-theme',chosen==='auto'?(mq?.matches?'light':'blue'):chosen);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',decorate);else decorate();
})();