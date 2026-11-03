import {publicEquipment} from './public-equipment.js';
import mvpEquipment from './equipment-mvp.json' with {type:'json'};
import {detailedAssets} from './detailed-assets.js';
export const groundEquipment={
 k2:{name:'K2 흑표',model:'./models/k2-photo-pbr.glb',range:20,photo:'./media/representatives/k2.jpg',credit:'KBS VIEW – theDEEP · CC BY 3.0',source:'https://www.hyundai-rotem.co.kr/ko/business/defense/details.do?productNm=K2',attribution:'./models/PHOTO-PBR-ATTRIBUTION.md',hatch:[-.65,-1.2,3.1],driver:[0,2.8,1.25]},
 k9:{name:'K9 자주포',model:'./models/k9-photo-pbr.glb',range:23,photo:'./media/equipment/k9.webp',credit:'대한민국 국군 · CC BY-SA 2.0',source:'https://www.hanwhaaerospace.com/eng/whatwedo/product/land.do',attribution:'./models/PHOTO-PBR-ATTRIBUTION.md',hatch:[-.65,-1.2,3.6],driver:[-.7,2.8,1.3]},
};
export function selectGroundEquipment(id){
 const detail=detailedAssets[id];
 if(Object.hasOwn(groundEquipment,id))return {...groundEquipment[id],...(detail?{model:detail.model,attribution:detail.modelAttribution,photo:detail.image,credit:detail.photoCredit,photoReconstructed:true,hatch:null,driver:null}:{}),id};
 const item=mvpEquipment.find(item=>item.id===id);
 if(!item)return {...groundEquipment.k2,id:'k2'};
 const record=publicEquipment.get(id);
 return {id:item.id,name:item.name,model:record?.model||detail?.model||item.model,range:item.range,photo:record?.referencePhoto,credit:record?.photoCredit,source:record?.referenceUrl||record?.sources[0]?.url,attribution:detail?.modelAttribution||'./models/mvp/README.md',hatch:null,driver:null,mvp:!detail,photoReconstructed:detail?.visualStage==='photo-reconstructed',altitude:item.altitude};
}
