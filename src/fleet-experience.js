import entries from './fleet-assets.json' with {type:'json'};
import {ModelStudio} from './model-studio.js';
import {setLocale,getLocale} from './i18n.js';
import {fleetCopy} from './fleet-copy.js';
import {equipmentNameMarkup} from './equipment-name.js';
import './fonts.css';
import './styles.css';
import './equipment-mvp.css';
import './fleet.css';

const root=document.querySelector('#app'),params=new URLSearchParams(location.search);
const requested=params.get('lang');if(['ko','en','ja','zh'].includes(requested))setLocale(requested);
let selected=entries.find(item=>item.id===params.get('item'))||entries.find(item=>item.id==='k2'),filter='all',studio;
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=()=>fleetCopy[getLocale()]||fleetCopy.ko;
function render(){
 const active=document.activeElement;
 const focus=active?.hasAttribute('data-fleet-item')?`[data-fleet-item="${CSS.escape(active.dataset.fleetItem)}"]`:['[data-fleet-equipment]','[data-fleet-filter]','[data-fleet-language]','[data-fleet-step="-1"]','[data-fleet-step="1"]'].find(selector=>active?.matches(selector));
 studio?.destroy();const t=text(),visible=entries.filter(item=>filter==='all'||item.domain===filter);
 if(!visible.includes(selected))selected=visible[0];
 root.innerHTML=`<main class="mvp-experience fleet-experience"><header class="mvp-header"><a class="action" href="./">${t.home}</a><div><h1>${t.title}</h1><p>${t.intro}</p></div><label class="fleet-language">Language<select data-fleet-language aria-label="Language">${[['ko','한국어'],['en','English'],['ja','日本語'],['zh','中文']].map(([key,label])=>`<option value="${key}" ${getLocale()===key?'selected':''}>${label}</option>`).join('')}</select></label></header><div class="mvp-controls"><label>${t.type}<select data-fleet-filter>${['all','land','sea','air','space'].map(key=>`<option value="${key}" ${filter===key?'selected':''}>${t[key]}</option>`).join('')}</select></label><label>${t.equipment}<select data-fleet-equipment>${visible.map(item=>`<option value="${item.id}" ${item===selected?'selected':''}>${escape(item.name)}</option>`).join('')}</select></label><button class="action" data-fleet-step="-1" ${visible.indexOf(selected)===0?'disabled':''}>${t.previous}</button><button class="action" data-fleet-step="1" ${visible.indexOf(selected)===visible.length-1?'disabled':''}>${t.next}</button></div><p class="fleet-summary" role="status">${visible.length} / ${entries.length} ${t.count} · ${t.status}</p><div class="mvp-layout"><nav class="mvp-list" aria-label="${t.equipment}">${visible.map((item,index)=>`<button type="button" class="action" data-fleet-item="${item.id}" aria-pressed="${item===selected}"><small>${String(index+1).padStart(2,'0')}</small>${escape(item.name)}</button>`).join('')}</nav><section class="mvp-model"><div id="fleet-stage"></div><p class="mvp-disclosure">${t.note}</p></section><aside class="mvp-reference"><h2>${t.reference}</h2><strong>${equipmentNameMarkup(selected.name)}</strong>${selected.foreign?`<p>${t.foreign}</p>`:''}${selected.identityReview?`<p>${t.identity}</p>`:''}${selected.family==='satellite'?`<p>${t.satellite}</p>`:''}<p>${selected.referenceKind==='public-photo'?t.photo:selected.referenceKind==='ai-generated'?t.ai:t.pending}</p>${selected.referencePhoto?`<img src="${escape(selected.referencePhoto)}" alt="${escape(selected.name)} · ${selected.referenceKind==='public-photo'?t.photo:t.ai}" width="640" height="420">`:''}<p>${escape(selected.photoCredit||'')}</p>${selected.referenceUrl?`<a href="${escape(selected.referenceUrl)}" target="_blank" rel="noopener noreferrer">${t.source}</a>`:''}${selected.sources.map(source=>`<a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.publisher)} · ${t.source}</a>`).join('')}<a href="${escape(selected.modelAttribution)}" target="_blank" rel="noopener noreferrer">${t.license}</a><p>${escape(selected.modelLicense)}</p></aside></div></main>`;
 root.querySelector('[data-fleet-filter]').onchange=event=>{filter=event.target.value;render()};
 root.querySelector('[data-fleet-equipment]').onchange=event=>choose(event.target.value);
 root.querySelector('[data-fleet-language]').onchange=event=>{setLocale(event.target.value);render()};
 root.querySelectorAll('[data-fleet-item]').forEach(button=>button.onclick=()=>choose(button.dataset.fleetItem));
 root.querySelectorAll('[data-fleet-step]').forEach(button=>button.onclick=()=>choose(visible[visible.indexOf(selected)+Number(button.dataset.fleetStep)].id));
 const asset={...selected,studio:true,pipeline:true,fleet:true,referencePhoto:selected.referencePhoto,photoUrl:selected.referenceUrl,photoCredit:selected.photoCredit,referenceUrl:selected.referenceUrl||selected.modelAttribution};
 studio=new ModelStudio(root.querySelector('#fleet-stage'),{id:selected.id,name:selected.name},asset,render);
 window.fleetQA={get studio(){return studio},entries,selected:selected.id};
 if(focus){const target=root.querySelector(focus);(target?.disabled?root.querySelector('[data-fleet-equipment]'):target)?.focus({preventScroll:true})}
 const url=new URL(location.href);url.searchParams.set('view','fleet');url.searchParams.set('item',selected.id);url.searchParams.set('lang',getLocale());history.replaceState(null,'',url);
}
function choose(id){const item=entries.find(x=>x.id===id);if(!item)return;selected=item;render()}
window.addEventListener('pagehide',()=>studio?.destroy());
window.addEventListener('pageshow',event=>{if(event.persisted)render()});
render();
