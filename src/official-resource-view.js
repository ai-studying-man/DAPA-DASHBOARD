import {translateText} from './i18n.js';
import { officialResources } from './official-resources.js';
import { icon } from './icons.js';

const preserveTerms=text=>text.replace(/(?:Warning Lights|L\/G Panel|Side Stick|Throttle Grip)(?:의|을|를)?/g,term=>`<span class="source-term">${term}</span>`);

export function officialResourceCards(system) {
 const resources=officialResources[system.id];
 if(!resources?.length)return '';
 return `<section class="official-resources" aria-label="제조사·연구기관 공식 자료"><h3>공식 자료로 더 자세히</h3><p class="micro">기관이 공개한 구성·조종석·3D 전시를 원문에서 확인하세요.</p>${resources.map(resource=>`<article class="official-resource"><span class="eyebrow">${resource.publisher}</span><h4>${resource.title}</h4><p>${resource.scope}</p>${resource.facts?.length?`<dl class="official-resource-facts">${resource.facts.map(fact=>`<div><dt>${fact.name}</dt><dd>${preserveTerms(translateText(fact.description))}</dd></div>`).join('')}</dl>`:''}<a href="${resource.url}" target="_blank" rel="noopener noreferrer">공식 원문 열기 ${icon('external')}</a><small>${resource.rights}</small><small>자료 확인 ${resource.verifiedAt}</small></article>`).join('')}</section>`;
}
