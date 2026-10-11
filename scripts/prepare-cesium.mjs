import { cp, mkdir } from 'node:fs/promises';

await mkdir('public/cesium', { recursive: true });
await cp('node_modules/cesium/Build/Cesium', 'public/cesium', { recursive: true });
