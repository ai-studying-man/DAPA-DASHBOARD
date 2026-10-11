# 누리호 공개 자료 기반 전시용 외형

`nuri-reference.glb`와 `scripts/create-nuri-model.mjs`는 DAPA DASHBOARD 프로젝트에서 작성한 원본 형상이며 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)으로 제공한다. 외부 메시나 사진 픽셀 텍스처를 포함하지 않는다.

외형 참고: 한국항공우주연구원 KARI의 2021년 10월 21일 발사 사진. [사진 원본 및 사용권 기록](https://commons.wikimedia.org/wiki/File%3AKSLV-II%20Nuri%20Launch%202021-10-21.jpg), KOGL Type 1. 저장소의 `public/media/equipment/nuri.webp`는 별도 사진 자료이며 모델 텍스처가 아니다.

치수와 단계 구성: [KARI 발사체 개발 현황](https://www.kari.re.kr/eng/contents/176)은 누리호 총 길이 47.2m, 최대 직경 3.5m를 제공한다. [KARI 누리호 VR 전시 설명](https://www.kari.re.kr/vrshowroom/nuriho/index.html)에서 1단 75톤급 엔진 4개, 2단 고공 엔진, 3단 7톤급 엔진 및 페어링 구성을 확인했다. KARI 영어 누리호 상세 페이지 일부에는 직경 3.05m 표기도 있으나 동일 페이지 도해와 개발 현황 표가 3.5m를 제공하므로 최대 직경은 현황 표의 값을 사용했다.

모델은 3단 외형, 흰색 원통 차체, 테이퍼 연결부, 둥근 페어링, 하부 4개 노즐, 패널 이음매, 외부 배선 덮개, 접근 패널, 기하학으로 작성한 누리 표기 및 태극기 표시를 표현한다. 세부 단 길이, 상단 직경, 노즐 및 표기 위치는 공개 사진에 근거한 추정이다. 태극기와 글자도 미세한 실물 인쇄와 일치하는 복원이 아니다.

**제조사 CAD, 실측 디지털 트윈, 발사·공력·궤도 해석 또는 실제 엔진 동작 시뮬레이션이 아니다.** 누리호는 무인 민간 우주발사체이며 탑승 시점이 없다. 내부 엔진과 연료탱크를 관찰 가능한 실제 부품이라고 표시하지 않는다. 별도 발사 경로가 있다면 전시 설명용으로 표시한다.

좌표 단위 미터, Y 위, -Z 정면, 하단 Y=0. 실제 생성 파일의 바운딩박스는 `nuri-reference-metadata.json`에 기록한다.

검증: GLTFLoader 재파싱 성공, 26928개 삼각형. 외부 덮개 돌출을 포함한 모델 폭 약 3.564m이며, 본체 최대 직경 3.5m와 구분한다. GLB SHA-256: 9e722c958c5c125374f47cadf95877ab4c9b7c3b7003b90024124ba9de58b89c.
