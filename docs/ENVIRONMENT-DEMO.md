# 한반도 운용 환경 전시 v6

## 구현
- 한반도 지도에 Mapzen/Tilezen Terrain Tiles에서 가공한 고도 지형을 표시합니다. 기존 일정 높이의 해안선만 있던 지도에 산악·계곡의 고도 변화가 생깁니다.
- 장비 클릭은 운용 환경 탭으로 진입합니다. 실물 사진·공개 3D는 장비 외형 탭에서 그대로 확인합니다.
- 육군 지상 체계: 산악/평지 비교. FA-50·MUAV: 지형 위 공중 영역. 충남함: 수면. 도산안창호급: 수면을 투명하게 펼친 수중·해저 영역. KAAV: 연안의 해상·지상 연결. 위성: 설명용 우주 관측 영역.
- 환경 시연 재생은 8초간 이름이 붙은 중립 마커를 활동 영역에 따라 이동시키고 3단계 자막을 표시합니다. 중지·체계 전환·모달 닫기·탭 비활성에서 취소합니다. 모션 감소 설정에서는 정지 장면과 텍스트를 제공합니다.
- 잠수함 사례를 대표 체계·해군 목록·관계망·변천·수중 환경에 추가했습니다. 사진은 국방부 공개 도산안창호급 자료(공공누리 제1유형)이며 개별 함정 식별이나 잠항 영상이라고 표시하지 않습니다. 사업 정보는 방위사업청 2021-08-13 선도함 인도·취역 발표입니다.

## 데이터와 사용 조건
`public/data/terrain.json`: AWS 공개 Terrarium 18개 타일, 줌7, 33,971개 표본, 0.05도 간격. 경도124~132·위도33~43.5. Terrarium 공식 RGB 복호화 후 최근접 표본으로 가공하고 표시 시 보간합니다. 화면에서 수직 높이를 과장합니다. 원본 타일 URLs·접근일을 JSON에 기록합니다. `scripts/build-terrain.mjs`로 재생성할 수 있습니다.
- [AWS Terrain Tiles](https://registry.opendata.aws/terrain-tiles/)
- [Mapzen Terrarium 형식](https://www.mapzen.com/blog/terrain-tile-service/)
- [Tilezen 원 데이터 저작자·조건](https://github.com/tilezen/joerd/blob/master/docs/attribution.md), 동일 원문을 `/data/terrain-attribution.md`로 제공
- USGS SRTM/GMTED2010, NOAA ETOPO1 원자료 포함. 해당 지형은 정밀 현장 지형·항해·작전 계획에 사용할 수 없습니다.
- [잠수함 사진](https://commons.wikimedia.org/wiki/File:ROKS_Dosan_Ahn_Changho_class_submarine.png)
- [방위사업청 도산안창호함 취역 발표](https://www.dapa.go.kr/dapa/doc/selectDoc.do?bbsSeq=326&docSeq=13631&menuSeq=3069)

## 구현 범위
환경 지형은 로컬 데이터로 표시하며 외형 자산은 기존과 같이 인터넷이 필요합니다. 공개 Sketchfab 모델은 외부 iframe입니다. 동일 체계의 외형과 환경을 탭으로 연결했지만 외부 모델을 Three.js 지형 안에 삽입한 것이 아닙니다. 이동하는 것은 명시적으로 표시한 설명용 마커이며 실제 장비의 이동·비행·잠항 동작이나 성능·사거리·항로·배치 위치가 아닙니다. 실물 수준 장비 GLB/CAD 확보 및 해당 장비를 지형에 직접 통합하는 작업은 남아 있습니다.

지상 대표 경로도 임의 전시 예시이며 특정 장비가 해당 실제 지역에서 운용된다는 뜻이 아닙니다. 표시 수심·고도는 실측 운용 수치가 없습니다. 원 고도 표본의 해저는 광역 공개 데이터입니다. 역사적 기관 이름(2021 대우조선해양)은 당시 자료에 맞춰 현재 명칭 한화오션을 함께 안내합니다.
