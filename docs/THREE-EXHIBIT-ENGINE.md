# Three.js exhibit integration

Simulation now mounts the real Three.js runtime through `visitor-engine.js` → `visitor-stage.js` → `ModelStudio`. Blender-exported GLB mesh, UV and material maps are loaded using GLTFLoader, with OrbitControls, shadows, tone mapping and estimated exterior viewpoint. Keyboard/touch movement, reset and a visible target ring remain exhibition interactions, not validated flight/vehicle dynamics. UH-60P's existing MVP is playable but explicitly labelled an exterior draft, not a photoreal asset.

One toggle changes between the neutral Three.js exhibit studio and the existing actual Cesium satellite/elevation stage. There is no invented terrain posing as satellite data. Switching disposes the old renderer and guards stale lazy imports. The same model registry is used; no Higgsfield request or model promotion occurs. Nuri stays fixed in the satellite stage.

No proprietary military simulator engine was copied. The project already uses Three.js 0.180.0, an openly licensed engine. References: [Three.js MIT licence](https://github.com/mrdoob/three.js/blob/dev/LICENSE), [official GLTFLoader example](https://threejs.org/examples/webgl_loader_gltf.html). Source availability makes REA decompilation unnecessary for this engine.

REA skill was consulted. Browser target discovery found no debugging endpoint at 127.0.0.1:9222. An attempted whole local dist analysis was rejected by automatic review because it could transmit project code/assets externally. It was not executed and no alternative upload was used. This record does not claim REA extracted an external service or engine.

Validation: `npm run build`; `node scripts/qa/three-visitor.cjs`. Chrome captures and results: `artifacts/three-visitor/`. K9/UH-60P at 1440×1000 and 390×844, movement, reset, and Three.js→satellite→Three.js roundtrip. High-fidelity equipment geometry remains separate unfinished work; a renderer integration does not create accurate hidden geometry from an ImageGen picture.
