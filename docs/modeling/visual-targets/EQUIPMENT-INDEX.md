# 첨부 목록 기준 21종

첨부 명칭과 순서 보존. 기존 대시보드 23종은 유지한다. built-in image_gen으로 생성한 참고 후보이며 실측 도면·제조사 CAD·실제 촬영 자료가 아니다. 프롬프트와 검토 상태는 equipment-catalog.json에 보존했다.

|순서|장비|기준 이미지|3D 상태|
|---|---|---|---|
|1|500MD 헬리콥터|[이미지](equipment/500md-v1.png)|외형 MVP · 정밀 검증 전|
|2|AH-1S 코브라 공격헬기|[이미지](equipment/ah1s-v1.png)|외형 MVP · 정밀 검증 전|
|3|AH64E 아파치가디언 헬리콥터|[이미지](equipment/ah64e-v1.png)|외형 MVP · 정밀 검증 전|
|4|F-22 랩터(Raptor) 전투기|[이미지](equipment/f22-v1.png)|외형 MVP · 정밀 검증 전|
|5|F117 Nighthawk 나이트호크|[이미지](equipment/f117-v1.png)|외형 MVP · 정밀 검증 전|
|6|K1 응급구난전차|[이미지](equipment/k1arv-v1.png)|외형 MVP · 정밀 검증 전|
|7|K2 흑표(Black Panther)|[이미지](k2-coastal-target-v1.png)|사진 비교 보정 MVP|
|8|K9 천둥 자주포(Thunder)|[이미지](equipment/k9-v1.png)|사진 비교 보정 MVP|
|9|K10 화생방제독차(CBRN Decontamination Truck)|[이미지](equipment/k10cbrn-v1.png)|외형 MVP · 정밀 검증 전|
|10|K21 IFV 보병전투장갑차|[이미지](equipment/k21-v1.png)|외형 MVP · 정밀 검증 전|
|11|K-151 소형전술차량(Light Tactical Vehicle)|[이미지](equipment/k151-v1.png)|외형 MVP · 정밀 검증 전|
|12|K151 소형전술차량 with 현궁|[이미지](equipment/k151at-v1.png)|외형 MVP · 정밀 검증 전|
|13|K216 화생방정찰장갑차|[이미지](equipment/k216-v1.png)|외형 MVP · 정밀 검증 전|
|14|K242 4.2인치 자주박격포|[이미지](equipment/k242-v1.png)|외형 MVP · 정밀 검증 전|
|15|K332 화생방정찰차II|[이미지](equipment/k332-v1.png)|외형 MVP · 정밀 검증 전|
|16|KF21 보라매(Boramae)|[이미지](equipment/kf21-v1.png)|외형 MVP · 정밀 검증 전|
|17|KM9 화생방제독차(CBRN Decontamination Truck)|[이미지](equipment/km9-v1.png)|외형 MVP · 정밀 검증 전|
|18|KM181 60미리 박격포|[이미지](equipment/km181-v1.png)|외형 MVP · 정밀 검증 전|
|19|KM187 81미리 박격포|생성 필터로 보류|외형 MVP · 정밀 검증 전|
|20|KUH-1 수리온 헬리콥터|[이미지](equipment/surion-v1.png)|외형 MVP · 정밀 검증 전|
|21|UH-60P 블랙호크 헬리콥터|[이미지](equipment/uh60p-v1.png)|외형 MVP · 정밀 검증 전|

F-22·F-117은 해외 참고 체계다. K10 화생방제독차는 기존 K10 탄약운반장갑차와 합치지 않는다. K21은 첨부 썸네일이 아닌 보병전투장갑차 명칭으로 생성했다. 회전날개 잘림, 면별 형상 불일치, 현궁 장착형 발사관 등 검토 사항은 JSON에 기록했다. KM187은 안전 필터 거부 후 우회하지 않았으며 목록에는 유지했다.

Blender Reference 컬렉션은 이미지 기준판이며 장비 메시가 아니다. Model 컬렉션에서 실제 형상을 제작하고 비율·재질·시점 정합을 검증해야 한다. 이번 생성만으로 21종 실사 3D 완료를 주장하지 않는다.


최신 전체 연결 MVP: 웹앱 경로 `?view=equipment` · [Blender 21개 장면](../../../artifacts/3d/equipment-mvp/equipment-mvp.blend) · [구현 범위와 검사 결과](../../../artifacts/3d/equipment-mvp/README.md). 기존 Reference 작업 파일과 구분하며, 새 파일에는 21종 실제 메시와 20개 참고 이미지가 들어 있습니다.
