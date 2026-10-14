# 전시·세미나 미디어 권리 기록

검토일: 2026-10-14. 구조화 원본: [vip-media-rights.json](vip-media-rights.json).

이번 작업은 출처와 사용 조건의 기록이다. 행사 승인·기관 인증·법률 검토 완료를 선언하지 않는다. 미디어 가공·다운로드·접근 제한·배포 설정 변경은 수행하지 않았다.

## 확인 범위와 상태

23개 체계 중 실제 equipmentAssets 항목은 19개다. 충남함·425사업·초소형위성체계·ANASIS-II는 체계 설명 데이터가 있지만 실물 사진/외부 모델 자산은 없다. 이를 확보한 자료로 집계하지 않는다. 전체 23행과 대표 4체계 사진/영상 8행, 사용자 MP4·포스터·로고·IBL 4행, 재구성 GLB 4개, 기존 T80U 1개로 총 40행이다. 중복 사진은 사용 경로별로 구분한다.

- **claimedMetadata**: 기존 저장소의 라이선스 주장 기록. 독립적인 권리자 승인 증빙과 다르다.
- **sourceVerified**: 이번 원문 확인과 과거 manifest 기록을 구분한다. HTTP200만으로 라이선스 본문 확인을 주장하지 않는다.
- **licensePolicyChecked**: 일반 라이선스 조건 원문 확인. 개별 파일의 올바른 라이선스 부여를 보증하지 않는다.
- **eventContextReview**: 실제 행사·홍보 문맥의 표장·인물·비후원·편집 검토는 대기다.
- **institutionApproval**: 기관 승인 증빙은 확보되지 않았다.

각 JSON 행은 출처 URL, 저자, 라이선스 표시, 의무 표시, 행사 상영, 홍보, 수정, 재배포, 확인 상태를 독립적으로 기록한다. 라이선스 조건부 가능은 행사 운영 승인 완료라는 뜻이 아니다.

## 원문에서 확인한 일반 조건

[CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)은 조건을 충족하는 공유·변경·상업 이용을 허용한다. 저자·원문·라이선스를 유지하고 해당 버전의 변경 표시 규칙을 따른다. 허락권자의 승인·후원을 암시하지 않는다.

[CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/)와 [한국판 2.0 KR](https://creativecommons.org/licenses/by-sa/2.0/kr/)은 공유하는 파생물에도 동일 조건을 요구한다. 사진 축소·WebP 변환 이력을 유지한다. 해당 사진의 조건을 웹앱 전체의 라이선스와 혼동하지 않는다.

[CC0](https://creativecommons.org/publicdomain/zero/1.0/)는 저작권상 이용 제약을 제거하지만 인물·상표·제3자 권리를 제거하지 않는다. [Poly Haven 자산 정책](https://polyhaven.com/license)도 확인했다. 조명 파일은 한국 지리 자료가 아니다.

[공공누리 제1유형](https://www.kogl.or.kr/info/licenseType1.do)은 출처 표시를 조건으로 온·오프라인·영리·변형 이용을 허용한다. 원문 링크와 저작인격권을 유지하고 공공기관의 후원·특수 관계를 암시하지 않는다. 기관 공개 자료라는 이유만으로 모든 파일에 제1유형을 적용하지 않는다.

[DVIDS 사용 조건](https://www.dvidshub.net/about/copyright)은 Public Domain 표시와 별개로 인물·제3자·군 표장 권리를 설명한다. 행사나 제품의 승인·후원을 암시하지 않으며 비후원 고지가 필요하다. 홍보·마케팅은 비영리 행사도 정책상 commercial use 범주에 포함될 수 있다. 표장과 사람의 등장 문맥은 별도 검토 대상이다. 이번 작업은 해당 영상을 가공하지 않았다.

FA-50 [개별 DVIDS 원문](https://www.dvidshub.net/video/1002229/fa-50-phs-conduct-flying-ops-during-cope-thunder-26-1)의 Public Domain 표시, 제작자 Staff Sgt. Jordan Garner와 이용 조건 링크를 새로 확인했다. KAAV 원문은 이번 web 열기에 실패하여 기존 2026-10-13 source-manifest만 근거로 기록한다.

## 행사 운영 전에 확보할 증빙

1. 사용자 MP4의 제작·음악·CGI 권리자 및 행사 상영·온라인 배포 허용 범위. 포스터도 같은 원 영상 권리에 종속한다.
2. Seeklogo 참고 로고를 기관 승인된 공식 원본으로 교체하거나 사용 범위 증빙 확보. 현재 파일은 기관 승인 자료로 표현하지 않는다.
3. DVIDS 비후원 고지와 인물·표장·행사 홍보 문맥 확인. 실제 활동 영상과 검증된 장비 성능을 구분한다.
4. 도산 영상은 공식 플레이어 연결이다. 공식 공개와 다운로드·편집·재배포 허가는 다르며 로컬 복제 허가를 확보했다고 표시하지 않는다.
5. 시연 집중 상태에서도 저자·원문·사용권에 접근할 수 있게 유지. GLB는 공개 자료 기반 전시 외형 재구성으로 표시한다.
6. Esri 위성·고도는 온라인 공급자 크레딧을 유지한다. 오프라인 패키지 재배포 권리는 이번 문서에서 승인하지 않는다.

## 개별 자산 목록

| ID | 자료 | 라이선스 표시 | 출처 |
|---|---|---|---|
| equipment:dosan | 도산안창호급 | 공공누리 제1유형 | [원문](https://commons.wikimedia.org/wiki/File:ROKS_Dosan_Ahn_Changho_class_submarine.png) |
| equipment:chungnam | 충남함 | 자산 없음 | 없음 |
| equipment:k2 | K2 | CC BY 4.0 | [원문](https://sketchfab.com/3d-models/k-2-black-panther-tank-8f79997ad7e14deea07a5a60c8af5308) |
| equipment:k9 | K9 | CC BY-SA 2.0 | [원문](https://commons.wikimedia.org/wiki/File%3AK-9%20%EC%9E%90%EC%A3%BC%ED%8F%AC%20(7445556056)%20(2).jpg) |
| equipment:chunmoo | 천무 | 공공누리 제1유형 | [원문](https://commons.wikimedia.org/wiki/File:K239_Chunmoo_Image1.jpg) |
| equipment:fa50 | FA-50 | CC BY 2.0 | [원문](https://commons.wikimedia.org/wiki/File:Light_Combat_FA-50_Fighting_Eagle.jpg) |
| equipment:muav | MUAV | KOGL Type 1 | [원문](https://commons.wikimedia.org/wiki/File%3AKorean%20Air%20KUS-FS%20MUAV.jpg) |
| equipment:kaav | 상륙돌격장갑차 | CC BY-SA 2.0 | [원문](https://commons.wikimedia.org/wiki/File%3A2010.7.7%20%ED%95%B4%EB%B3%91%201%EC%82%AC%EB%8B%A8%20KAAV%ED%95%9C%EA%B5%AD%ED%98%95%EC%83%81%EB%A5%99%EB%8F%8C%EA%B2%A9%EC%9E%A5%EA%B0%91%EC%B0%A8%20%EC%83%81%EB%A5%99%ED%9B%88%EB%A0%A8%20(7445513192).jpg) |
| equipment:425 | 425사업 | 자산 없음 | 없음 |
| equipment:smallsat | 초소형위성체계 | 자산 없음 | 없음 |
| equipment:k21 | K21 | CC BY-SA 2.0 | [원문](https://commons.wikimedia.org/wiki/File%3A2014.4.1%20%EC%9C%A1%EA%B5%B0%20%EC%88%98%EB%8F%84%EA%B8%B0%EA%B3%84%ED%99%94%EB%B3%B4%EB%B3%91%EC%82%AC%EB%8B%A8%20K-21%20%EC%9E%A5%EA%B0%91%EC%B0%A8%20%EC%82%AC%EA%B2%A9%EC%A7%91%EC%A4%91%ED%9B%88%EB%A0%A8%20Republic%20of%20Korea%20Army%20(13592630584).jpg) |
| equipment:k10 | K10 | CC BY-SA 2.0 kr | [원문](https://commons.wikimedia.org/wiki/File%3AK10%20ARV.jpg) |
| equipment:k808 | K808 백호 | KOGL Type 1 | [원문](https://commons.wikimedia.org/wiki/File%3AROKA%20K808%20APC%20river%20crossing%20training%20-%20March%202021.jpg) |
| equipment:redback | AS21 레드백 | CC0 | [원문](https://commons.wikimedia.org/wiki/File%3AHanwha%20AS21%20Redback%20Australian%20IFV.png) |
| equipment:kf21 | KF-21 보라매 | KOGL Type 1 | [원문](https://commons.wikimedia.org/wiki/File%3AKF-21%20Boramae%20First%20Production.jpg) |
| equipment:surion | KUH-1 수리온 | CC BY 2.0 | [원문](https://commons.wikimedia.org/wiki/File%3AKUH-1%20Surion%20Prototype%20in%20KAI.jpg) |
| equipment:lah | LAH | KOGL Type 1 | [원문](https://commons.wikimedia.org/wiki/File%3AKAI%20LAH-1%20Miron%20Armed%20Helicopter%20-%201.jpg) |
| equipment:t50 | T-50 골든이글 | CC BY 2.0 | [원문](https://commons.wikimedia.org/wiki/File%3AKAI%20T-50%20Golden%20Eagle%20-%2054277090749.jpg) |
| equipment:kt1 | KT-1 웅비 | CC BY-SA 2.0 | [원문](https://commons.wikimedia.org/wiki/File%3ADemonstration%20Flight%20of%20ROKAF%20New%20Light%20Trainer%20KT-1%20'Woongbi'.jpg) |
| equipment:nuri | 누리호 | KOGL Type 1 | [원문](https://commons.wikimedia.org/wiki/File%3AKSLV-II%20Nuri%20Launch%202021-10-21.jpg) |
| equipment:anasis | ANASIS-II | 자산 없음 | 없음 |
| equipment:cheongung | 천궁-II | KOGL Type 1 | [원문](https://commons.wikimedia.org/wiki/File%3AM-SAM%20Block-2%20battery.jpg) |
| equipment:hansando | 한산도함 | CC0 | [원문](https://commons.wikimedia.org/wiki/File%3AROKS%20Hansando%20Auckland%202025.jpg) |
| representative-photo:k2 | K2 흑표 대표 사진 | CC BY 3.0 | [원문](https://commons.wikimedia.org/wiki/File:K2_Black_Panther_20161106.jpg) |
| representative-video:k2 | K2 자세 제어 실제 시연 | CC BY 3.0 | [원문](https://commons.wikimedia.org/wiki/File:K2_Black_Panther_tank_demonstrating_the_posture_control_function_of_the_in-arm_suspension_unit_at_the_Gyeryong_Ground_Forces_Cultural_Festival_2016.webm) |
| representative-photo:dosan | 도산안창호급 대표 사진 | 공공누리 제1유형 | [원문](https://commons.wikimedia.org/wiki/File:ROKS_Dosan_Ahn_Changho_class_submarine.png) |
| representative-video:dosan | 도산안창호함의 태평양 대장정 | 공식 플레이어; 재배포 허가 미확인 | [원문](https://www.korea.kr/multi/mediaNewsView.do?newsId=148966667) |
| representative-photo:fa50 | FA-50 대표 사진 | CC BY 2.0 | [원문](https://commons.wikimedia.org/wiki/File:Light_Combat_FA-50_Fighting_Eagle.jpg) |
| representative-video:fa50 | FA-50PH 실제 비행 활동 | DVIDS Public Domain | [원문](https://www.dvidshub.net/video/1002229/fa-50-phs-conduct-flying-ops-during-cope-thunder-26-1) |
| representative-photo:kaav | KAAV 대표 사진 | CC BY-SA 2.0 | [원문](https://commons.wikimedia.org/wiki/File:2010.7.7_해병_1사단_KAAV한국형상륙돌격장갑차_상륙훈련_(7445513192).jpg) |
| representative-video:kaav | KAAV-7A1 해상에서 육상으로 | DVIDS Public Domain | [원문](https://www.dvidshub.net/video/1014028/b-roll-us-rok-marines-coordinate-kaav-ship-shore-movements) |
| intro:mp4 | 사용자 제공 영상 | 사용자 제공; 외부 권리 증빙 없음 | 없음 |
| intro:poster | 영상 20초 포스터 | 원 영상 권리 종속; 별도 확인 대기 | 없음 |
| identity:dapa-logo | 방위사업청 로고 참고 | 기관 사용 승인 미확인 | [원문](https://images.seeklogo.com/logo-png/47/1/defense-acquisition-program-administration-logo-png_seeklogo-473899.png) |
| lighting:kiara | Kiara 6 Afternoon | CC0 | [원문](https://polyhaven.com/a/kiara_6_afternoon) |
| model:kaav | kaav 외형 재구성 | CC BY-SA 2.0 | [원문](https://commons.wikimedia.org/wiki/File%3A2010.7.7%20%ED%95%B4%EB%B3%91%201%EC%82%AC%EB%8B%A8%20KAAV%ED%95%9C%EA%B5%AD%ED%98%95%EC%83%81%EB%A5%99%EB%8F%8C%EA%B2%A9%EC%9E%A5%EA%B0%91%EC%B0%A8%20%EC%83%81%EB%A5%99%ED%9B%88%EB%A0%A8%20(7445513192).jpg) |
| model:fa50 | fa50 외형 재구성 | CC BY 2.0 | [원문](https://commons.wikimedia.org/wiki/File:Light_Combat_FA-50_Fighting_Eagle.jpg) |
| model:dosan | dosan 외형 재구성 | CC BY 4.0 | [원문](https://commons.wikimedia.org/wiki/File:ROKS_Dosan_Ahn_Changho_class_submarine.png) |
| model:nuri | nuri 외형 재구성 | CC BY 4.0 | [원문](https://commons.wikimedia.org/wiki/File%3AKSLV-II%20Nuri%20Launch%202021-10-21.jpg) |
| model:t80u | T80U 기존 추가 모델 | CC BY 4.0 | [원문](https://sketchfab.com/3d-models/tank-t-80u-ebf4b55eeabb421cbf2758a2ec948439) |
