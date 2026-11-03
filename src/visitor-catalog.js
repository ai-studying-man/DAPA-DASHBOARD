import {publicFleet} from './public-equipment.js';
import {systems} from './data.js';
import {equipmentAssets} from './equipment-assets.js';
import entries from './equipment-mvp.json' with {type:'json'};
import {representatives} from './representative-data.js';
import {equipmentCompanies} from './equipment-companies.js';

// Keep both existing collections; the original 21-item catalogue is not replaced.
const legacy=[...systems.map(system=>{
 const mvp=entries.find(item=>item.id===system.id),asset=equipmentAssets[system.id]||{},rep=representatives.find(item=>item.id===system.id);
 return {visualStage:asset.visualStage||(asset.model?'reconstruction':mvp?'draft':'pending'),visualLabel:asset.visualLabel||'사진 참고 외형 · 세부 보완 중',mvp:Boolean(mvp),id:system.id,name:rep?.name||system.name,role:system.summary,branches:system.branches,domain:system.domains[0],model:asset.model||mvp?.model,asset,video:rep?.video||(system.id==='k9'?{kind:'embed',src:'https://www.youtube-nocookie.com/embed/a8cDf8WPRBg',title:'K9 실제 기동 시연 · 한화 공식 영상',publisher:'Hanwha 공식 채널',context:'한화 공식 채널의 K9 실제 기동 촬영 영상입니다. 외부 플레이어는 인터넷 연결이 필요합니다.',url:'https://www.youtube.com/watch?v=a8cDf8WPRBg',rights:'공식 영상 임베드 · 파일 재배포하지 않음'}:undefined)};
}),...entries.filter(item=>!systems.some(system=>system.id===item.id)).map(item=>{const asset=equipmentAssets[item.id]||{};return {mvp:true,id:item.id,name:item.name,role:item.category==='foreign'?'해외 장비의 외형을 비교해 보세요.':item.category==='air'?'하늘에서 활동하는 장비를 만나보세요.':'지상에서 활동하는 장비를 만나보세요.',branches:[],domain:item.category==='air'||['f22','f117'].includes(item.id)?'air':'land',model:asset.model||item.model,asset,foreign:item.category==='foreign',visualStage:asset.visualStage||'draft',visualLabel:asset.visualLabel||'정밀 외형 제작 중'}})].map(entry=>({...entry,companies:equipmentCompanies(entry.id),fullName:entry.name,name:entry.name.replace(/\s*\([^)]*\)/g,'').replace(' with 현궁',' 현궁 탑재 차량').trim()}));

export const visitorEquipment=publicFleet.map(entry=>{
 const original=legacy.find(item=>item.id===entry.id);
 const item=original||{id:entry.id,name:entry.name,fullName:entry.name,branches:[],role:'소형 무인 정찰기',companies:equipmentCompanies(entry.id),asset:{},domain:entry.domain};
 return {...item,domain:entry.domain,model:entry.model,image:entry.referencePhoto,ai:false,visualStage:'exterior-study',
   dashboard:systems.some(system=>system.id===entry.id),sources:entry.sources,family:entry.family,asset:{...item.asset,model:entry.model,photoUrl:entry.referenceUrl,photoCredit:entry.photoCredit,photoLicenseUrl:entry.photoLicenseUrl,modelAttribution:entry.modelAttribution},
   primarySource:entry.referenceUrl||entry.sources[0]?.url};
});
