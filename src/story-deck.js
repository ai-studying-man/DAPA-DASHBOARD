import {icon} from './icons.js';

function organizePages(story){
 const pages=[['story-start','처음'],['story-presentation','관람 안내']];
 const section=(id,label,kind)=>{const node=document.createElement('section');node.id=id;node.className='story-section '+kind;node.setAttribute('aria-label',label);story.append(node);pages.push([id,label]);return node};
 const representatives=story.querySelector('#story-representatives'),copy=representatives.querySelector('.story-copy');
 [...representatives.querySelectorAll('.representative-card')].forEach((card,index)=>{
  const name=card.querySelector('h3').textContent,branch=card.querySelector('.representative-card-copy>span').textContent.split(' · ')[0];
  const page=section(index?'story-representative-'+index:'story-representatives',branch+' · '+name,'equipment-slide');
  const heading=copy.cloneNode(true);heading.querySelector('h2').id=page.id+'-title';heading.querySelector('h2').innerHTML=index?name:'실제로 만나는<br>대한민국의 기술.';
  heading.querySelector('p').innerHTML=branch+' · '+name+'<br>실사 영상에서 3D 관람으로 이어집니다.';
  page.append(heading,card);
 });representatives.remove();
 for(const [id,label,mapLabel]of [['story-korea-section','한반도 소개','한반도 3D'],['story-world-section','세계 소개','대한민국과 6개국']]){
  const intro=story.querySelector('#'+id);intro.classList.add('intro-slide');pages.push([id,label]);
  const map=section(id+'-map',mapLabel,'map-slide');
  const title=document.createElement('h2');title.textContent=mapLabel;map.append(title,intro.querySelector('.story-map-card'));
  const entry=intro.querySelector('.story-copy .story-cta');entry.removeAttribute(id==='story-korea-section'?'data-start-all':'data-to-world');entry.dataset.storyJump=map.id;
  const row=intro.querySelector(id==='story-korea-section'?'.story-domain-row':'.story-export-row');
  if(id==='story-korea-section')map.append(row);
  else{const choices=section('story-world-equipment','수출 체계 선택','choice-slide');choices.innerHTML='<h2>수출 이야기가 궁금한 장비를 골라보세요.</h2>';choices.append(row);const button=document.createElement('button');button.type='button';button.className='story-cta';button.dataset.storyJump=choices.id;button.textContent='수출 사례 탐색';map.append(button);const sources=intro.querySelector('.story-sources');choices.append(sources);}
  const back=document.createElement('button');back.type='button';back.className='action';back.dataset.storyJump=id;back.textContent='돌아가기';map.append(back);
 }
 const discover=story.querySelector('#story-discover');discover.classList.add('intro-slide');pages.push(['story-discover','장비 찾기']);
 const tabs=discover.querySelector('.classification-tabs');tabs.hidden=true;
 const branch=section('story-branch-choices','군으로 찾기','choice-slide'),environment=section('story-environment-choices','환경으로 찾기','choice-slide');
 branch.innerHTML='<h2>어느 군의 장비가 궁금한가요?</h2>';environment.innerHTML='<h2>어디에서 사용하는 장비인가요?</h2>';
 branch.append(discover.querySelector('#branch-categories'));environment.append(discover.querySelector('#environment-categories'));
 const systems=discover.querySelector('.welcome-systems');if(systems){const parent=systems.closest('.welcome-section');parent.hidden=true;story.append(parent);}
 discover.querySelector('.welcome-footnote')?.remove();discover.querySelector('[data-start-timeline]')?.remove();
 const actions=document.createElement('div');actions.className='slide-choice-actions';actions.innerHTML='<button type="button" class="action" data-story-jump="story-branch-choices">군으로 찾기</button><button type="button" class="action" data-story-jump="story-environment-choices">환경으로 찾기</button><button type="button" class="action" data-to-forces>체계를 바로 선택해 보세요</button>';discover.append(actions);
 const presentation=story.querySelector('#story-presentation');presentation.classList.add('intro-slide');presentation.querySelector('h2').innerHTML='큰 장면으로 보고,<br>공개 근거로 이해해요.';presentation.querySelector('p').innerHTML='실제 영상 → 입체 관찰 → 수출 이야기.<br><br>원하는 순서로 직접 살펴보세요.';
 return pages;
}

export function initStoryDeck(story){
 story.querySelector('.story-chapters').remove();
 const pages=organizePages(story);
 const slides=pages.map(([id,label],index)=>{
  const section=document.getElementById(id),slide=document.createElement('div');
  slide.className='story-slide';slide.dataset.slide=String(index);
  const header=document.createElement('header');header.className='slide-heading';
  header.innerHTML=`<button type="button" class="action" data-story-jump="story-start">${icon('reset')}<span>처음</span></button><strong>${label}</strong><span>${index+1} / ${pages.length}</span>`;
  const body=document.createElement('div');body.className='slide-content';
  story.append(slide);body.append(section);slide.append(body);
  if(index){
   slide.prepend(header);
   const footer=document.createElement('footer');footer.className='slide-navigation';
   footer.innerHTML=`<button type="button" class="action" data-story-jump="${pages[index-1][0]}">${icon('arrow')}<span>이전</span></button><nav aria-label="전시 장면"><select data-slide-picker aria-label="페이지 선택">${pages.map(([target,name],i)=>`<option value="${target}" ${i===index?'selected':''}>${name}</option>`).join('')}</select></nav><button type="button" class="primary-action" data-story-jump="${pages[index===pages.length-1?0:index+1][0]}"><span>${index===pages.length-1?'처음':'다음'}</span>${icon('arrow')}</button>`;
   slide.append(footer);
  }
  return slide;
 });
 story.classList.add('story-deck');
 const axis=matchMedia('(min-width:1000px)'),kiosk=new URLSearchParams(location.search).get('presentation')==='kiosk';
 let current=0;
 slides.forEach((slide,i)=>{slide.inert=i!==0});
 function updateAxis(){story.dataset.axis=kiosk||axis.matches?'horizontal':'vertical';story.scrollTo({left:story.dataset.axis==='horizontal'?current*story.clientWidth:0,top:story.dataset.axis==='vertical'?current*story.clientHeight:0,behavior:'instant'})}
 axis.addEventListener('change',updateAxis);new ResizeObserver(()=>{if(story.clientHeight&&story.clientWidth)updateAxis()}).observe(story);updateAxis();
 story.addEventListener('scrollend',()=>{
  const horizontal=story.dataset.axis==='horizontal';current=Math.round((horizontal?story.scrollLeft:story.scrollTop)/(horizontal?story.clientWidth:story.clientHeight));
  slides.forEach((slide,i)=>{slide.inert=i!==current});
 },{passive:true});
 return {slides};
}
