import { storyWelcome } from './story.js';
import { systems, domains, sources } from './data.js';
import { icon } from './icons.js';
import { card, sourceCard } from './components.js';

const branchChoices = [
  ['육군', 'land', '지상의 기동과 화력'], ['해군', 'sea', '바다를 잇는 조선 기술'],
  ['공군', 'air', '항공 기술의 이야기'], ['해병대', 'sea', '상륙과 기동의 이야기'],
];
function category(name, glyph, description, count, attribute) {
  return `<button type="button" class="category-card" ${attribute}><span class="category-icon">${icon(glyph)}</span><span><strong>${name}</strong><small>${description}</small></span><span class="category-count">${count}개 체계 ${icon('arrow')}</span></button>`;
}
function classicWelcome() {
  return `<section class="welcome" aria-labelledby="welcome-title"><div class="welcome-heading"><span class="eyebrow">K-DEFENSE / DISCOVER</span><h1 id="welcome-title">우리의 기술을 만나고,<br>그 다음을 상상하다.</h1><div class="welcome-start"><p>궁금한 군이나 환경을 선택하세요.<br>지도와 3D 모델, 음성으로 기술 이야기를 만나보세요.</p><button type="button" class="primary-action" id="voice-tour-open">${icon('speaker')}음성 전시 시작 ${icon('arrow')}</button><small>5개 체계 · 큰 자막과 함께 안내</small></div></div><div class="classification-tabs" role="tablist" aria-label="탐색 분류"><button type="button" id="branch-tab" role="tab" aria-selected="true" aria-controls="branch-categories" data-classification="branch">군으로 찾기 <small>누가 사용하나요?</small></button><button type="button" id="environment-tab" role="tab" aria-selected="false" aria-controls="environment-categories" data-classification="environment">환경으로 찾기 <small>어디에서 사용하나요?</small></button></div><section class="welcome-section" id="branch-categories" role="tabpanel" aria-labelledby="branch-tab"><div class="section-heading"><h2>육군 · 해군 · 공군 · 해병대</h2><span>01 · 군별 탐색</span></div><div class="branch-grid">${branchChoices.map(([name,glyph,desc])=>category(name,glyph,desc,systems.filter(s=>s.branches.includes(name)).length,`data-start-branch="${name}"`)).join('')}</div></section><section class="welcome-section" id="environment-categories" role="tabpanel" aria-labelledby="environment-tab" hidden><div class="section-heading"><h2>지상 · 해상 · 공중 · 우주</h2><span>02 · 환경별 탐색</span></div><div class="environment-grid">${domains.filter(d=>['land','sea','air','space'].includes(d.id)).map(d=>category(d.name,d.icon,{land:'전차 · 자주포 · 다연장로켓',sea:'함정 · 상륙돌격장갑차',air:'항공기 · 무인항공기',space:'정찰위성 · 위성 연구개발'}[d.id],systems.filter(s=>s.domains.includes(d.id)).length,`data-start-domain="${d.id}"`)).join('')}</div></section><section class="welcome-section"><div class="section-heading"><h2>체계를 바로 선택해 보세요</h2><button type="button" class="text-action" data-start-all>전체 지도 ${icon('arrow')}</button></div><div class="welcome-systems">${systems.map(s=>card(s,null)).join('')}</div></section><div class="welcome-footnote"><span>${systems.length}개 대표 체계 · ${Object.keys(sources).length}개 공개 근거를 수록한 전시 시연</span><button type="button" class="text-action" data-start-timeline>과거 · 현재 · 미래 비교 ${icon('arrow')}</button></div></section>`;
}
const futurePlans = {
  muav: { title: '향후 수출에 대한 기대', text: '2024년 발표는 감시·정찰능력 향상과 미래 방산 수출 기여를 기대합니다. 확정된 해외 계약이나 납품 실적은 아닙니다.', source: 'muav' },
  smallsat: { title: '검증위성에서 군집위성으로', text: '2025년 발표는 검증위성 제작·시험 후 2026년 후반기 발사와 SAR·EO 위성의 순차 발사를 계획했습니다. 이후 실제 진행 여부는 별도 확인이 필요합니다.', source: 'smallsat' },
};
function eraCard(era, label, record) {
  return `<article class="era-card ${era}"><div class="era-heading"><span>${label}</span><span class="era-status">${record ? (era==='future'?'발표 당시 계획':'공개 기록'):'추가 근거 필요'}</span></div><span class="era-date">${record?.date || '미확인'}</span><h3>${record?.title || (era==='past'?'이전 기록을 더 찾아야 합니다':'수록한 미래 계획이 없습니다')}</h3><p>${record?.text || '이 체계의 수록 자료만으로 변천이나 후속 계획을 추정하지 않습니다.'}</p>${record ? sourceCard(record.source) : ''}</article>`;
}
export function timeline(system) {
  if(!system) return '<div class="empty"><h2>비교할 체계가 없습니다</h2><p>필터를 초기화하고 체계를 선택해 주세요.</p><button type="button" class="action" data-clear>필터 초기화</button></div>';
  const events=[...system.events].sort((a,b)=>a.year-b.year);
  const latestSource=[...system.sourceIds].sort((a,b)=>sources[a].date.localeCompare(sources[b].date)).at(-1);
  const latest=events.at(-1);
  let past=events.length>1?{date:String(events[0].year),title:events[0].kind,text:`${events[0].country}와의 공개 계약 기록입니다.`,source:events[0].source}:null;
  if(system.id==='k2') past={date:'2007 → 2010',title:'시제 전차에서 양산 계약으로',text:'현대로템 연혁은 2007년 K2 시제 전차 출고와 2010년 1차 양산 계약을 기록합니다.',source:'rotem'};
  const current={date:latest?String(latest.year):sources[latestSource].date,title:latest?`${latest.country} ${latest.kind}`:system.project,text:system.fact,source:latest?.source || latestSource};
  const future=futurePlans[system.id];
  return `<div class="timeline-intro"><span class="eyebrow">THEN / NOW / NEXT</span><h2>${system.name}의 변천을 비교해 보세요</h2><p>과거의 기록, 최신 수록 상태, 공개된 미래 계획을 나란히 살펴봅니다.</p></div><div class="era-grid">${eraCard('past','과거',past)}${eraCard('current','현재 · 최신 수록',current)}${eraCard('future','미래',future?{...future,date:sources[future.source].date+' 발표'}:null)}</div><p class="timeline-note">현재는 수록한 자료의 발표 시점 기준입니다. 미래 계획은 확정 실적이 아니며, 선행·후속 체계의 전체 역사와 성능 비교는 추가 자료 검수가 필요합니다.</p>`;
}

export function welcome(){return storyWelcome(classicWelcome())}
