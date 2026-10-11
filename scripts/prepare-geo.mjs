import fs from 'node:fs';
import crypto from 'node:crypto';

const raw = fs.readFileSync(process.argv[2], 'utf8');
const original = JSON.parse(raw);
const regionalNames = ['South Korea', 'North Korea', 'China', 'Japan', 'Taiwan', 'Russia'];
const features = original.features.map((feature) => {
  const name = feature.properties.name;
  const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
  const stride = name.includes('Korea') ? 3 : 24;
  const simplified = polygons.map((polygon) => polygon.map((ring) => {
    const points = ring.filter((_, index) => index % stride === 0);
    if (points.length < 3) return ring;
    points.push(points[0]);
    return points;
  }));
  return { name, polygons: simplified };
});
fs.mkdirSync('public/data', { recursive: true });
fs.writeFileSync('public/data/region.json', JSON.stringify(features.filter((f) => regionalNames.includes(f.name))));
fs.writeFileSync('public/data/world.json', JSON.stringify(features));
fs.writeFileSync('public/data/provenance.json', JSON.stringify({
  source: 'https://github.com/datasets/geo-countries',
  upstream: 'Natural Earth', license: 'Public domain / ODC PDDL',
  downloadedAt: '2026-10-08', sha256: crypto.createHash('sha256').update(raw).digest('hex'),
  processing: 'Ring subsampling; no surveyed terrain or precise administrative mapping. Regional Korean rings retain one in three vertices.',
}, null, 2));
console.log(`Prepared ${features.length} country geometries`);
