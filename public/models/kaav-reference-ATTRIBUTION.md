# KAAV 전시용 외형 재구성

`kaav-reference.glb`는 DAPA DASHBOARD 프로젝트에서 작성한 원본 형상이다. `scripts/create-kaav-model.mjs`에서 재생성한다. 모델과 생성 코드는 **CC BY-SA 2.0**으로 제공한다.

참고 사진: 대한민국 국군 Republic of Korea Armed Forces, 2010년 7월 7일 해병 1사단 KAAV 상륙훈련. [원본과 라이선스 기록](https://commons.wikimedia.org/wiki/File%3A2010.7.7%20%ED%95%B4%EB%B3%91%201%EC%82%AC%EB%8B%A8%20KAAV%ED%95%9C%EA%B5%AD%ED%98%95%EC%83%81%EB%A5%99%EB%8F%8C%EA%B2%A9%EC%9E%A5%EA%B0%91%EC%B0%A8%20%EC%83%81%EB%A5%99%ED%9B%88%EB%A0%A8%20(7445513192).jpg). 라이선스 [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/). 사진 자체는 `kaav-reference-photo.jpg`로 변경 없이 보관했다. 사진 픽셀을 모델 텍스처로 사용하지 않았다.

변경/작성: 관찰한 외형을 참고하여 별도 메시를 생성했다. 부양 차체, 경사진 선수, 파도막이, 앞쪽 편심 포탑, 편측 6개 전륜, 궤도 분절, 구동륜, 후부 승하차 램프, 워터제트 출구, 상부 해치, 흡기 그릴, 조명 보호대, 난간, 안테나를 전시용으로 재구성했다. 색은 단색의 절제된 올리브이며, 사진의 다색 위장 도장은 복원하지 않았다.

**제조사 CAD, 사진측량 스캔, 실물과 대조 검증한 디지털 트윈이 아니다.** 상세 부품과 비율은 사진에 근거한 추정이다. 승무원실 내부, 실제 조작계, 정확한 현가장치 동작, RCWS 개량형을 구현하지 않았다. 2010년 공개 사진의 KAAV 외관을 참고한 전시 모델이므로 최근 개량형을 대표한다고 표현하지 않는다.

단위: 미터. 축: Y 위, -Z 전방. 차체 하단 접지점을 Y=0으로 정규화했다. 실제 파일의 바운딩박스와 전시용 해치 시점은 `kaav-reference-metadata.json`에 기록한다. 시점은 장비 내부 실측 좌표가 아니다.

제조사 [Hanwha Defense 공식 브로슈어](https://hanwhaaerospace.com/assets/content/library/download/Hanwha%20Defense%20Brochure_EN.pdf)는 KAAV의 상륙 인원 수송 역할을 설명한다. 이번 조사에서 원문 PDF의 치수 표를 안정적으로 추출하지 못했으므로 이 모델의 치수를 제조사 공인 제원이라고 주장하지 않는다.

GLB SHA-256: `21157e1ebe67e1dce8a9963774358e1cb1b86947f78189b732be6ce01779d5da`. 재파싱 확인: 8개 메시, 23,480개 삼각형.

공식 KOTRA [2019 Korea Defense Products Guide](https://www.kotra.or.kr/kodits/upload_file/promotion/2019%20Korea%20Defense%20Products%20Guide.pdf)의 인쇄 페이지 23 KAAV 항목을 확인했다. 해당 항목은 육상/수상 운용 제원을 싣지만 전장·전폭·전고를 제공하지 않는다. 따라서 파일 바운딩박스는 생성한 메시의 크기만을 기록하며 실물의 공인 치수가 아니다.
