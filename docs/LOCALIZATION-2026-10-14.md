# Exhibition localization

Implemented locales: Korean `ko-KR`, English `en-US`, Japanese `ja-JP`, and Simplified Chinese `zh-CN`. The final Chinese writing-system choice and professional native-speaker review remain pending.

`src/i18n-ui.js` and `src/i18n-equipment.js` manage original Korean phrases and their three translations. `src/i18n.js` translates dynamic vanilla DOM text and accessible labels, titles, placeholders, and alternative text while preserving form values, identifiers, source URLs and selected equipment. It remembers originals so switching languages is reversible. Caption components with their own locale resources use `data-no-translate`.

Language choice is saved in browser localStorage under versioned key `dapa-exhibit-locale-v1`. It survives dashboard entry, reload and browser restart on the same origin and profile. Clearing browser storage resets to Korean. When storage is blocked, the choice lasts for the session. Unknown stored values are ignored. No visitor data is sent to a translation service.

Native speech uses only a matching language voice. Changing locale cancels the previous narration and component tour. When no matching voice exists, translated captions remain available and a translated status explains the limitation. Actual installed voices and audible playback require testing on the exhibition device.

Proper names, equipment codes, original publication titles, quoted credits and license identifiers may remain in their source language. Translation does not authorize media use or certify operational performance.

Implementation and resource audit are distinct from professional translation approval. Remaining copy discovered by the runtime can be retrieved through `untranslatedCopy()` during development; no completeness claim should be made before reviewing actual rendered states.

## Resource audit

Equipment resources contain 285 exact-source entries covering all 23 equipment records, organization roles, source annotations, regional descriptions and equipment media disclosures. Every entry contains English, Japanese and Simplified Chinese. A recursive audit of current systems, profiles, sources and regions found no missing Korean content strings; source URL paths are intentionally preserved. This checks resource presence, not native-speaker accuracy or rendered interface completeness.

Unmatched prose is retained intact and reported for review; partial word replacement is never returned as a mixed-language sentence. Numeric caption templates and complete source phrases are translated separately. Browser-selected branch option values are frozen before their visible labels change, and searching accepts equipment terms in all four languages.

Final resource count: 591 interface phrases + 285 equipment/provenance phrases. Rendering the shell and every one of the 23 detail, relationship and timeline pages in English, Japanese and Simplified Chinese found zero untranslated Korean phrases after applying resources, except the intentionally native `한국어` language-selection label. See `LOCALIZATION-RESOURCE-AUDIT-2026-10-14.json`. This is a source-render audit; interactive browser states and exhibition hardware remain separate verification.
