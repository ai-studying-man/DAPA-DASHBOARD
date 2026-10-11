import fs from 'node:fs';
import { shell } from '../src/shell.js';
const path = 'dist/index.html';
const html = fs.readFileSync(path, 'utf8');
const output = html.replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_, url) => `<style>${fs.readFileSync('dist' + url, 'utf8')}</style>`);
const boldFont=fs.readdirSync('dist/assets').find(name=>/^noto-kr-700-.*.woff2$/.test(name));
const ready=output.replace('</head>', `<link rel="preload" as="font" type="font/woff2" href="/assets/${boldFont}" crossorigin /></head>`);
fs.writeFileSync(path, ready.replace('<div id="app"></div>', '<div id="app">' + shell() + '</div>'));
