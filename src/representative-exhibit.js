import { exportProof } from './export-proof.js';
import {representatives} from './representative-data.js';
import {systems,sources} from './data.js';
import {profiles} from './exhibition-data.js';
import {icon} from './icons.js';
import {transitionPage} from './story-controller.js';
const link=(url,label)=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ${icon('external')}</a>`;
export function initRepresentativeExhibit({onInspect,onOpen}){
 const dialog=document.createElement('dialog');dialog.id='representative-dialog';dialog.className='representative-dialog';dialog.setAttribute('aria-labelledby','representative-dialog-title');document.body.append(dialog);
 let current,opener,previousUrl,version=0;
 document.addEventListener('app-language-change',()=>{const proof=dialog.querySelector('.representative-export-proof');if(proof&&current)proof.innerHTML=exportProof(current.id)});
 function updateAddress(){const url=new URL(location.href);url.searchParams.delete('system');url.searchParams.set('representative',current.id);history.replaceState(null,'',url)}
 function clearMedia(){version++;const video=dialog.querySelector('video');if(video){video.pause();video.removeAttribute('src');video.load()}dialog.querySelector('iframe')?.remove()}
 function mediaPoster(){return `<div class="representative-poster"><img src="${current.poster}" width="1280" height="720" alt="${current.name} 실제 장비 사진"/><button type="button" class="story-cta" data-rep-action="play">${icon('play')}실사 영상 재생</button></div>`}
 function metadata(){const system=systems.find(s=>s.id===current.id),profile=profiles[current.id];return `<section id="representative-context" class="representative-context" aria-label="${current.name} 공개 사업과 자료"><h3>이 체계가 하는 일</h3><p>${profile.role}</p><div class="representative-export-proof">${exportProof(current.id)}</div><dl class="representative-facts">${current.facts.map(f=>`<div><dt>${f.name}</dt><dd>${link(f.url,f.value)}</dd></div>`).join('')}</dl><details><summary>기업·사업·수출 확인</summary><div class="representative-evidence"><h4>${system.project}</h4>${profile.organizations.map(o=>`<p><strong>${o.name}</strong> · ${o.role}<br>${link(sources[o.source].url,sources[o.source].publisher+' · 근거')}</p>`).join('')}<h4>수록된 공개 수출 사건</h4>${system.events.length?system.events.map(e=>`<p>${e.year} · ${e.country} · ${e.kind}<br>${link(sources[e.source].url,'사건 원문')}</p>`).join(''):'<p>현재 수록 자료에 확정 수출 사건이 없습니다. 해외 방문·훈련은 수출 계약과 구분합니다.</p>'}</div></details><details><summary>영상·사진·3D 출처와 범위</summary><div class="representative-evidence"><p><strong>${current.video.title}</strong><br>${current.video.publisher} · ${current.video.rights}<br>${link(current.video.url,'영상 원문')}</p><p>사진: ${current.photo.author} · ${current.photo.license}<br>${link(current.photo.url,'사진 사용 조건')}</p><p>3D: ${current.model}</p>${current.additional.map(s=>`<p>${link(s.url,s.title)}</p>`).join('')}</div></details></section>`}
 function render(){clearMedia();dialog.dataset.focus='false';dialog.innerHTML=`<header class="representative-heading"><div><span class="story-kicker">${current.branch} · 대표 체계 시연</span><h2 id="representative-dialog-title">${current.name}</h2></div><button type="button" class="action" data-rep-action="close" aria-label="대표 시연 닫기">${icon('close')}<span>닫기</span></button></header><nav class="representative-picker" aria-label="군별 대표 시연">${representatives.map(r=>`<button type="button" class="action" data-rep-pick="${r.id}" aria-pressed="${r.id===current.id}">${r.branch} · ${r.name}</button>`).join('')}</nav><div class="representative-body" data-lenis-prevent><section aria-label="실제 영상"><div id="representative-media" class="representative-media" data-state="poster">${mediaPoster()}</div><div class="representative-media-caption"><strong>${current.video.title}</strong><span>${current.video.context}</span>${link(current.video.url,current.video.publisher+' · 원문')}</div><p id="representative-status" class="micro" role="status">${current.video.delivery} · 재생을 누르면 영상이 로드됩니다.</p><div class="representative-actions"><button type="button" class="action" data-rep-action="stop">${icon('stop')}영상 중지·처음으로</button><button type="button" class="action" data-rep-action="share">시연 링크 복사</button><button type="button" class="action" data-rep-action="focus" aria-expanded="true" aria-controls="representative-context">영상에 집중하기</button><button type="button" class="story-cta" data-rep-action="inspect">3D 지도·외형 보기 ${icon('arrow')}</button></div></section>${metadata()}</div>`}
 function setStatus(message){const node=dialog.querySelector('#representative-status');if(node)node.textContent=message}
 function setFocus(value){dialog.dataset.focus=String(value);const button=dialog.querySelector('[data-rep-action=focus]');if(button){button.setAttribute('aria-expanded',String(!value));button.textContent=value?'체계 설명 보기':'영상에 집중하기'}}
 function stop(){setFocus(false);clearMedia();const media=dialog.querySelector('#representative-media');if(media){media.innerHTML=mediaPoster();media.dataset.state='poster'}setStatus('영상이 멈췄습니다. 다시 재생할 수 있습니다.')}
 function play(){clearMedia();const token=version,media=dialog.querySelector('#representative-media');media.replaceChildren();media.dataset.state='loading';setStatus('영상 연결 중…');
  if(current.video.kind==='native'){
   const video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='none';video.poster=current.poster;video.src=current.video.src;video.setAttribute('aria-label',current.video.title);video.width=1280;video.height=720;media.append(video);
   const active=()=>token===version&&dialog.open&&video.isConnected;
   video.addEventListener('playing',()=>{if(active())setFocus(true)},{once:true});
   video.addEventListener('playing',()=>{if(active()){media.dataset.state='playing';setStatus('실제 영상 재생 중 · '+current.video.publisher)}});
   video.addEventListener('pause',()=>{if(active()&&!video.ended){setFocus(false);setStatus('일시 정지 · 영상의 재생 버튼으로 이어서 볼 수 있습니다.')}});
   video.addEventListener('ended',()=>{if(active()){media.dataset.state='ended';setFocus(false);setStatus('영상 관람 완료 · 3D 지도와 외형으로 이어서 살펴보세요.')}});
   video.addEventListener('error',()=>{if(active()){media.dataset.state='error';setFocus(false);setStatus('영상 연결 실패 · 인터넷 연결을 확인하거나 영상 원문을 열어주세요.');const retry=document.createElement('button');retry.type='button';retry.className='action representative-retry';retry.dataset.repAction='play';retry.textContent='다시 재생';media.append(retry)}});
   video.play().catch(error=>{if(active()&&error.name!=='AbortError')setStatus('재생이 시작되지 않았습니다. 영상의 재생 버튼을 누르거나 원문을 열어주세요.')});
  }else{
   const frame=document.createElement('iframe');frame.title=current.video.title+' · 공식 플레이어';frame.src=current.video.src;frame.allow='autoplay; fullscreen; picture-in-picture';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';frame.width='1280';frame.height='720';media.append(frame);setFocus(true);
   frame.addEventListener('load',()=>{if(token===version&&dialog.open){media.dataset.state='embedded';setStatus('공식 원문 플레이어 · 영상 안에서 재생과 소리를 조작하세요. 재생되지 않으면 원문을 열 수 있습니다.')}});
  }
 }
 dialog.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.repPick){current=representatives.find(r=>r.id===button.dataset.repPick);render();updateAddress();dialog.querySelector(`[data-rep-pick="${current.id}"]`).focus();return}
  switch(button.dataset.repAction){
   case'play':play();break;
   case'stop':stop();break;
   case'close':dialog.close();break;
   case'share':{if(!navigator.clipboard){setStatus('주소 표시줄의 대표 시연 링크를 복사해 주세요.');break}const token=version;navigator.clipboard.writeText(location.href).then(()=>{if(token===version&&dialog.open)setStatus('대표 시연 링크를 복사했습니다.')}).catch(()=>{if(token===version&&dialog.open)setStatus('주소 표시줄의 대표 시연 링크를 복사해 주세요.')});break}
   case'focus':setFocus(dialog.dataset.focus!=='true');break;
   case'inspect':{const id=current.id;dialog.close();requestAnimationFrame(()=>onInspect(id));break}
  }
 });
 dialog.addEventListener('close',()=>{clearMedia();if(previousUrl)history.replaceState(null,'',previousUrl);document.querySelector('.shell')?.removeAttribute('data-media-open');if(!document.querySelector('dialog[open]')&&opener?.isConnected)opener.focus()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&dialog.open)stop()});
 return{open(id,trigger){const entry=representatives.find(r=>r.id===id);if(!entry)return;if(!dialog.open){const url=new URL(location.href);url.searchParams.delete('representative');previousUrl=url.href}current=entry;opener=trigger||document.querySelector(`[data-representative="${id}"]`)||document.activeElement;onOpen();render();updateAddress();if(!dialog.open)dialog.showModal();document.querySelector('.shell')?.setAttribute('data-media-open','true');transitionPage(dialog);dialog.querySelector('[data-rep-action="play"]').focus()}};
}
