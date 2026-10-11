# 전시형 K-방산 ATLAS 조사와 구현

확인일: 2026-10-08. 공급업체의 공식 공개 설명을 참고했으며 고객 전용 제품·비공개 기능이나 방문객 사용성 시험 결과를 확인한 것은 아니다.

| 사례 | 공개 근거로 확인한 내용 | 이번 MVP 적용 |
| --- | --- | --- |
| [Inhance Aerospace](https://www.inhance.com/aerospace), [Innovation Centers](https://www.inhance.com/capabilities/ebc) | 항공우주·방산의 실시간 3D 인터랙티브 콘텐츠, L3Harris 혁신센터와 F-35 XR 등의 사례를 소개한다. | 체계를 먼저 고르는 홈, 개별 3D 보기, 기술과 참여기관 이야기 |
| [point2explore / Fuel180, Museum of Flight](https://point2explore.com/News/Case-Studies/3D-Touch-Screen-Interactive) | 우주왕복선 전시에 9개 3D 모델과 8개 투어, 27인치 터치 화면 및 70인치 연동 화면을 소개한다. | 드래그 가능한 설명용 모델, 다섯 단계 전시, 큰 자막, 가로·세로 반응형 화면 |
| [Saab Underwater Virtual Booth](https://www.saab.com/site-settings/html5/virtualbooth/index.html) | 공식 HTML5 가상 전시 페이지의 존재를 확인했다. 조사 도구에서는 JavaScript 실행이 필요해 세부 조작을 확인하지 못했다. | 웹 배포 가능 구조의 참고 사례. 세부 화면이나 기능을 복제했다는 주장은 하지 않는다. |
| [한화에어로스페이스 가상 쇼룸](https://m.hanwhaaerospace.com/kor/showroom.do) | 공식 검색 결과에서 쇼룸을 확인했다. 본문 접근이 실패해 실제 동작은 미검증이다. | 후속 전시 콘텐츠 협력 대상으로 검토 가능 |

## 적용한 방문객 동선

홈 → ‘군으로 찾기 / 환경으로 찾기’ → 체계 선택 → 쉬운 역할 설명 → 회전 가능한 3D 모형 → 기업·연구기관·사업기관과 원문 링크. 홈의 ‘음성 전시 시작’은 육군·해군·공군·해병대·우주 다섯 이야기를 큰 자막과 함께 보여준다. 자동 넘김은 관람객이 체크했을 때만 실행한다. 체계 변경·검색·닫기는 음성을 취소한다.

공개 산업 거점은 사천(KAI), 울산(충남함 인도), 창원(현대로템 사업장), 부산(MUAV 출고) 네 도시만 연결했다. 도시 좌표는 탐색용이며 개별 공장 좌표나 실제 배치가 아니다. 3D 지도의 체계 위치도 설명용이다. 전체 전국 방산사업과 세계 수출을 망라한 지도라고 표시하지 않는다.

## 기술과 오픈소스

- [Three.js](https://github.com/mrdoob/three.js): 현재 지도와 회전 모델의 실시간 3D 렌더링. MIT.
- [Vite](https://github.com/vitejs/vite): HTML·CSS·JavaScript 빌드. MIT.
- [Noto Sans KR](https://github.com/notofonts/noto-cjk): 로컬 한국어 글꼴. OFL.
- [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/): 지도 경계 데이터. public domain. 처리 기록은 public/data/provenance.json.
- [CesiumJS](https://github.com/CesiumGS/cesium): 실제 고도 지형과 지구 규모 공간 표현이 필요할 때의 후속 후보. 현재 설치·적용하지 않았다.

음성은 브라우저 Web Speech API와 기기에 설치된 한국어 음성을 사용한다. 오픈소스 음성 모델을 탑재한 것은 아니다. 전시장 음질·브라우저 간 일관성이 필요하면 검수한 사전 녹음 파일을 추가하는 단계가 필요하다.

현재 3D 모델은 직접 작성한 절차적 설명용 모형이다. 제조사 CAD, 실물 수준 모델 또는 실제 성능 시뮬레이션이 아니다. 공개·사용 허가를 받은 glTF 모델을 확보하면 동일 ModelViewer에 연결하는 후속 개발이 가능하다. 현장용 완성도에는 모델 라이선스, 음향, 장시간 운전, GPU 성능, 실물 키오스크 터치 검증이 남아 있다.
