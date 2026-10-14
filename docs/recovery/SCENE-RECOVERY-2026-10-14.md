# Satellite scene recovery implementation

## State and scope
- `SceneWatch` records state on its owning host (`data-scene-state`): loading, ready, unavailable, initialization-failure, network-failure, load-timeout, context-lost.
- Each initialization and equipment selection has a 10-second visible loading budget. Exceeding the budget aborts the consumer and exposes deliberate retry, local introduction video, and dashboard return actions.
- Browser WebGL absence is distinct from a supported browser whose graphics initialization fails. Provider errors/offline state are network failures; GPU context loss disables the Cesium loop and cancels the camera sequence.
- The video fallback is existing `public/media/k-defense-story.mp4` with its actual local poster. It starts muted only after selecting video, has native controls, and explicitly identifies mixed footage/CG rather than 3D simulation.
- No timed automatic retries and no page reload. AtlasMap and EnvironmentViewer `retry()` recreate their own viewer and restore the selected equipment/environment. `onReady` allows application owners to reconnect state after initialization failed.
- Every disposed initialization/selection invalidates pending work. Late-created GLB models are destroyed, native listeners are removed, timers and fallback video stop. Underlying third-party metadata fetches may finish, but an aborted consumer cannot create a late Cesium viewer.
- Lighting, 1:1 elevation, terrain anchoring, model author/license, and exhibition-only position statements remain unchanged.

## Integration
- Main imports `src/scene-recovery.css`; no CSS imports from SSR shell modules.
- Locale source strings are translated by `translateText` and language-change events rebuild recovery text. Menu/guide localization remains owned by application locale controller.
- Failed AtlasMap instances must remain alive until the user retries or leaves; destroying them removes the actionable overlay.
- Atlas owner assigns `activeSystems`/`selectedId` before init and sets `onReady` to reconcile `mapReady`.
- Environment owner retains an instance before awaiting init. Its callback must avoid starting a second concurrent equipment load when retry already restores a remembered system.

## Evidence and limits
- `node --check` passed for scene-recovery.js, cesium-runtime.js, satellite-map.js, environment-viewer.js and model-viewer.js during implementation.
- Two build attempts reached Vite parsing, but were blocked by a concurrently incomplete i18n-ui.js write (EOF lines168 and200). The integration owner will run a final build after locale data is complete.
- Browser recovery interaction and device/GPU compatibility are not claimed by this report. Parent owns manual scene/offline/context-loss/video/return observations and final screenshots.
