import {systems, domains} from './data.js';
import {equipmentAssets} from './equipment-assets.js';
import {icon} from './icons.js';

export const commonSystem = system => system.branches.length > 1 || system.branches.includes('합동');
const groups = [
  ['전체', '전체 체계', 'layers'],
  ['육군', '육군', 'land'], ['해군', '해군', 'sea'],
  ['공군', '공군', 'air'], ['해병대', '해병대', 'sea'],
  ['shared', '공통·합동', 'network'],
];
const count = key => systems.filter(s => key === '전체' || (key === 'shared' ? commonSystem(s) : s.branches.includes(key))).length;
const badge = system => system.id==='redback'?'수출형 체계':system.branches.length > 1 ? '여러 군의 공개 운용 사례' : system.branches.includes('합동') ? system.id === 'nuri' ? '민간 우주 기반' : '합동·우주 기반' : '군별 대표 체계';

export function forcesDashboard(items, selected, group) {
  return `<section class="forces-dashboard" aria-labelledby="forces-heading">
    <header class="forces-overview"><div><span class="eyebrow">군별 체계와 공통 활용</span><h2 id="forces-heading">한눈에 보는 우리나라의 기술</h2><p>군을 누르고, 장비를 살펴보세요. 서로 다른 환경에서 만나는 기술을 함께 볼 수 있어요.</p></div><div class="forces-metrics"><div><strong>${systems.length}</strong><span>수록 체계</span></div><div><strong>${systems.filter(s => s.branches.length > 1).length}</strong><span>군 간 공통</span></div><div><strong>${systems.filter(s => s.branches.includes('합동')).length}</strong><span>합동·우주 기반</span></div></div></header>
    <nav class="forces-groups" aria-label="전군 현황 군별 선택">${groups.map(([id, name, glyph]) => `<button type="button" data-force-group="${id}" aria-pressed="${group === id}" class="force-group">${icon(glyph)}<span>${name}</span><strong>${count(id)}</strong></button>`).join('')}</nav>
    <p class="forces-scope">공개자료로 수록한 체계입니다. 수출형과 개발 중인 사업도 포함합니다. 전체 보유 수량이나 실제 배치를 나타내지 않습니다. 여러 군에 연결된 체계는 전체 합계에서 한 번만 셉니다.</p>
    <div class="forces-result"><h3>장비를 눌러 자세히 보기</h3><span role="status" aria-live="polite"><strong>${items.length}</strong> <span>개 체계</span></span></div>
    ${items.length ? `<div class="forces-grid">${items.map(system => {
      const asset = equipmentAssets[system.id];
      const image = asset?.image;
      return `<button type="button" class="force-system" data-force-system="${system.id}" aria-pressed="${selected === system.id}"><div class="force-image">${image ? `<img src="${image}" alt="${system.name} 실제 장비 사진" width="640" height="360" loading="lazy" />` : `<span class="force-symbol">${icon(domains.find(d => d.id === system.domains[0]).icon)}<span>공개 사업 자료</span></span>`}</div><div class="force-copy"><small>${badge(system)}</small><strong>${system.name}</strong><span>${system.subtitle}</span><div class="force-tags">${system.branches.map(branch => `<span>${branch}</span>`).join('')}${system.domains.map(domain => `<span>${domains.find(d => d.id === domain).name}</span>`).join('')}</div>${image?`<span class="force-credit">${asset.author} · ${asset.license}</span>`:''}<span class="force-open">설명·시연 보기 ${icon('arrow')}</span></div></button>`;
    }).join('')}</div>` : `<div class="empty"><h3>검색 결과가 없습니다</h3><p>다른 검색어나 영역으로 찾아보세요.</p><button type="button" class="action" data-clear>필터 초기화</button></div>`}
    <details class="forces-method"><summary>군별 분류와 공통 활용은 어떻게 다른가요?</summary><p>육군·해군·공군·해병대 분류는 수록한 공개 사례입니다. 공통·합동에는 여러 군의 공개 사례와 합동·우주 기반 사업을 함께 모았습니다. 모든 체계가 네 군에 동시에 배치되었다는 뜻은 아닙니다. 누리호는 민간 우주 기반입니다.</p><p>장비를 선택하면 상세 설명과 원문 근거를 확인할 수 있어요. 지도 위치는 전시용 기준점이며 실제 배치가 아닙니다.</p></details>
  </section>`;
}
