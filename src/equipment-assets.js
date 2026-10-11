import { catalogAssets } from './catalog-assets.js';
// Verified public assets; photographs and external 3D are deliberately distinct.
export const equipmentAssets={
 dosan:{kind:'photo',image:'https://upload.wikimedia.org/wikipedia/commons/6/65/ROKS_Dosan_Ahn_Changho_class_submarine.png',author:'대한민국 국방부',license:'공공누리 제1유형',url:'https://commons.wikimedia.org/wiki/File:ROKS_Dosan_Ahn_Changho_class_submarine.png',note:'도산안창호급 실물 사진 · 개별 함 식별이나 3D 잠항 동작을 의미하지 않습니다'},
 k2:{kind:'3d',uid:'8f79997ad7e14deea07a5a60c8af5308',author:'jjj0605',license:'CC BY 4.0',url:'https://sketchfab.com/3d-models/k-2-black-panther-tank-8f79997ad7e14deea07a5a60c8af5308',note:'상세 외형 3D · 원본의 금속 재질 표현이며 실물 위장 도색과 다릅니다'},
 fa50:{kind:'photo',image:'https://upload.wikimedia.org/wikipedia/commons/4/4f/Light_Combat_FA-50_Fighting_Eagle.jpg',author:'ROKAF / KAI 공개 사진',license:'CC BY 2.0',url:'https://commons.wikimedia.org/wiki/File:Light_Combat_FA-50_Fighting_Eagle.jpg',note:'실제 FA-50 사진 · 회전 가능한 3D 자산은 아직 확보되지 않았습니다'},
 chunmoo:{kind:'photo',image:'https://upload.wikimedia.org/wikipedia/commons/a/a1/K239_Chunmoo_Image1.jpg',author:'대한민국 국방부',license:'공공누리 제1유형',url:'https://commons.wikimedia.org/wiki/File:K239_Chunmoo_Image1.jpg',note:'실제 천무 발사대 사진 · 회전 가능한 3D 자산은 아직 확보되지 않았습니다'}
};

Object.assign(equipmentAssets, catalogAssets);
Object.assign(equipmentAssets.kaav,{
 waterline:.55,model:'./models/kaav-reference.glb',modelLabel:'공개 사진 기반 외형 재구성 · 제조사 CAD 아님',eye:[-.62,2.7,2.815647],
});

Object.assign(equipmentAssets.fa50,{image:'./media/fa50-1280.webp',model:'./models/fa50-reference.glb',modelLabel:'공개 사진 기반 외형 재구성 · 제조사 CAD 아님',modelAttribution:'./models/fa50-reference-ATTRIBUTION.md',modelLicense:'CC BY 2.0',range:32,focusHeight:2,eye:[0,3.35,3.12],eyeLabel:'조종석 관측 · 추정 시점',note:'KAI 공개 치수와 실물 사진을 참고한 외형 재구성'});
Object.assign(equipmentAssets.dosan,{model:'./models/dosan-reference.glb',modelLabel:'공개 사진 기반 외형 재구성 · 제조사 CAD 아님',modelAttribution:'./models/dosan-reference-ATTRIBUTION.md',modelLicense:'CC BY 4.0',waterline:6.5,range:110,focusHeight:8,eye:[0,18.5,17.75],eyeLabel:'함교 외부 · 추정 시점'});
Object.assign(equipmentAssets.nuri,{model:'./models/nuri-reference.glb',modelLabel:'KARI 공개 치수·사진 기반 외형 재구성',modelAttribution:'./models/nuri-reference-ATTRIBUTION.md',modelLicense:'CC BY 4.0',range:100,focusHeight:24});
