# Service landscape replacement

`src/service-terrain.js` exports `createServiceLandscape(scene, branch)` and `serviceTerrainHeight(branch,x,z)`.

This is an authored procedural landscape inspired by Korean folded mountain ridges and irregular coastal transitions. It is NOT Korean DEM, satellite imagery, a particular base or surveyed coastline. No external geospatial assets were downloaded or reused. Its realism improvement is coherent continuous relief, a graded shoreline, terrain vertex-colour variation and distant forest clusters instead of floating large spheres.

Integration:
- Call once per branch; add returned Group to the existing disposable decor group (the helper initially attaches it to scene, reparenting is safe).
- Hide existing flat ground rendering (`ground.visible=false`); keep its ray-pick plane if current navigation is intentionally restricted to the flat clearing. Prefer `landscape.userData.walkSurface` for surface ray-picking.
- Remove the sphere hill loop and the old rectangular ocean patch; this module provides the terrain and coast. Keep pier/apron props separate.
- Central inland clearing radius28 is exactly y=0. Existing characters at x[-4,4],z8 and K2/K9 at x+-10,z-5 remain grounded.
- Coastal terrain drops toward negative z. Restrict visitor movement to safe land or sample `heightAt(x,z)`, and do not let people walk into water without a collision rule. Navy pier remains y=.65 and should be retained; keep navy navigation restricted to its bounds.
- `group.userData.heightAt(x,z)` returns authored terrain height, water level is -.2; no vehicle suspension or actual physical terrain response is supplied.
- Dispose returned Group geometries/materials with the existing deduplicated clear helper. Tree instances share geometry/material. One terrain ~51k triangles, one forest InstancedMesh (<=750 instances); water one plane. No textures/network dependencies.
