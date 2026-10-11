import Lenis from 'lenis';

const easing=t=>Math.min(1,1.001-2**(-10*t));
export function initStoryMotion(root,story,onState){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const style=getComputedStyle(story);
 const number=name=>parseFloat(style.getPropertyValue(name));
 const time=name=>{const value=style.getPropertyValue(name).trim();return parseFloat(value)*(value.endsWith('ms')?1:1000)};
 const tokens={duration:time('--motion-reveal'),stagger:time('--motion-stagger'),shift:number('--motion-shift'),heroShift:number('--motion-hero-shift'),heroScale:number('--motion-hero-scale'),heroTravel:number('--motion-hero-travel'),mediaShift:number('--motion-media-shift'),ease:style.getPropertyValue('--motion-spring').trim()};
 const events=new AbortController(),animations=new Set();
 const hero=story.querySelector('.hero-photo img'),media=[...story.querySelectorAll('.story-map')];
 let home=false,lenis=null,frame=0,active=false;
 function cancelAnimations(){for(const animation of animations)animation.cancel();animations.clear()}
 function finalState(){hero.style.removeProperty('--hero-y');hero.style.removeProperty('--hero-scale');for(const item of media)item.style.removeProperty('--media-y')}
 function show(element){
  if(element.classList.contains('revealed'))return;
  element.classList.add('revealed');observer.unobserve(element);
  if(!active||reduced.matches)return;
  const heading=element.matches('h1,h2')?element:element.querySelector('h1,h2');
  const targets=heading?[...heading.children]:[element];
  if(heading&&heading!==element)targets.push(...element.querySelectorAll('.story-kicker,p,.story-cta'));
  for(const [index,target]of targets.entries()){
   const animation=target.animate([{opacity:0,transform:`translateY(${heading?.matches('h1')?tokens.heroShift:tokens.shift}px)`},{opacity:1,transform:'translateY(0)'}],{duration:tokens.duration,delay:index*tokens.stagger,easing:tokens.ease,fill:'backwards'});
   animations.add(animation);animation.onfinish=()=>animations.delete(animation);
  }
 }
 const observer=new IntersectionObserver(entries=>{if(active)for(const entry of entries)if(entry.isIntersecting)show(entry.target)},{root,threshold:.15});
 const reveals=[...story.querySelectorAll('[data-reveal],.story-hero h1')];
 for(const element of reveals)observer.observe(element);
 function tick(now){frame=0;if(!active||!lenis)return;lenis.raf(now);frame=requestAnimationFrame(tick)}
 function sync(){
  active=home&&!document.hidden&&!document.querySelector('dialog[open]');
  const smooth=active&&!reduced.matches;
  if(!smooth){lenis?.destroy();lenis=null;cancelAnimationFrame(frame);frame=0;cancelAnimations();if(reduced.matches)finalState()}
  else if(!lenis){lenis=new Lenis({wrapper:root,content:story,eventsTarget:root,lerp:.085,smoothWheel:true,syncTouch:false,wheelMultiplier:1,autoRaf:false,prevent:node=>Boolean(node.closest('dialog,[data-lenis-prevent]'))});lenis.on('scroll',onState);frame=requestAnimationFrame(tick)}
  root.dataset.storyMotion=smooth?'smooth':'native';
  if(active){const rb=root.getBoundingClientRect();for(const element of reveals){const r=element.getBoundingClientRect();if(reduced.matches||(r.bottom>rb.top&&r.top<rb.bottom))show(element)}}
  onState();
 }
 function update(){
  if(!active||reduced.matches)return;
  const rb=root.getBoundingClientRect(),r=story.querySelector('.story-hero').getBoundingClientRect();
  if(r.bottom>rb.top&&r.top<rb.bottom){const progress=Math.min(1,Math.max(0,(rb.top-r.top)/Math.max(1,r.height)));hero.style.setProperty('--hero-scale',String(tokens.heroScale-(tokens.heroScale-1)*progress));hero.style.setProperty('--hero-y',`${Math.min(tokens.heroTravel,progress*tokens.heroTravel)}px`)}
  for(const item of media){const rect=item.getBoundingClientRect();if(rect.bottom>rb.top&&rect.top<rb.bottom){const progress=Math.min(1,Math.max(0,(rb.bottom-rect.top)/(rb.height+rect.height)));item.style.setProperty('--media-y',`${(progress-.5)*tokens.mediaShift}px`)}}
 }
 root.addEventListener('focusin',event=>{const element=event.target.closest('[data-reveal],h1,h2');if(element){element.classList.add('revealed');observer.unobserve(element);for(const animation of animations){const target=animation.effect.target;if(element.contains(target)||target===element){animation.cancel();animations.delete(animation)}}}},{signal:events.signal});
 root.addEventListener('keydown',event=>{if(lenis&&['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))lenis.scrollTo(root.scrollTop,{immediate:true})},{signal:events.signal});
 document.addEventListener('visibilitychange',sync,{signal:events.signal});
 reduced.addEventListener('change',sync,{signal:events.signal});
 const dialogs=new MutationObserver(sync);dialogs.observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
 function scrollTo(element){
  if(!active)return;
  const padding=parseFloat(getComputedStyle(root).scrollPaddingTop)||0;
  const top=element.getBoundingClientRect().top-root.getBoundingClientRect().top+root.scrollTop-padding;
  if(lenis)lenis.scrollTo(top,{duration:.9,easing,lock:false});
  else root.scrollTo({top,behavior:reduced.matches?'instant':'smooth'});
 }
 root.addEventListener('click',event=>{
  const anchor=event.target.closest('a[href^="#"]');
  if(!anchor)return;
  const target=document.getElementById(anchor.hash.slice(1));
  if(target&&story.contains(target)){event.preventDefault();scrollTo(target)}
 },{signal:events.signal});
 return{update,scrollTo,isActive:()=>active,setHome(value){home=value;sync()},destroy(){home=false;sync();observer.disconnect();dialogs.disconnect();events.abort();finalState()}};
}
