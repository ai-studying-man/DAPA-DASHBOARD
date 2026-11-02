import {chromium} from 'playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {PNG} from 'pngjs';
import assert from 'node:assert/strict';

const url=process.env.QA_URL||'http://127.0.0.1:5174/';
const out='artifacts/3d/k2-pipeline';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}});await page.goto(url);
 await page.evaluate(async()=>{
  const [{ModelStudio},{k2Pipeline}]=await Promise.all([import('/src/model-studio.js'),import('/src/vehicle-models.js')]);
  document.querySelector('#app').replaceChildren();const host=document.createElement('main');document.querySelector('#app').append(host);
  window.renderK2=(model)=>{window.comparison?.destroy();window.comparison=new ModelStudio(host,{id:'k2',name:'K2'},{...k2Pipeline,model},()=>{})};
 });
 for(const [name,model]of [['before','./artifacts/3d/k2-pipeline/normalized.glb'],['after','./models/k2-pipeline.glb']]){
  await page.evaluate(model=>window.renderK2(model),model);await page.waitForSelector('[data-ready="true"]');
  await page.evaluate(()=>{const s=window.comparison;s.renderer.setAnimationLoop(null);s.draw(performance.now())});
  await page.locator('.studio-canvas').screenshot({path:`${out}/optimization-${name}.png`});
 }
 const before=PNG.sync.read(await readFile(`${out}/optimization-before.png`)),after=PNG.sync.read(await readFile(`${out}/optimization-after.png`));
 assert.equal(before.width,after.width);assert.equal(before.height,after.height);
 let changed=0;for(let i=0;i<before.data.length;i+=4)if([0,1,2].some(c=>Math.abs(before.data[i+c]-after.data[i+c])>2))changed++;
 const diffRatio=changed/(before.width*before.height);assert.ok(diffRatio<.001,`Optimization changed render: ${diffRatio}`);
 await writeFile(`${out}/render-comparison.json`,JSON.stringify({width:before.width,height:before.height,changedPixels:changed,diffRatio,tolerance:2},null,2)+'\n');
 const data=async(path,mime)=>`data:${mime};base64,${(await readFile(path)).toString('base64')}`;
 const photo=await data('public/media/representatives/k2.jpg','image/jpeg'),render=await data(`${out}/three-quarter.png`,'image/png');
 await page.setViewportSize({width:1280,height:640});
 await page.setContent(`<html lang="ko"><meta charset="utf-8"><style>body{margin:0;padding:24px;font:16px/1.6 sans-serif;background:#fff;color:#182433}h1{font-size:24px}main{display:grid;grid-template-columns:1fr 1fr;gap:24px}figure{margin:0}img{width:100%;height:380px;object-fit:contain;background:#f2f4f6}figcaption{font-weight:bold}footer{font-size:12px}</style><h1>K2 실사 참고 ↔ Blender 검토 후보 · 형상 정합 미완료</h1><main><figure><img src="${photo}"><figcaption>공개 실사 · 위장망으로 가려진 면은 검증 불가</figcaption></figure><figure><img src="${render}"><figcaption>실제 Cycles 렌더 · 독립 제작 PBR / 실사화 미완료</figcaption></figure></main><footer>KBS VIEW–theDEEP / CC BY 3.0 · commons.wikimedia.org/wiki/File:K2_Black_Panther_20161106.jpg<br>비교 사진은 축소 표시. 모델: DAPA DASHBOARD / CC BY 3.0. 미관측 면·패턴·형상은 추정. 같은 카메라로 정합한 실측 비교가 아닙니다.</footer></html>`);
 await page.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
 await page.screenshot({path:`${out}/reference-comparison.png`});
 const docs='docs/modeling/k2/pipeline';await mkdir(docs,{recursive:true});
 for(const name of ['front','side','three-quarter','reference-comparison','optimization-before','optimization-after'])await writeFile(`${docs}/${name}.png`,await readFile(`${out}/${name}.png`));
 console.log(JSON.stringify({diffRatio,evidence:docs}));
}finally{await browser.close()}
