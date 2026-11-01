// Local exhibition reconstructions. Dimensions are modeling targets, not certified measurements.
export const vehicleModels={
 k2:{model:'./models/k2-photo-pbr.glb',modelLabel:'사진 색상 참고 PBR 표면 보강 · 형상은 추정',modelAttribution:'./models/PHOTO-PBR-ATTRIBUTION.md',modelLicense:'CC BY 3.0',range:20,focusHeight:1.6,studio:true,referencePhoto:'./media/representatives/k2.jpg',referenceUrl:'https://www.hyundai-rotem.co.kr/en/business/defense/details.do?productCt03=defense0101',photoCredit:'KBS VIEW – theDEEP · CC BY 3.0',photoUrl:'https://commons.wikimedia.org/wiki/File:K2_Black_Panther_20161106.jpg'},
 k9:{model:'./models/k9-photo-pbr.glb',modelLabel:'사진 색상 참고 PBR 표면 보강 · 형상은 추정',modelAttribution:'./models/PHOTO-PBR-ATTRIBUTION.md',modelLicense:'CC BY-SA 2.0',range:23,focusHeight:2,studio:true,referencePhoto:'./media/equipment/k9.webp',referenceUrl:'https://www.hanwhaaerospace.com/eng/whatwedo/product/land.do',photoCredit:'대한민국 국군 · CC BY-SA 2.0',photoUrl:'https://commons.wikimedia.org/wiki/File%3AK-9%20%EC%9E%90%EC%A3%BC%ED%8F%AC%20(7445556056)%20(2).jpg'}
};

// Explicit review variant; the deployed default stays on its original geometry.
export const k2PhotoStudy={...vehicleModels.k2,model:'./models/k2-photo-study.glb',modelLabel:'AI 추정 4면 재질 시험 · 형상 초안',modelAttribution:'./models/k2-photo-study-ATTRIBUTION.md',study:true};
