# 한국 장비 3D 자산 확보 기록

확인일: 2026-10-12. 이 문서는 실제 다운로드와 공개 메타데이터 확인 결과를 기록한다. 검색에서 파일을 찾지 못했다는 것은 해당 자산이 존재하지 않는다는 뜻이 아니다.

## 확보 결과

현재 저장소의 `public/models/t80u.glb`는 T-80U이며 한국에서 개발한 장비의 외형을 대체하는 자산으로 사용할 수 없다. 이번 조사에서는 외부에서 배포 권한과 다운로드를 모두 확보한 한국 장비의 GLB/glTF 원본을 신규 확보하지 못했다. 이후 공개 사진을 참고한 별도의 원본 KAAV 전시 메시 `public/models/kaav-reference.glb`를 제작했다. 이 파일은 제조사 제공 모델이나 실측 복원이 아니다. 범위와 라이선스는 `public/models/kaav-reference-ATTRIBUTION.md`에 기록한다.

| 장비 | 확인한 자산 | 지도용 파일 확보 상태 |
| --- | --- | --- |
| K2 | [jjj0605의 K-2 Black Panther tank](https://sketchfab.com/3d-models/k-2-black-panther-tank-8f79997ad7e14deea07a5a60c8af5308), CC BY 4.0, 공개 API에서 다운로드 가능 표시 | 다운로드 API는 인증 필요. 로컬 파일 없음 |
| K9 | [Muhamad Mirza Arrafi의 K9 THUNDER ARTILLERY](https://sketchfab.com/3d-models/k9-thunder-artillery-dda88d1dc5b34f1e95507ae848642d8a), 공개 페이지에 CC Attribution 표시 | 로컬 파일 없음. 원저작권 출처 추가 확인 필요 |
| KAAV | [AAV7 상용 자산](https://www.3dcadbrowser.com/3d-model/aav7) 검색 결과 | 계정 필요, 원본 파일 재배포 금지. AAV7을 KAAV로 대체하지 않음 |
| KF-21 | [KF-21 unit 1 상용 자산](https://3dexport.com/3dmodel-kf-21-unit-1-548051.htm) | 구매/이용권 확보 전 사용하지 않음 |
| FA-50, 한국 함정, 425 위성 | 공개 검색 조사 | 재배포 가능한 다운로드 파일 미확보 |

K2의 공개 메타데이터: <https://api.sketchfab.com/v3/models/8f79997ad7e14deea07a5a60c8af5308>. `license.slug`은 `by`, `isDownloadable`은 `true`였다. 인증 없이 `/download`에 요청한 실제 응답은 HTTP 401, `Authentication credentials were not provided.`였다. 뷰어 캐시 추출 또는 인증 우회는 수행하지 않았다.

K9 원저작권 추가 확인의 근거: [Claude-of-Tanks 자산 기록](https://github.com/Kevin-Liu-01/Claude-of-Tanks/blob/main/docs/ATTRIBUTION.md)은 동일 게시자 계정의 일부 자산에 게임 추출 출처 문제가 있다고 기록한다. 이는 해당 K9 파일의 침해를 확정하는 증거가 아니며, 지도용 재배포 전 원저작자 확인이 필요하다는 조사 참고 사항이다. 별도로 검색된 [p3dm K9](https://p3dm.ru/files/auto/military_equipment/12196-k9-thunder.html)는 Wargame: Red Dragon에서 추출했다고 명시하고 Personal use only라고 표시하므로 사용하지 않았다.

## 실제 모델을 추가할 때 필요한 기록

장비별로 원저작자, 원본 페이지, 다운로드 권한, 웹 배포 허용 범위, 라이선스 사본, 파일 SHA-256, 단위/축 방향, 실제 외형 기준 자료를 함께 보관한다. 제조사 또는 구매 자산이라면 공개 웹 클라이언트가 파일을 받을 수 있는 방식의 배포가 허용되는지 확인한다. 로컬 파일 확보 전에는 실제 사진, 외부 3D 뷰어, 설명용 시점/경로를 구분해 표시한다. 사진 평면이나 임의 형상을 실제 장비의 3D 복원이라고 표현하지 않는다.

## 공식 자료 후속 조사

2026-10-12 후속 조사에서 KARI 누리호 공식 VR, Hanwha K9/REDBACK 공식 버츄얼 쇼룸, KAI FA-50 공식 조종석 계기 배치와 훈련체계 브로슈어를 확인했다. 상세 결과는 `docs/OFFICIAL-ASSET-RESEARCH-2026-10-12.md`, UI 연결용 공식 링크는 `src/official-resources.js`에 기록한다. 외부 공식 원문 열람 자료이며 제조사 CAD 또는 실측 승무원실 원본을 확보한 것은 아니다. 해당 사이트의 3D 런타임 자산이나 브로슈어 이미지는 공개 재배포 허가 미확인으로 추출하여 배포하지 않았다.
