import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const browser=await chromium.launch({headless:true,
 ...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),
 args:['--no-sandbox','--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:375,height:812}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(process.env.QA_URL||'http://127.0.0.1:5173/');
 await page.evaluate(async()=>{
  const [{ModelViewer},{systems},{setLocale}]=await Promise.all([import('/src/model-viewer.js'),import('/src/data.js'),import('/src/i18n.js')]);
  const host=document.createElement('main');host.style.cssText='position:fixed;inset:0;overflow:auto;background:white;z-index:99999';document.body.append(host);
  window.modelQA={viewer:new ModelViewer(),host,systems,setLocale};
 });
 for(const id of ['k2','k9','kaav','fa50','dosan','nuri']){
  await page.evaluate(id=>{const q=window.modelQA;q.viewer.attach(q.host,q.systems.find(system=>system.id===id))},id);
  await page.waitForSelector('.model-studio[data-ready="true"]',{timeout:20000});
  const result=await page.evaluate(()=>{
   const q=window.modelQA,s=q.viewer.native;
   return {canvas:!!s.renderer.domElement,playDisabled:q.host.querySelector('[data-studio-play]').disabled,
    finite:s.camera.position.toArray().every(Number.isFinite),width:document.documentElement.scrollWidth};
  });
  assert.equal(result.canvas,true,id);assert.equal(result.finite,true,id);
  assert.equal(result.playDisabled,!['k2','k9'].includes(id),id);
  for(const view of ['front','back','left','right','top','home'])await page.locator(`[data-studio-view="${view}"]`).click();
  if(['k2','k9'].includes(id)){
   await page.locator('[data-studio-play]').click();
   await page.waitForFunction(()=>document.querySelector('[data-studio-range="gun"]').nextElementSibling.textContent!=='0°');
   assert.match(await page.locator('[data-studio-range="gun"] + output').innerText(),/^\d+°$/);
   await page.locator('[data-studio-stop]').click();
  }
  await page.locator('.studio-comparison summary').click();
  await page.waitForFunction(()=>{const img=document.querySelector('.studio-comparison img');return img.complete&&img.naturalWidth>0});
  console.log(`${id}: loaded, six views, capability controls, comparison photo OK`);
 }
 for(const locale of ['ko','en','ja','zh']){
  await page.evaluate(locale=>{const q=window.modelQA;q.setLocale(locale);q.viewer.attach(q.host,q.systems.find(s=>s.id==='k2'))},locale);
  await page.waitForSelector('.model-studio[data-ready="true"]');
  assert.equal(await page.locator('.model-studio').innerText().then(text=>text.includes('undefined')),false,locale);
 }
 await page.route('**/models/k9-exhibit.glb',route=>route.fulfill({status:404,body:'missing'}));
 await page.evaluate(()=>{const q=window.modelQA;q.viewer.attach(q.host,q.systems.find(s=>s.id==='k9'))});
 await page.locator('[data-studio-retry]').waitFor({state:'visible'});
 assert.equal(await page.locator('[data-studio-play]').isDisabled(),true);
 await page.unroute('**/models/k9-exhibit.glb');await page.locator('[data-studio-retry]').click();
 await page.waitForSelector('.model-studio[data-ready="true"]');
 await page.evaluate(()=>window.modelQA.viewer.destroy());
 assert.equal(await page.locator('.studio-canvas canvas').count(),0);
 assert.deepEqual(errors,[]);
 console.log('Four languages, missing model, retry, dispose, browser errors OK');
}finally{await browser.close()}
