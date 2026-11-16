(()=>{
function route(){
const params=new URLSearchParams(location.search),mode=params.get('mode'),topic=params.get('topic');
const allowed=new Set(['home','exam','practice','generator','hardcore','learn','flash','everything','written','tutor','ai-live','path','lab']);
if(!mode||!allowed.has(mode))return;
const btn=document.querySelector('#nav button[data-page="'+mode+'"]');
if(!btn)return;
btn.click();
const targets={generator:['genUnit','genFlashUnit'],flash:['flashUnit'],learn:['unit'],everything:['allUnit'],hardcore:['hardUnit'],practice:['practiceUnit']};
if(['all','4.1','4.2','4.3','7.2'].includes(topic)){
for(const id of targets[mode]||[]){const e=document.getElementById(id);if(e){e.value=topic;e.dispatchEvent(new Event('change',{bubbles:true}))}}
}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',route);else route();
})();