export function initStoryMotion(root,story,onState){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let active=false,complete;
 story.querySelectorAll('[data-reveal]').forEach(node=>node.classList.add('revealed'));
 function settle(){
  const horizontal=story.dataset.axis==='horizontal',index=Math.round((horizontal?root.scrollLeft:root.scrollTop)/(horizontal?root.clientWidth:root.clientHeight));
  const slides=[...story.querySelectorAll('.story-slide')],section=slides[index]?.querySelector('section');
  slides.forEach((slide,i)=>{slide.inert=i!==index});
  if(section)story.querySelectorAll('[data-slide-picker]').forEach(select=>select.value=section.id);
  const done=complete;complete=null;done?.();
 }
 root.addEventListener('scrollend',settle);
 function scrollTo(element,onComplete){
  if(!active)return;
  const slide=element.closest('.story-slide'),left=story.dataset.axis==='horizontal'?slide.offsetLeft:0,top=story.dataset.axis==='vertical'?slide.offsetTop:0;
  story.querySelectorAll('.story-slide').forEach(node=>{node.inert=false});
  complete=onComplete;
  const unchanged=Math.abs(root.scrollLeft-left)<1&&Math.abs(root.scrollTop-top)<1;
  root.scrollTo({left,top,behavior:reduced.matches?'instant':'smooth'});
  if(unchanged||reduced.matches)settle();
 }
 root.addEventListener('scroll',onState,{passive:true});
 return {update(){},scrollTo,isActive:()=>active,setHome(value){active=value;if(!value)complete=null},destroy(){complete=null}};
}
