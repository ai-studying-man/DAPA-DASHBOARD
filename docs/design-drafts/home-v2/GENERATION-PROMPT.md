# 세로형 키오스크 메인 화면 PNG 수정안

제작일: 2026-10-14. Built-in image_gen으로 기존 PNG를 수정했습니다. 실제 동작하는 웹 화면이 아닌 디자인 시안입니다. 기존 가로형 초안은 보존했습니다.

반영: 우측 상단 기관 로고와 기관명, 두 줄 H1(K방산의 주역, / 방위사업청), 한 묶음 슬로건, 영상 하단 세계 9위 주요 무기 수출국과 집계 기간, 세로형 키오스크, 4개 언어와 하단 터치 탐색.

실제 구현: H1 안의 두 줄 제목, 하나의 슬로건 요소, CSS 세로 반응형 레이아웃과 영상 aspect-ratio:16/9, JS 탐색과 언어 선택, 제공 MP4의 무음 반복 재생으로 구성합니다. 로고는 공식 원본 파일을 삽입합니다.

## 제작 프롬프트

Edit the referenced welcome-screen PNG into a PORTRAIT KIOSK UI mockup. Output a tall 9:16 portrait canvas, approximately 1080x1920. Flat front-facing screen only, no physical kiosk bezel, no photograph of a monitor. Preserve the approved bright Toss-inspired white/light-grey background, dark charcoal typography, blue action color, rounded video and touch buttons. This is a static PNG design draft.

MANDATORY CHANGES:
1. Move the government emblem AND Korean agency wordmark '방위사업청' together to the TOP RIGHT corner as a compact header identity. Remove the old centered logo entirely. Keep 'K-방산 체험관' small at top left. Do not confuse the compact header identity with the main title.
2. The large H1 visually has EXACTLY TWO centered lines:
first line 'K방산의 주역,'
second line '방위사업청'
Preserve comma at end of first line. Second line is directly below, same bold large typography. Never put both on one line. Do not add literal H1 HTML text.
3. Directly beneath the H1 put the slogan as ONE coherent centered typographic group, two short lines with close spacing:
'우리 군을 더 강하게,'
'대한민국의 기술을 세계로.'
It should read as one unified subtitle, not separate unrelated cards.
4. Beneath this hero put the video player prominently. Video is LANDSCAPE 16:9 INSIDE this PORTRAIT screen. Use the same supplied satellite over Earth video still visible in the original reference. Full video window approximately 920x518 on a 1080-wide canvas, rounded corners. Do not stretch the video into portrait, do not use an ultrawide movie crop. Keep small label 'K-방산 이야기', pause and mute controls, '무음 · 반복 재생', and time '00:20 / 00:23'. No huge central play triangle as this is the playing state.
5. MOVE the ranking statement to BELOW THE VIDEO, never above it. Exact prominent text: '세계 9위 주요 무기 수출국'. Emphasize '세계 9위' blue, the remainder charcoal. Small source below exact text: 'SIPRI · 2021–2025 · 주요 재래식 무기 이전량 기준'. This is arms export ranking, not comprehensive military power rank.
6. Keep the four language options as large visible controls but place them BELOW the compact top header or in a dedicated lower utility row so they do not overlap the upper-right agency logo. Exact '한국어', 'English', '日本語', '中文', Korean selected blue tinted.
7. Bottom touch controls must suit a TALL public kiosk, large and reachable in the lower region. Primary full-width blue action '다음 · 무기체계 둘러보기' with arrow, and a row with muted disabled '이전', a '홈' house-icon button, and '01 / 03' with first of three dots active. Include the friendly helper '화면을 아래로 밀어도 이동할 수 있어요' and a downward chevron near the bottom above navigation.
Keep all content fully within the portrait frame, readable Hangul and Japanese and Chinese, no clipping or overlapping. Spacious balanced vertical rhythm but not huge empty gaps. Clear hero→video→rank→navigation hierarchy. Preserve all approved text and colors except the explicit rearrangements. No new statistics, no extra logos, no new weapon images or characters.
