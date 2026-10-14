import { getLocale } from './i18n.js';
const urls=[
'https://www.gov.pl/web/national-defence/real-strengthening-of-the-polish-deterrence-and-defence-potential',
'https://www.gov.pl/web/obrona-narodowa/umowa-podpisana-potezne-wzmocnienie-wojsk-pancernych---180-czolgow-k2-trafi-do-armii'];
const copy={
ko:{title:'폴란드 K2 계약, 숫자로 확인해요',contract:'확정 이행계약',count:'계약 수량',schedule:'발표 당시 인도 예정',detail:'추가 계약 구성',first:'첫 계약',second:'추가 계약',units:'대',source:'폴란드 국방부 원문',delivery:'인도 완료 여부는 별도 확인이 필요해요.',note:'계약과 인도 완료는 달라요. 기본 합의 수량을 완료 실적으로 표시하지 않습니다.',review:'원문 검토: 2026.10.14'},
en:{title:'Poland’s K2 contracts: the published numbers',contract:'Signed executive contract',count:'Contract quantity',schedule:'Delivery schedule announced then',detail:'Additional contract configuration',first:'First contract',second:'Additional contract',units:'tanks',source:'Polish Ministry of National Defence',delivery:'Completed deliveries require separate evidence.',note:'A contract is not a completed delivery. Framework quantities are not completed deliveries.',review:'Source review: 14 October 2026'},
ja:{title:'ポーランドのK2契約を数字で確認',contract:'署名済み実行契約',count:'契約台数',schedule:'発表当時の引渡し予定',detail:'追加契約の構成',first:'最初の契約',second:'追加契約',units:'両',source:'ポーランド国防省の原文',delivery:'引渡し完了は別の資料で確認が必要です。',note:'契約と引渡し完了は異なります。枠組み合意の台数を完了実績とは表示しません。',review:'原文確認：2026年10月14日'},
zh:{title:'用公布的数字了解波兰K2合同',contract:'已签署执行合同',count:'合同数量',schedule:'发布时预计交付时间',detail:'追加合同配置',first:'首份合同',second:'追加合同',units:'辆',source:'波兰国防部原文',delivery:'交付完成情况需要另行确认。',note:'签订合同不等于完成交付。框架协议数量不作为已完成交付的业绩。',review:'原文核查：2026年10月14日'}
};
export function exportProof(id){
 if(id!=='k2')return '';
 const c=copy[getLocale()]||copy.ko;
 return `<section class="export-proof" data-no-translate aria-label="${c.title}"><h3>${c.title}</h3><div class="export-proof-grid">${[['2022-08-26',c.first,'2022–2025'],['2025-08-01',c.second,'2026–2030']].map(([date,label,schedule],i)=>`<article class="source-card"><h4>${label} · ${date}</h4><p class="badge">${c.contract}</p><dl><dt>${c.count}</dt><dd><strong>180 ${c.units}</strong></dd><dt>${c.schedule}</dt><dd>${schedule}</dd>${i?`<dt>${c.detail}</dt><dd>K2GF 116 + K2PL 64</dd>`:''}</dl><p>${c.delivery}</p><a href="${urls[i]}" target="_blank" rel="noopener noreferrer">${c.source}</a></article>`).join('')}</div><p class="micro">${c.note}</p><small>${c.review}</small></section>`;
}
