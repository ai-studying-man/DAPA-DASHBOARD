import { roleSummary, organizationCards } from './exhibition.js';
import { icon } from './icons.js';
import { domains, sources, modes } from './data.js';

export const action = (id, label, glyph, extra = '') => `<button type="button" class="action" id="${id}" aria-label="${label}" title="${label}" ${extra}>${icon(glyph)}<span>${label}</span></button>`;
export const modeNav = (selected) => modes.map((m) => `<button type="button" data-mode="${m.id}" class="nav-item ${m.id === selected ? 'selected' : ''}" aria-pressed="${m.id === selected}">${icon(m.icon)}<span>${m.name}</span></button>`).join('');
export const chips = (selected) => domains.map((d) => `<button type="button" class="chip ${d.id === selected ? 'selected' : ''}" data-domain="${d.id}" aria-pressed="${d.id === selected}">${icon(d.icon)}${d.name}</button>`).join('');
export const card = (system, selected) => `<button type="button" class="system-card ${selected === system.id ? 'selected' : ''}" data-system="${system.id}" aria-pressed="${selected === system.id}"><span class="system-glyph ${system.domains[0]}">${icon(domains.find((d) => d.id === system.domains[0]).icon)}</span><span><strong>${system.name}</strong><small>${system.subtitle}</small></span><span class="card-arrow">${icon('arrow')}</span></button>`;
export const sourceCard = (id) => {
  const s = sources[id];
  return `<a class="source-card" href="${s.url}" target="_blank" rel="noopener noreferrer"><span><strong>${s.publisher}</strong><small>${s.title}</small><small>${s.date} · ${s.locator}</small></span>${icon('external')}</a>`;
};
export function detail(system, mode) {
  if (!system) return `<div class="empty"><h2>선택할 체계가 없습니다</h2><p>검색어나 필터를 바꾸면 다시 탐색할 수 있습니다.</p><button type="button" class="action" data-clear>필터 초기화</button></div>`;
  return `<div class="detail-top"><span class="eyebrow">SYSTEM / ${system.domains.map((id) => domains.find((d) => d.id === id).name).join(' · ')}</span><span class="badge">공개자료</span></div><h2>${system.name}<span>${system.subtitle}</span></h2><p class="english">${system.english}</p>${roleSummary(system)}<details class="detail-more"><summary>기업·사업·수출과 근거 보기</summary>${organizationCards(system)}<div class="facts"><div><small>관련 군 · 설명용 분류</small><strong>${system.branches.join(' · ')}</strong></div><div><small>임무 · 설명용 분류</small><strong>${system.mission}</strong></div></div><section><h3>공개자료로 보는 이야기</h3><p>${system.fact}</p></section><section><h3>연결된 사업</h3><button type="button" class="relation-link" data-to-graph>${icon('network')}<span>${system.project}</span>${icon('arrow')}</button><small class="muted">${system.maker}</small></section><section><h3>수출·계약 사건 <span>${system.events.length}</span></h3>${system.events.length ? system.events.map((e) => `<div class="event"><span class="event-year">${e.year}</span><span><strong>${e.country}</strong><small>${e.kind}</small><a href="${sources[e.source].url}" target="_blank" rel="noopener noreferrer">발표 원문 ${icon('external')}</a></span></div>`).join('') : '<p class="muted">이 MVP에 확인된 수출 사건이 없습니다. 수출 여부 전체를 판단하는 값은 아닙니다.</p>'}${system.events.length && mode !== 'world' ? '<button type="button" class="text-action" data-to-world>세계 지도에서 보기 →</button>' : ''}</section><section class="sources"><h3>근거 자료</h3>${system.sourceIds.map(sourceCard).join('')}<p class="micro">확인일 2026.10.12 · 자료 발표 시점 기준<br>최신 전체 사업·수출 통계가 아닙니다.</p></section></details>`;
}
export function graph(system) {
  if (!system) return '<div class="empty">관계망에 표시할 체계를 먼저 찾아보세요.</div>';
  const nodes = [
    { type: '영역', text: system.domains.map((d) => domains.find((v) => v.id === d).name).join(' · '), action: `data-domain="${system.domains[0]}"` },
    { type: '임무', text: system.mission, action: `data-search="${system.mission}"` },
    { type: '사업', text: system.project, action: `data-system="${system.id}"` },
    { type: '기관', text: system.maker, action: `data-search="${system.maker}"` },
    { type: '국가', text: system.events.length ? [...new Set(system.events.map(e=>e.country))].join(' · ') : '등록 사건 없음', action: system.events.length ? 'data-to-world' : 'disabled' },
    { type: '근거', text: `${system.sourceIds.length}개 공개자료`, action: 'data-focus-sources' },
  ];
  return `<div class="graph-layout"><div class="graph-center"><span class="eyebrow">무기체계 / 사업</span><strong>${system.name}</strong><small>관계 노드를 눌러 탐색하세요</small></div><div class="graph-nodes">${nodes.map((node) => `<button type="button" class="graph-node" ${node.action}><span>${node.type}</span><strong>${node.text}</strong>${icon('arrow')}</button>`).join('')}</div></div><div class="graph-note">체계 → 영역·임무·사업·기관·국가·근거<br>설명용 분류와 공개 사실을 연결한 MVP 지식 구조</div>`;
}
export function showcase() {
  return `<main class="showcase"><h1>ATLAS / Components</h1><p>기본 · 선택 · 비활성 · 로딩 · 빈 결과 · 오류 상태</p><div class="cluster">${action('demo-action', '기본 동작', 'arrow')}${action('demo-disabled', '비활성', 'close', 'disabled')}<button class="chip selected" aria-pressed="true">선택한 영역</button></div><nav class="showcase-nav">${modeNav('korea')}</nav><div class="status-card" role="status">지도 준비 중…</div><div class="empty">등록된 체계가 없습니다.</div><div class="status-card error" role="status">지도 오류 · 목록으로 탐색해 주세요.</div><a href="./" class="action">대시보드 열기</a></main>`;
}
