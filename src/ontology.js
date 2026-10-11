import { systems, sources, domains } from './data.js';
import { profiles, regions } from './exhibition-data.js';
export const ontology = {
  objects: systems.flatMap(s=>[
    {id:'system:'+s.id,type:'System',name:s.name},
    {id:'project:'+s.id,type:'Project',name:s.project},
    ...profiles[s.id].organizations.map(o=>({id:'organization:'+o.name,type:'Organization',name:o.name})),
  ]),
  links: systems.flatMap(s=>[
    {from:'system:'+s.id,to:'project:'+s.id,type:'belongsToProject',basis:'수록 공개 사업',sourceIds:s.sourceIds},
    ...profiles[s.id].organizations.map(o=>({from:'organization:'+o.name,to:'system:'+s.id,type:'participatesIn',basis:o.role,sourceIds:[o.source]})),
    ...regions.filter(r=>r.systems.includes(s.id)).map(r=>({from:'system:'+s.id,to:'region:'+r.id,type:'publicIndustryLink',basis:r.description,sourceIds:[r.source]})),
    ...s.sourceIds.map(id=>({from:'system:'+s.id,to:'source:'+id,type:'documentedBy',basis:'공개 근거',sourceIds:[id]})),
  ]),
};
ontology.objects.push(...regions.map(r=>({id:'region:'+r.id,type:'Region',name:r.name})),...Object.entries(sources).map(([id,s])=>({id:'source:'+id,type:'Source',name:s.title})));
ontology.objects=[...new Map(ontology.objects.map(o=>[o.id,o])).values()];
export function relatedSystems(id){
  const selected=systems.find(s=>s.id===id);
  return systems.filter(s=>s.id!==id).flatMap(s=>{
    const sharedOrg=profiles[selected.id].organizations.filter(a=>a.type==='기업'&&profiles[s.id].organizations.some(b=>b.name===a.name));
    const sharedDomains=s.domains.filter(d=>selected.domains.includes(d));
    if(!sharedOrg.length&&!sharedDomains.length)return [];
    return [{system:s,basis:sharedOrg.length?'공통 공개 참여기업':'같은 활동 환경',explanation:sharedOrg.length?sharedOrg.map(o=>o.name).join(' · '):sharedDomains.map(d=>domains.find(x=>x.id===d).name).join(' · '),sourceIds:[...new Set(sharedOrg.flatMap(o=>[o.source,...profiles[s.id].organizations.filter(b=>b.name===o.name).map(b=>b.source)]))],kind:sharedOrg.length?'source-backed':'classification'}];
  });
}
export function connections(id){return ontology.links.filter(l=>l.from==='system:'+id||l.to==='system:'+id)}

for(const system of systems)for(const relation of relatedSystems(system.id))if(system.id.localeCompare(relation.system.id)<0)ontology.links.push({from:'system:'+system.id,to:'system:'+relation.system.id,type:relation.kind==='classification'?'sharesDomain':'sharesPublicOrganization',basis:relation.basis+' · '+relation.explanation,sourceIds:relation.sourceIds});
