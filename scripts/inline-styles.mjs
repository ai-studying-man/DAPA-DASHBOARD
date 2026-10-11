import fs from 'node:fs';
import { resolve } from 'node:path';
import { shell } from '../src/shell.js';
const path = 'dist/index.html';
const html = fs.readFileSync(path, 'utf8');
const output = html.replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_, url) => `<style>${fs.readFileSync(resolve('dist', url.startsWith('/') ? url.slice(1) : url), 'utf8')}</style>`);
const boldFont = fs.readdirSync('dist/assets').find(name => /^noto-kr-700-.*\.woff2$/.test(name));
const ready = output.replace('</head>', `<link rel="preload" as="font" type="font/woff2" href="./assets/${boldFont}" crossorigin /></head>`);
fs.writeFileSync(path, ready.replace('<div id="app"></div>', '<div id="app">' + shell() + '</div>'));
