# 메인 화면 PNG 초안

제작일: 2026-10-14. Built-in image_gen으로 만든 디자인 참고 시안이며 실제 동작하는 웹 화면이 아닙니다.

영상: 사용자 제공 K-방산_동영상.mp4, 1920×1080, 23.5초. 영상의 20초 지점 프레임을 참고했습니다.

지표: SIPRI Trends in International Arms Transfers, 2025, 2021–2025 주요 무기 수출국 한국 9위. 군사력 종합 순위가 아닙니다.
원문: https://www.sipri.org/sites/default/files/2026-03/fs_2603_at_2025.pdf

로고 배치 참고: https://images.seeklogo.com/logo-png/47/1/defense-acquisition-program-administration-logo-png_seeklogo-473899.png
공식 MI 안내: https://www.dapa.go.kr/dapa/page/selectPage.do?menuSeq=3443&pageSeq=3504
PNG의 로고는 이미지 생성 참고 표현입니다. 실제 구현에서는 공식 원본 로고 파일을 직접 삽입합니다.

실제 구현: 이미지 전체를 웹 화면으로 붙이지 않고 HTML 구성 요소, CSS 반응형 배치/모션, JS 관람 이동/언어 선택, video muted autoplay loop playsinline과 일시정지/음소거 조작으로 구성합니다. 영상 비율은 CSS aspect-ratio:16/9로 정확히 고정합니다. PNG는 대략적인 시각 배치입니다.

## 생성 프롬프트

Create a polished high fidelity PNG UI MOCKUP, a complete single 16:9 landscape 1920x1080 welcome screen for a Korean defense acquisition museum kiosk. This is a design draft, not an actual running website. Bright Toss-inspired editorial web design: warm white #f7f8fa canvas, white surfaces, dark charcoal #191f28, muted grey #4e5968, blue #1b64da main action, spacious calm layout, crisp Noto Sans KR style Korean typography, gentle rounded corners, very subtle elevation. No device bezel, no perspective, no desk, no people, no military command-center HUD, no decorative cartoon illustrations. Render the flat UI front-on, fully within the image. Strong hierarchy, child-friendly large controls, few words, generous white space.

REFERENCE IMAGE 1 is the DAPA logo. Faithfully preserve its recognizable navy/red government emblem and Korean wordmark, do not redesign it. Place this logo centered under the headline, modestly sized but clearly readable. REFERENCE IMAGE 2 is an exact frame extracted from the user's supplied MP4. Use this actual satellite-over-Earth image as the still inside the video player; preserve composition and appearance, do not replace it with invented weapons or unrelated stock footage.

Layout: compact header along top with small 'K-방산 체험관' left; clear language chooser at top right: '한국어' selected blue tinted, then 'English', '日本語', '中文'. Centered main title, big bold 64px-like lettering, exact one line: 'K방산의 주역, 방위사업청'. Under it a short friendly sentence, exact: '우리 군을 더 강하게, 대한민국의 기술을 세계로.' Then centered original DAPA logo. Under logo a restrained single-line prestige statement with emphasized blue '세계 9위' and dark remainder '주요 무기 수출국'. Small precise source caption beneath: 'SIPRI · 2021–2025 · 주요 재래식 무기 이전량 기준'. Do not call this military strength ranking or a 4th-place achievement.

Below this intro show a substantial centered video player, approximate 780x439 dimensions with a strict 16:9 inner picture, rounded 24px corners, filled with reference image 2 (Earth horizon and satellite). This is the provided 23.5 second video. Top-left small label inside player 'K-방산 이야기'. Bottom-left accessible pause icon and sound-off icon, caption '무음 · 반복 재생'; bottom-right '00:20 / 00:23'. Use simple white SVG-like line icons over dark transparent scrim. Do NOT include a giant central play button because the video represents already playing.

At the bottom a clean fixed navigation area across the screen with large pill controls: left '이전' disabled muted and '홈' with house outline icon; center small scene indicator '01 / 03' and three small dots first blue; right a solid blue primary button exact text '다음 · 무기체계 둘러보기' with arrow-right icon. Include subtle short helper text '화면을 아래로 밀어도 이동할 수 있어요' with downward chevron near the intro/video gap or bottom where it fits. Everything must fit visibly, no cropped footer, no overlaps, readable Korean, Japanese and Chinese glyphs. No invented extra statistics, no cluttered card grids, no unrelated logos. Maintain a professional public exhibition feel with the visual softness and simplicity of a modern Korean consumer app.

## 후속 보정

기존 제목·로고·지표·하단 탐색을 유지하면서 영상 창을 좁혀 16:9 영상 배치를 위한 여백을 확보했습니다. 실제 웹 구현에서는 코드로 정확한 비율을 지정합니다.
