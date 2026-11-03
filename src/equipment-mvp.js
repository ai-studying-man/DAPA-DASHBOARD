import {publicEquipment} from './public-equipment.js';
import entries from './equipment-mvp.json' with {type:'json'};
import {ModelStudio} from './model-studio.js';
import './fonts.css';
import './styles.css';
import './equipment-mvp.css';

const groups={all:'전체 21종',land:'지상 체계',air:'항공 체계',foreign:'해외 비교', 'identity-review':'명칭 확인 중'};
const root=document.querySelector('#app');
root.innerHTML=`<main class="mvp-experience"><header class="mvp-header"><a class="action" href="./">← 대시보드</a><div><span class="eyebrow">전체 무기체계 · 초기 MVP</span><h1>장비 3D 관찰</h1><p></p></div><strong>21종</strong></header><section class="mvp-controls" aria-label="무기체계 선택"><label>분류<select id="mvp-category">${Object.entries(groups).map(([id,name])=>`<option value="${id}">${name}</option>`).join('')}</select></label><label>관찰할 장비<select id="mvp-select"></select></label><button class="action" id="mvp-prev">← 이전 장비</button><button class="action" id="mvp-next">다음 장비 →</button></section><div class="mvp-layout"><nav class="mvp-list" aria-label="전체 장비 목록"></nav><section class="mvp-model"><div id="mvp-stage"></div><a class="action" id="mvp-terrain">위성·고도 지형에서 보기</a><p class="mvp-disclosure">Blender로 제작한 외형 MVP입니다. 형상·치수·도색은 추정이며 제조사 CAD·정밀 스캔·검증된 성능 시뮬레이터가 아닙니다.</p></section><aside class="mvp-reference"><span class="eyebrow">장비 사진</span><h2 id="mvp-name"></h2><p id="mvp-flags" role="status"></p><div id="mvp-image"></div><p id="mvp-reference-note">사진 출처와 이용 조건</p></aside></div><footer>기존 K2·K9 보정 모델 재사용 · 나머지 19종은 장비 종류별 외형 초안 · 첨부 목록의 종류와 순서 유지</footer></main>`;
let category='all',selected,studio;
const list=()=>entries.filter(entry=>category==='all'||entry.category===category);
function choose(identity){
 const items=list();const original=items.find(entry=>entry.id===identity)||items[0];const record=publicEquipment.get(original.id);const item={...original,image:record?.referencePhoto,model:record?.model||original.model};selected=original;
 document.querySelector('#mvp-select').value=item.id;
 document.querySelectorAll('[data-mvp-item]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mvpItem===item.id)));
 document.querySelector('#mvp-name').textContent=item.name;document.querySelector('#mvp-reference-note').textContent=item.image?record.photoCredit:'기준 이미지 없이 외형 초안만 제공합니다. 실제 형상·치수는 아직 검증하지 않았습니다.';
 const flags=[item.meshStage==='photo-informed-existing'?'사진 비교 보정본 재사용':'장비 종류별 외형 초안'];
 if(item.category==='foreign')flags.push('대한민국 개발 체계가 아닌 해외 비교 항목');
 if(item.category==='identity-review'||item.id==='k332')flags.push('정확한 장비명·형상 확인 필요');
 if(item.id==='k151at')flags.push('현궁 발사기 세부 형상 미검증');
 if(!item.image)flags.push('실사진 확인 중');
 document.querySelector('#mvp-flags').textContent=flags.join(' · ');
 const imageHost=document.querySelector('#mvp-image');imageHost.replaceChildren();
 if(item.image){const image=new Image();image.src=item.image;image.alt=item.name+' 사진';imageHost.append(image)}
 else{const message=document.createElement('p');message.className='mvp-pending';message.textContent='이 장비의 장비 사진 이미지는 준비 중입니다. 외형 MVP는 관찰할 수 있어요.';imageHost.append(message)}
 document.querySelector('#mvp-terrain').href=`?experience=terrain&system=${item.id}`;
 const index=items.indexOf(original);document.querySelector('#mvp-prev').disabled=index===0;document.querySelector('#mvp-next').disabled=index===items.length-1;
 studio?.destroy();
 studio=new ModelStudio(document.querySelector('#mvp-stage'),{id:item.id,name:item.name},{model:item.model,fitMargin:1.35,studioBadge:'Blender 외형 MVP',studioNote:'외형 검토 모델',referencePhoto:item.image,referenceLabel:'장비 사진',photoCredit:record?.photoCredit,photoUrl:record?.referenceUrl,referenceUrl:'./models/mvp/README.md',modelAttribution:'./models/mvp/README.md'},()=>choose(item.id));
 const url=new URL(location.href);url.searchParams.set('item',item.id);history.replaceState(null,'',url);
 root.dataset.selected=item.id;
}
function options(identity){
 const items=list();document.querySelector('#mvp-select').innerHTML=items.map(item=>`<option value="${item.id}">${String(item.order).padStart(2,'0')} · ${item.name}</option>`).join('');
 document.querySelector('.mvp-list').innerHTML=items.map(item=>`<button class="action" data-mvp-item="${item.id}"><small>${String(item.order).padStart(2,'0')}</small>${item.name}</button>`).join('');choose(identity);
}
document.querySelector('#mvp-select').onchange=event=>choose(event.target.value);
document.querySelector('#mvp-category').onchange=event=>{category=event.target.value;options(selected?.id)};
document.querySelector('.mvp-list').onclick=event=>{const button=event.target.closest('[data-mvp-item]');if(button)choose(button.dataset.mvpItem)};
document.querySelector('#mvp-prev').onclick=()=>{const items=list();choose(items[items.indexOf(selected)-1].id)};
document.querySelector('#mvp-next').onclick=()=>{const items=list();choose(items[items.indexOf(selected)+1].id)};
options(new URLSearchParams(location.search).get('item'));
addEventListener('pagehide',()=>studio?.destroy(),{once:true});
