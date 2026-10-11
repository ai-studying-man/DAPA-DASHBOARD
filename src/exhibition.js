import { profiles, regions, tourStops } from './exhibition-data.js';
import { systems, sources } from './data.js';
import { icon } from './icons.js';
export function narration(system) {
  const p=profiles[system.id];
  return `${system.name}. ${p.role} 이 전시에서는 ${p.focus}을 살펴봅니다. ${p.organizations.map(o=>`${o.name}은 ${o.role}으로 공개자료에 연결되어 있습니다.`).join(' ')} 공개자료에 수록된 대표 사례이며 전체 참여기관 목록은 아닙니다.`;
}
export function roleSummary(system) {
  const p=profiles[system.id];
  return `<div class="role-summary"><span class="eyebrow">어떤 체계인가요?</span><p>${p.role}</p><small>전시에서 볼 점 · ${p.focus}</small></div><div class="voice-controls"><button type="button" class="action" data-demo-open>장비 살펴보기 ${icon('arrow')}</button><button type="button" class="action" data-listen>${icon('speaker')}설명 듣기</button><button type="button" class="action" data-voice-stop>${icon('stop')}멈춤</button></div><p class="micro" data-voice-status role="status">버튼을 누르면 한국어 음성으로 안내합니다.</p><div class="model-frame"><div id="system-model-host" class="model-host" role="img" aria-label="${system.name} 장비 외형 자료">3D 모델 준비 중…</div><div class="model-caption"><span>실제 사진 / 공개 3D · 출처와 유형 확인</span><button type="button" class="text-action" data-model-home>시점 복원</button></div></div>`;
}
export function organizationCards(system) {
  return `<section class="organization-section"><h3>누가 함께 만들었나요?</h3><div class="organization-list">${profiles[system.id].organizations.map(o=>`<a class="organization-card" href="${sources[o.source].url}" target="_blank" rel="noopener noreferrer"><span class="organization-type">${o.type}</span><strong>${o.name}</strong><span>${o.role}</span><small>${sources[o.source].publisher} · 공개 근거 ${icon('external')}</small></a>`).join('')}</div><p class="micro">공개자료에 확인된 역할입니다. 전체 참여기업·기관 목록은 아닙니다.</p></section>`;
}
export function regionPicker(selected) {
  const region=regions.find(r=>r.id===selected);
  return `<div class="region-heading"><strong>지역으로 찾아보기</strong><span>공개 산업 연결 · 도시 단위</span></div><div class="region-buttons">${regions.map(r=>`<button type="button" class="region-button ${r.id===selected?'selected':''}" data-region="${r.id}" aria-pressed="${r.id===selected}"><strong>${r.name}</strong><small>${r.theme}</small></button>`).join('')}<button type="button" class="text-action" data-region-clear>전체 체계</button></div>${region?`<p class="region-note">${region.description} <a href="${sources[region.source].url}" target="_blank" rel="noopener noreferrer">근거 보기 ${icon('external')}</a></p>`:''}`;
}
export function tourDialog() {
  return `<dialog id="voice-tour" class="tour-dialog" aria-labelledby="tour-title"><div class="dialog-heading"><div><span class="eyebrow">K-방산 음성 전시</span><h2 id="tour-title">기술을 따라가는 다섯 이야기</h2></div><button type="button" class="action" id="tour-close">전시 닫기 ${icon('close')}</button></div><div class="tour-body" tabindex="0" aria-label="전시 모델과 설명"><div id="tour-model-host" class="tour-model-host" role="img" aria-label="현재 체계의 장비 외형 자료"></div><div class="tour-story"><span id="tour-step" class="eyebrow"></span><h3 id="tour-system"></h3><p id="tour-caption"></p><div id="tour-organizations"></div><p class="micro" data-voice-status role="status">음성을 준비하고 있습니다.</p></div></div><div class="tour-progress" aria-label="전시 장면 선택">${tourStops.map((id,i)=>`<button type="button" data-tour-step="${i}" aria-pressed="false">${i+1}. ${systems.find(s=>s.id===id).branches[0]==='합동'?'우주':systems.find(s=>s.id===id).branches[0]}</button>`).join('')}</div><div class="tour-controls"><button type="button" class="action" id="tour-prev">이전 체계</button><button type="button" class="action" id="tour-listen">${icon('speaker')}다시 듣기</button><button type="button" class="action" data-voice-stop>${icon('stop')}음성 멈춤</button><label class="tour-auto"><input type="checkbox" id="tour-auto" />안내 후 자동 넘김</label><button type="button" class="primary-action" id="tour-next">다음 체계 ${icon('arrow')}</button></div><p class="micro">자막은 항상 표시합니다. 설치된 한국어 음성을 사용하며, 장비 자료의 유형과 사용 조건을 함께 표시합니다.</p></dialog>`;
}
