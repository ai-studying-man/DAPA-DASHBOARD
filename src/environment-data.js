export const environments={
 land:{name:'지상 · 산악',text:'실제 위성 영상과 고도 지형 위에서 산악 환경과 장비 외형 자료를 함께 관찰합니다.',steps:['한반도','산악 환경','장비 관찰']},
 plain:{name:'지상 · 평지',text:'전주 일대의 실제 위성·고도 지도에서 평지와 지상 장비의 관계를 살펴봅니다.',steps:['한반도','평지 환경','장비 관찰']},
 sea:{name:'해상 · 수면',text:'한반도 동해 해역과 실제 함정 외형 자료를 함께 살펴봅니다.',steps:['한반도','해상 환경','함정 자료']},
 underwater:{name:'해상 · 수중 체계',text:'동해 위성 지도와 잠수함 실물 자료를 관찰합니다. 수중 가시화·실제 잠항 수심·해저 모델은 제공하지 않습니다.',steps:['한반도','해상 관측','잠수함 자료']},
 air:{name:'공중 · 하늘',text:'실제 한반도 위성 지도와 항공기 외형 자료를 관찰합니다. 관측 높이는 전시용이며 실제 비행 항로나 운용 고도가 아닙니다.',steps:['한반도','공중 환경','항공기 자료']},
 coast:{name:'연안 · 해상에서 지상',text:'포항 동해 연안에서 KAAV 외형 재구성과 상륙훈련 실제 사진을 비교합니다. 사진 기반 재구성은 RCWS 개량형이나 제조사 CAD가 아닙니다.',steps:['한반도','연안 환경','장비 관찰']},
 space:{name:'우주 · 지구 관측',text:'지구 전체와 한반도의 관측 환경, 정찰·통신위성 사업을 살펴봅니다. 위치·높이는 전시용이고 실제 궤도·실시간 위성 추적이 아닙니다.',steps:['지구','한반도 관측','위성 사업']},
 launch:{name:'우주 · 발사 기반',text:'나로우주센터 일대의 실제 위성 지도를 발사 장면 사진과 함께 관찰합니다. 누리호는 민간 우주 수송 기반입니다.',steps:['한반도','나로우주센터 일대','발사 사진']},
};
export function environmentFor(system){return system.id==='dosan'?'underwater':system.id==='kaav'?'coast':system.id==='nuri'?'launch':system.domains.includes('space')?'space':system.domains.includes('air')?'air':system.domains.includes('sea')?'sea':'land'}
