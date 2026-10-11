const org = (name, type, role, source) => ({ name, type, role, source });
export const extraSources = {
  dosan:{title:'국내 독자 설계·건조 도산안창호함 취역',publisher:'방위사업청',date:'2021-08-13',url:'https://www.dapa.go.kr/dapa/doc/selectDoc.do?bbsSeq=326&docSeq=13631&menuSeq=3069',locator:'인도·인수·취역식 및 당시 전력화 계획'},
  hanwha: { title:'K9·천무 공식 제품 소개', publisher:'한화에어로스페이스', date:'발행일 미표기 · 2026-10-08 확인', url:'https://www.hanwhaaerospace.com/kor/whatwedo/product/land.do?category=6', locator:'제품 목록: K9 자주포·천무 발사대' },
  kai: { title:'FA-50 공식 제품 소개', publisher:'한국항공우주산업(KAI)', date:'발행일 미표기 · 2026-10-08 확인', url:'https://m.koreaaero.com/EN/Business/FA50.aspx', locator:'FA-50 소개와 사천 본사 공개 주소' },
  kaiAvionics: { title:'T-50·FA-50 항공전자', publisher:'한화시스템', date:'발행일 미표기 · 2026-10-08 확인', url:'https://www.hanwhasystems.com/kr/business/defense/space/avonics03.do', locator:'고등훈련기·경공격기 사업 소개' },
  koreanAir: { title:'MUAV 양산 1호기 출고', publisher:'대한항공', date:'2026-04-08', url:'https://news.koreanair.com/대한항공-중고도-정찰용-무인항공기muav-1호기-출고/', locator:'체계종합·주요 구성품 통합·부산 출고식' },
  rotemSite: { title:'현대로템 국내 사업장', publisher:'현대로템', date:'발행일 미표기 · 2026-10-08 확인', url:'https://www.hyundai-rotem.co.kr/en/company/corporate/domestic/content.do', locator:'창원공장 공개 주소' },
};
export const profiles = {
  dosan:{role:'수중에서 활동하는 도산안창호급 잠수함입니다. 지상·공중 체계와 다른 수중 환경을 살펴보세요.',focus:'국내 독자 설계·건조 잠수함과 수중 환경',organizations:[org('대우조선해양 (현재 한화오션)','기업','2021년 선도함 건조·인도','dosan'),org('방위사업청','사업기관','인도·취역 공개 발표','dosan')]},
  k2: { role:'승무원을 보호하면서 지상에서 이동하는 전차입니다.', focus:'기동 플랫폼과 국내 제작 기술', organizations:[org('현대로템','기업','K2 제작·해외 계약','rotem'),org('방위사업청','사업기관','공개 수출 계약 발표','poland')] },
  k9: { role:'차량과 포가 하나로 결합된 자주포입니다. 지상에서 화력 지원 역할을 합니다.', focus:'이동형 화력 플랫폼', organizations:[org('한화에어로스페이스','기업','K9 제품 제작','hanwha'),org('방위사업청','사업기관','공개 계약 사례 발표','poland')] },
  chunmoo: { role:'여러 발사관을 차량에 탑재한 다연장로켓 체계입니다.', focus:'차량과 발사 장치의 결합', organizations:[org('한화에어로스페이스','기업','천무 제품 제작','hanwha'),org('방위사업청','사업기관','공개 계약 사례 발표','poland')] },
  chungnam: { role:'바다를 감시하고 해양 권익을 보호하는 해군 호위함입니다.', focus:'조선·탐지·전투체계의 통합', organizations:[org('HD현대중공업','기업','울산급 Batch-III 선도함 건조','navy'),org('방위사업청','사업기관','함정 인도 발표','navy')] },
  fa50: { role:'T-50을 바탕으로 발전한 경공격기입니다. 항공 기술과 임무 장비가 결합된 체계입니다.', focus:'기체와 항공전자 기술의 연결', organizations:[org('한국항공우주산업(KAI)','기업','FA-50 기체 사업','kai'),org('한화시스템','기업','T-50·FA-50 항공전자 사업','kaiAvionics')] },
  muav: { role:'조종사가 탑승하지 않고 지상 정보를 관찰하는 감시·정찰 항공기입니다.', focus:'비행체·센서·통신의 통합', organizations:[org('대한항공','기업','MUAV 체계종합·구성품 통합','koreanAir'),org('LIG D&A · 한화시스템','기업','주요 구성품 개발 참여','koreanAir'),org('국방과학연구소','연구기관','사업 협력 연구기관','koreanAir'),org('방위사업청','사업기관','출고식 주관','koreanAir')] },
  kaav: { role:'물과 육지를 오가며 이동하는 해병대 장갑차입니다. 공개된 RCWS 사업은 승무원이 차체 내부에서 장비를 원격 운용하도록 개선했습니다.', focus:'상륙 기동과 승무원 보호', organizations:[org('한화에어로스페이스','기업','상륙돌격장갑차 RCWS 사업 업체','marine'),org('방위사업청','사업기관','RCWS 전력화 발표','marine')] },
  '425': { role:'우주에서 지구를 관찰하는 군 정찰위성 사업입니다.', focus:'우주 관측 기술과 연구개발 협력', organizations:[org('한국항공우주연구원 · 국방과학연구소','연구기관','공개자료의 연구개발 협력','satellite'),org('방위사업청','사업기관','425사업 1호기 개발 성과 발표','satellite')] },
  smallsat: { role:'작은 위성들을 활용해 한반도와 주변 해역을 관찰하는 개발사업입니다. 국민 안전 분야 활용도 계획합니다.', focus:'국방·우주·해양 분야의 공동 활용', organizations:[org('국방과학연구소','연구기관','총괄연구기관','smallsat'),org('한국항공우주연구원 · 전자통신연구원 등','연구기관','공개된 연구 참여기관','smallsat'),org('방위사업청 · 우주항공청 · 해양경찰청','사업기관','다부처 협력사업','smallsat')] },
};
// City-level public industrial links, separate from the fictional exhibit placement.
export const regions = [
  {id:'sacheon',name:'경남 사천',theme:'항공 산업',coords:[128.07,35.0,0.56],systems:['fa50'],source:'kai',description:'KAI 공식 소개에 공개된 사천 본사와 항공기 사업을 연결했습니다.'},
  {id:'ulsan',name:'울산',theme:'함정 건조',coords:[129.31,35.54,0.56],systems:['chungnam'],source:'navy',description:'울산 HD현대중공업에서 열린 충남함 인도식 기록을 연결했습니다.'},
  {id:'changwon',name:'경남 창원',theme:'지상 체계 산업',coords:[128.68,35.23,0.56],systems:['k2'],source:'rotemSite',description:'현대로템의 공개 창원 사업장과 K2 제품 사업을 연결했습니다.'},
  {id:'busan',name:'부산',theme:'무인항공기 체계종합',coords:[129.08,35.18,0.56],systems:['muav'],source:'koreanAir',description:'부산 대한항공 테크센터의 MUAV 양산 1호기 출고식 기록입니다.'},
];
export const tourStops = ['k2','chungnam','fa50','kaav','smallsat'];
