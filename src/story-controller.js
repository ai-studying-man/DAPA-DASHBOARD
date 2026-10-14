import { initKioskWelcome } from './kiosk-welcome.js';
import { systems } from './data.js';
import { initStoryMotion } from './story-motion.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let pageAnimation;
reduced.addEventListener('change',()=>pageAnimation?.cancel());
document.addEventListener('visibilitychange',()=>{if(document.hidden)pageAnimation?.cancel()});
export function transitionPage(element){
 pageAnimation?.cancel();
 if(!reduced.matches&&element){const style=getComputedStyle(element);pageAnimation=element.animate([{opacity:.45,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:parseFloat(style.getPropertyValue('--motion-panel')),easing:style.getPropertyValue('--motion-spring').trim()});}
}
export function initStory({onSystem,onRegion}){
 const root=document.querySelector('.main'),shell=document.querySelector('.shell');
 if(!root||!document.querySelector('.story'))return;
 const kiosk=initKioskWelcome();
 const maps=new Map();let frame=0,home=shell.dataset.home==='true';
 const sections=[...document.querySelectorAll('.story-section')];
 const motion=initStoryMotion(root,document.querySelector('.story'),()=>{if(!motion.isActive()){cancelAnimationFrame(frame);frame=0}else schedule()});
 async function load(host){
 const id=host.dataset.storyMap;if(maps.get(id)?.loading||maps.get(id)?.map)return;
 const item={loading:true,host,interacted:false};maps.set(id,item);const status=host.querySelector('.story-map-status');status.hidden=false;
 try{
  const {AtlasMap}=await import('./satellite-map.js');
  const map=new AtlasMap(host,onSystem,()=>{status.hidden=true},onRegion);
  item.map=map;status.hidden=true;
  map.mode=id;map.activeSystems=id==='world'?systems.filter(s=>s.events.length):systems;map.interactive=false;
  map.onReady=()=>{
   if(!map.viewer||map.watch.failed)return;
   map.update(map.activeSystems,null);
   // Read-only chapter maps preserve native touch scrolling.
   map.setInteractive(false);
   map.viewer.canvas.setAttribute('aria-label',id==='world'?'대한민국과 수록 수출 국가의 공개 관계 지도':'실제 위성·항공 영상과 고도 기반 한반도 3D 지형. 장비 위치는 전시용입니다.');
   item.loading=false;fit(item);host.dataset.ready='true';status.hidden=true;schedule();
  };
  await map.init();
 }catch{
  item.loading=false;
  // Keep SceneWatch and its classified retry/video/return controls alive.
  if(item.map){status.hidden=true;host.dataset.ready='false';return}
  status.replaceChildren(document.createTextNode('3D 전시를 불러오지 못했어요. '));
  const retry=document.createElement('button');retry.className='story-cta';retry.type='button';retry.textContent='다시 불러오기';retry.onclick=()=>load(host);status.append(retry);
  const back=document.createElement('button');back.className='action';back.type='button';back.textContent='대시보드로 돌아가기';back.onclick=()=>document.getElementById('reset')?.click();status.append(back);status.hidden=false;
 }
 }
 function fit(item){if(!item.map||item.loading||item.map.watch.failed)return;item.map.home();item.map.resize()}
 const loaders=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting&&home)load(e.target)},{root,rootMargin:'120px',threshold:0});
 document.querySelectorAll('[data-story-map]').forEach(e=>loaders.observe(e));
 function schedule(){if(!home||document.hidden||!motion.isActive()||frame)return;frame=requestAnimationFrame(draw)}
 function draw(){frame=0;if(!home||document.hidden||!motion.isActive())return;motion.update();const rb=root.getBoundingClientRect();let closest=sections[0],distance=Infinity;for(const s of sections){const r=s.getBoundingClientRect();const d=Math.abs(r.top-rb.top-64);if(d<distance){distance=d;closest=s}}
 document.querySelectorAll('[data-story-jump]').forEach(b=>{if(b.closest('.story-chapters'))b.setAttribute('aria-current',b.dataset.storyJump===closest.id?'step':'false')});
 const progress=root.scrollTop/Math.max(1,root.scrollHeight-root.clientHeight);document.querySelector('.story-progress').style.transform=`scaleX(${progress})`;

 }
 root.addEventListener('scroll',schedule,{passive:true});
 document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.storyJump){const el=document.getElementById(b.dataset.storyJump);if(el){motion.scrollTo(el,()=>{const target=el.querySelector("h1,h2")||el;target.setAttribute("tabindex","-1");target.focus({preventScroll:true})})}}if(b.dataset.storyReset){const item=maps.get(b.dataset.storyReset);if(item?.map){fit(item);schedule()}}});
 document.addEventListener('click',event=>{const mode=event.target.closest('[data-presentation-mode]');if(mode){const rail=mode.closest('.presentation-rail');rail.querySelectorAll('[data-presentation-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button===mode)));rail.querySelector('.presentation-steps').hidden=mode.dataset.presentationMode!=='vip'}});
 const resize=new ResizeObserver(()=>{for(const item of maps.values())fit(item);schedule()});resize.observe(root);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else schedule()});
 reduced.addEventListener('change',()=>{document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('revealed'));for(const item of maps.values())fit(item);schedule()});
 motion.setHome(home);schedule();return{setLanguage:language=>kiosk.setLanguage(language),setHome(value){home=value;kiosk.setHome(value);motion.setHome(value);if(!home){cancelAnimationFrame(frame);frame=0}else{for(const host of document.querySelectorAll('[data-story-map]')){const r=host.getBoundingClientRect(),rb=root.getBoundingClientRect();if(r.bottom>rb.top&&r.top<rb.bottom)load(host)}schedule()}}};
}
