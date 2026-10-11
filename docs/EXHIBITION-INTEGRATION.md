# Main exhibition integration — 2026-10-12

## Implemented
- Main explorer and home story use CesiumJS with Esri World Imagery and ArcGIS Terrain3D, real coordinates, vertical exaggeration 1.
- 23 representative systems, six source-backed export countries. Export relations are geographic catalog arcs, not routes. Contract, delivery, and brochure supply cases remain distinct.
- Main equipment dialog places verified real photographs or external K2 3D viewer in the same viewport as satellite terrain. Imagery and exterior assets retain source/rights links.
- KAAV context uses Pohang east coast, offshore exhibition coordinate 129.426E, 36.06N. Camera tour has peninsula, environmental context, local observation.
- Space context uses Earth observation views. Exhibition satellite coordinates and altitude are illustrative, never actual orbit or live ephemeris. Nuri is labeled civilian space infrastructure.

## Four reconstructed exteriors
KAAV, FA-50, Dosan submarine, and Nuri now have locally authored GLB geometry attached directly to the satellite scene. Sources, dimensions and approximation limits are recorded alongside each model. KAAV hatch, FA-50 cockpit, and Dosan external bridge viewpoints are estimates, not verified interiors. Nuri is uncrewed civilian launch infrastructure. A static water shader is an exhibition effect, not live wave data.

## Asset boundary
Photographs are not 3D meshes. A public external viewer cannot be attached to a geographic model matrix. Manufacturer-authorized CAD or measured assets are necessary for terrain-anchored equipment, calibrated onboard positions, and verified interiors. See KOREAN-3D-ASSET-AVAILABILITY.md and catalog/README.md.

## Verification observed 2026-10-12
- Production build exits 0; JavaScript syntax and git diff whitespace checks pass.
- Catalog integrity: 23 systems, 26 source records, six countries, four local GLB models; all profile/source/event references resolve.
- Browser: KAAV coastal exterior and estimated hatch with arrow-key look; FA-50 satellite terrain exterior; Dosan surfaced hull after waterline correction; Nuri exterior at Naro exhibition coordinate; 15-second camera tour reaches completion; 425 unavailable exterior is explicitly shown.
- World export view reports six countries and 14 sourced events, globe and relation labels visible.
- 390px responsive DOM has document scroll width390 and dialog width358.4; default viewport restored.
- Browser error log empty during observed cases. Source maps/terrain remain dependent on external network services.
- LSP was unavailable and installation previously declined; no claim of LSP diagnostics coverage. Manufacturer CAD, verified interiors and all-system terrain meshes remain unavailable.
- Proof image: local ignored docs/evidence/air-exhibition.png.

