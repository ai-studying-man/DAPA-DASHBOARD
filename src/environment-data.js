export const environments={
 land:{name:'지상 · 산악',text:'고도 자료의 산악·계곡 위로 지상 체계의 활동 환경을 살펴봅니다.',steps:['산악 지형 살펴보기','지형을 따르는 지상 이동 표시','체계의 역할과 참여기관 확인']},
 plain:{name:'지상 · 평지',text:'낮은 고도 지형에서 지상 플랫폼의 활동 환경을 비교합니다.',steps:['평지 지형 살펴보기','지표면을 따르는 이동 표시','산악 환경과 비교']},
 sea:{name:'해상 · 수면',text:'한반도 주변 바다의 수면에서 함정이 활동하는 환경입니다.',steps:['한반도와 주변 해역 살펴보기','수면 위 활동 환경 표시','함정의 공개 사업 확인']},
 underwater:{name:'해상 · 수중',text:'수면을 투명하게 펼쳐 해저 지형과 수중 활동 영역을 보여줍니다.',steps:['수면과 수중 영역 구분','해저 위 수중 이동 표시','잠수함의 공개 사업 확인']},
 air:{name:'공중 · 하늘',text:'한반도 지형 위에 공중 활동 영역을 구분합니다. 이동 표시는 비행 성능이나 실제 항로가 아닙니다.',steps:['지형과 공중 영역 구분','지형 위 공중 이동 표시','항공 체계의 공개 역할 확인']},
 coast:{name:'연안 · 해상에서 지상',text:'해병대 상륙돌격장갑차가 물과 육지를 오가는 활동 환경을 설명합니다.',steps:['바다와 해안 지형 살펴보기','해상·지상 환경 연결 표시','상륙 기동 체계의 역할 확인']},
 space:{name:'우주 · 관측 영역',text:'지형보다 높은 우주 관측 영역을 설명합니다. 표시 높이와 곡선은 실제 궤도가 아닙니다.',steps:['한반도와 우주 영역 구분','설명용 관측 영역 표시','위성 사업과 참여기관 확인']}
};
export function environmentFor(system){return system.id==='dosan'?'underwater':system.id==='kaav'?'coast':system.domains.includes('space')?'space':system.domains.includes('air')?'air':system.domains.includes('sea')?'sea':'land'}
