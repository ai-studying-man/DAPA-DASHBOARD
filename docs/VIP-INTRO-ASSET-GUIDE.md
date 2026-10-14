# 인트로 영상·자막 교체 안내

## 현재 자료와 교체 위치

현재 영상은 사용자가 제공한 1920×1080, **23.5초** MP4다. 10초로 새 제작하거나 자른 최종본을 확보한 상태가 아니다. 영상에는 CGI/설명 장면이 포함되어 있으므로 전체를 실제 군 활동 촬영이라고 설명하지 않는다. 사용자 요청에 따른 구현 승인과 외부 행사·음악·CGI 사용권 증빙은 구분한다.

미디어 설정은 `src/intro-media.js`의 `introMedia` 객체 한 곳에서 바꾼다.

```js
export const introMedia = Object.freeze({
  src: './media/k-defense-story.mp4',
  poster: './media/k-defense-story-poster.png',
  subtitles: [],
  provenance: 'User-supplied 23.5-second MP4; replacement intro and translated subtitles pending.'
});
```

파일은 `public/media/`에 두고 Vite base에 대한 상대 URL을 쓴다. 새 이름으로 교체하면 위 src·poster를 함께 갱신한다. 기존 파일 이름을 유지한 교체도 가능하다. 권리자·원문·허가 범위·변경 이력은 `docs/vip-media-rights.json` 및 `public/media/KIOSK-ASSETS.md`를 함께 갱신한다. 기관 로고는 승인된 공식 원본과 사용 범위가 확인되면 교체한다.

## 미래 약 10초 인트로에 필요한 자료

- 최종 MP4와 정확한 길이, 포스터, 원 제작자, 영상·음악·CGI 출처 및 행사 상영/홍보/온라인 배포 범위.
- 화면의 실제 장비 활동과 CGI·전시 재구성을 구분하는 문구.
- 한국어 대본 확정 후 영어·일본어·중국어 번역과 원어민 검수 기록. 중국어 간체/번체 결정.
- 실기기에서 코덱·무음 자동재생·정지·음소거 해제·실패 대체를 확인한 기록.

10초 길이는 제안이다. 확보한 승인 영상의 길이를 확인하기 전 완료했다고 표시하지 않는다. 무음 자동재생을 기본으로 하고 음소거 해제는 명시적 사용자 조작으로만 실행한다.

## 실제 자막 파일을 확보한 뒤 등록

`subtitles`는 아래 형태의 배열을 지원한다. **예시 경로는 실제 파일 생성·대본 검수 전 등록하지 않는다.** 현재 빈 배열은 번역 자막이 없음을 정직하게 나타낸다.

```js
subtitles: [
  { src: './media/intro-ko.vtt', srclang: 'ko', label: '한국어' },
  { src: './media/intro-en.vtt', srclang: 'en', label: 'English' },
  { src: './media/intro-ja.vtt', srclang: 'ja', label: '日本語' },
  { src: './media/intro-zh-Hans.vtt', srclang: 'zh-Hans', label: '中文（简体）' }
]
```

VTT 작성 구조 예시다. 아래 대괄호 문구는 입력 자리이며 실제 영상의 발화나 확정 자막이 아니다. 이 예시를 그대로 제품에 넣지 않는다.

```vtt
WEBVTT

00:00:00.000 --> 00:00:03.000
[해당 구간의 검수된 실제 발화 또는 명시적으로 구분한 설명 자막]

00:00:03.000 --> 00:00:07.000
[장면과 대본에 맞춰 검수된 다음 문장]
```

자막은 실제 장면·발화 시점과 맞춘다. 전시 설명을 발화의 전사처럼 표시하거나 CGI 장면을 실사로 번역하지 않는다. 파일은 UTF-8로 저장하고 시간 구간은 실제 영상 길이를 넘지 않게 한다. 외국어 TTS 가용성과 MP4 번역 자막 제공은 별개다.
