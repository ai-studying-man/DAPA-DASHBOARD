export const detailedAssets={
 dosan:{model:'./models/dosan-detailed-cc0.glb',modelAttribution:'./models/DETAILED-ASSETS.md',modelLicense:'CC0',waterline:7.6,visualStage:'detailed-source',visualLabel:'공개 제작자 세부 외형 · 2K PBR, 실측 CAD 아님',modelLabel:'공개 CC0 세부 외형 · 원본 2K 재질'},
};
const photoSources={
 k9:{image:'./media/equipment/k9.webp',photoUrl:'https://commons.wikimedia.org/wiki/File:K-9_자주포_(7445556056)_(2).jpg',photoCredit:'Republic of Korea Armed Forces',license:'CC BY-SA 2.0'},
 k21:{image:'./media/reference-verified/k21-front.jpg',photoUrl:'https://commons.wikimedia.org/?curid=155897460',photoCredit:'Republic of Korea Armed Forces',license:'CC BY-SA 2.0'},
 k216:{image:'./media/reference-verified/k216-dvids.jpg',photoUrl:'https://www.dvidshub.net/image/8039572/dig-your-heels-rok-cbrn-marines-set-up-camp',photoCredit:'Cpl. Chloe Johnson · US Marine Corps / DVIDS',license:'Public Domain'},
 fa50:{image:'./media/fa50-1280.webp',photoUrl:'https://commons.wikimedia.org/wiki/File:Light_Combat_FA-50_Fighting_Eagle.jpg',photoCredit:'Republic of Korea Air Force / KAI',license:'CC BY 2.0'},
};
for(const [id,source] of Object.entries(photoSources))detailedAssets[id]={...source,model:id==='fa50'?'./models/fa50-surface-v2.glb':`./models/${id}-gpt-blender.glb`,modelAttribution:'./models/GPT-BLENDER.md',modelLicense:source.license,visualStage:'blender-reference',visualLabel:id==='fa50'?'Blender 외형·표면 검토본 · 형상 추정':'GPT 참고 재질 · Blender 부품 외형 · 형상 추정',modelLabel:'Blender 부품·재질 검토본'};
for(const id of ['chungnam','chunmoo'])detailedAssets[id]={model:`./models/${id}-referenced-v2.glb`,modelAttribution:'./models/DETAILED-ASSETS.md',visualStage:'reference-draft',visualLabel:'장비별 외형 보완 초안 · 실사 정밀도 미달',modelLabel:'장비별 형상 검토본'};
Object.assign(detailedAssets.chunmoo,{model:'./models/chunmoo-gpt-blender.glb',modelAttribution:'./models/GPT-BLENDER.md'});
