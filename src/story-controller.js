import { systems } from './data.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let pageAnimation;
export function transitionPage(element){
 pageAnimation?.cancel();
 if(!reduced.matches&&element)pageAnimation=element.animate([{opacity:.45,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,easing:'cubic-bezier(.22,1,.36,1)'});
}
export function initStory({onSystem,onRegion}){
 const root=document.querySelector('.main'),shell=document.querySelector('.shell');
 if(!root||!document.querySelector('.story'))return;
 const maps=new Map();let frame=0,home=shell.dataset.home==='true';
 const sections=[...document.querySelectorAll('.story-section')];
 const reveals=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('revealed');if(!reduced.matches)e.target.classList.add('reveal-enter');reveals.unobserve(e.target)}},{root,threshold:.12});
 document.querySelectorAll('[data-reveal]').forEach(e=>{if(e.getBoundingClientRect().top>root.getBoundingClientRect().bottom)e.classList.add('story-ready');reveals.observe(e)});
 root.addEventListener('focusin',e=>{e.target.closest('[data-reveal]')?.classList.add('revealed')});
 async function load(host){
 const id=host.dataset.storyMap;if(maps.get(id)?.loading||maps.get(id)?.map)return;
 const item={loading:true,host,interacted:false};maps.set(id,item);const status=host.querySelector('.story-map-status');status.hidden=false;
 try{
  const {AtlasMap}=await import('./map.js');
  const map=new AtlasMap(host,onSystem,(message,error)=>{if(error){status.hidden=false;status.textContent=message}},onRegion);
  item.map=map;
  await map.init();if(id==='world')await map.load('world');
  map.update(id==='world'?systems.filter(s=>s.events.length):systems.filter(s=>['k2','chungnam','fa50','425'].includes(s.id)),null);
  // Touch scroll remains native; direct 3D manipulation belongs to the explorer.
  map.controls.enabled=false;map.controls.enableRotate=false;map.controls.enableZoom=false;map.renderer.domElement.style.touchAction='pan-y';
  map.renderer.domElement.setAttribute('aria-label',id==='world'?'대한민국과 폴란드의 공개 계약 연결 3D 지도':'공개 고도 기반 한반도 3D 지형. 장비 위치는 전시용입니다.');
  item.loading=false;fit(item);host.dataset.ready='true';status.hidden=true;
  if(!reduced.matches&&home)map.renderer.domElement.animate([{opacity:0},{opacity:1}],{duration:600});schedule();
 }catch{
  item.map?.observer.disconnect();item.map?.controls.dispose();item.map?.clear();item.map?.renderer.dispose();host.querySelector('canvas')?.remove();host.querySelector('.map-labels')?.remove();item.map=null;item.loading=false;
  status.replaceChildren(document.createTextNode('3D 전시를 불러오지 못했어요. '));const retry=document.createElement('button');retry.className='story-cta';retry.type='button';retry.textContent='다시 불러오기';retry.onclick=()=>load(host);status.append(retry);status.hidden=false;
 }
 }
 function fit(item){if(!item.map||item.loading)return;item.map.home();const aspect=item.host.clientWidth/item.host.clientHeight;if(aspect<1)item.map.camera.position.multiplyScalar(Math.min(1.7,1/aspect));item.base=item.map.camera.position.clone();item.map.resize()}
 const loaders=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting&&home)load(e.target)},{root,rootMargin:'120px',threshold:0});
 document.querySelectorAll('[data-story-map]').forEach(e=>loaders.observe(e));
 function schedule(){if(!home||document.hidden||frame)return;frame=requestAnimationFrame(draw)}
 function draw(){frame=0;if(!home||document.hidden)return;const rb=root.getBoundingClientRect();let closest=sections[0],distance=Infinity;for(const s of sections){const r=s.getBoundingClientRect();const d=Math.abs(r.top-rb.top-64);if(d<distance){distance=d;closest=s}}
 document.querySelectorAll('[data-story-jump]').forEach(b=>{if(b.closest('.story-chapters'))b.setAttribute('aria-current',b.dataset.storyJump===closest.id?'step':'false')});
 const progress=root.scrollTop/Math.max(1,root.scrollHeight-root.clientHeight);document.querySelector('.story-progress').style.transform=`scaleX(${progress})`;
 for(const item of maps.values()){if(!item.map||item.loading||!item.base)continue;const r=item.host.getBoundingClientRect();if(r.bottom<rb.top||r.top>rb.bottom)continue;const p=Math.max(0,Math.min(1,(rb.bottom-r.top)/(root.clientHeight+r.height)));if(!reduced.matches){item.map.camera.position.copy(item.base);item.map.camera.position.y*=.96+.08*p;item.map.camera.lookAt(item.map.controls.target);item.map.render()}}
 }
 root.addEventListener('scroll',schedule,{passive:true});
 document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.storyJump){const el=document.getElementById(b.dataset.storyJump);if(el){const top=el.getBoundingClientRect().top-root.getBoundingClientRect().top+root.scrollTop-64;root.scrollTo({top,behavior:reduced.matches?'instant':'smooth'})}}if(b.dataset.storyReset){const item=maps.get(b.dataset.storyReset);if(item?.map){fit(item);schedule()}}});
 const resize=new ResizeObserver(()=>{for(const item of maps.values())fit(item);schedule()});resize.observe(root);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else schedule()});
 reduced.addEventListener('change',()=>{document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('revealed'));for(const item of maps.values())fit(item);schedule()});
 schedule();return{setHome(value){home=value;if(!home){cancelAnimationFrame(frame);frame=0}else{for(const host of document.querySelectorAll('[data-story-map]')){const r=host.getBoundingClientRect(),rb=root.getBoundingClientRect();if(r.bottom>rb.top&&r.top<rb.bottom)load(host)}schedule()}}};
}
