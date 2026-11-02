import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const url=process.env.QA_URL||'http://127.0.0.1:5173/';
const out='artifacts/3d/k2-pipeline';await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
const checks=[],errors=[];
try{
 const context=await browser.newContext({viewport:{width:375,height:812},hasTouch:true});
 const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
 await page.goto(url);
 await page.evaluate(async()=>{
  const [{ModelStudio},{k2Pipeline},{setLocale}]=await Promise.all([import('/src/model-studio.js'),import('/src/vehicle-models.js'),import('/src/i18n.js')]);
  document.querySelector('#app').replaceChildren();
  const host=document.createElement('main');document.querySelector('#app').append(host);
  const mount=()=>{window.k2QA.studio?.destroy();window.k2QA.studio=new ModelStudio(host,{id:'k2',name:'K2 흑표'},k2Pipeline,mount)};
  window.k2QA={host,mount,setLocale};mount();
 });
 await page.waitForSelector('.model-studio[data-ready="true"]');
 for(const clip of ['Turntable','TurretTraverse','BarrelElevation']){
  await page.locator('[data-studio-clip]').selectOption(clip);await page.locator('[data-studio-play]').click();
  await page.waitForFunction(clip=>{const m=window.k2QA.studio.motion;return m.mixer.existingAction(m.clips.find(c=>c.name===clip)).time>.3},clip);
  const moving=await page.evaluate(clip=>{const s=window.k2QA.studio;const object=clip==='Turntable'?s.root.getObjectByName('ExhibitRoot'):s.parts[clip==='TurretTraverse'?'Turret':'Gun'];return object.quaternion.toArray().some((v,i)=>i<3&&Math.abs(v)>.0001)},clip);
  assert.equal(moving,true,clip);await page.locator('[data-studio-stop]').click();
  assert.equal(await page.evaluate(()=>window.k2QA.studio.motion.active),false);
  checks.push({clip,moving});
 }
 for(const width of [375,768,1280]){
  await page.setViewportSize({width,height:900});
  for(const locale of ['ko','en','ja','zh']){
   await page.evaluate(locale=>{window.k2QA.setLocale(locale);window.k2QA.mount()},locale);
   await page.waitForSelector('.model-studio[data-ready="true"]');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${width}/${locale}`);
   await page.screenshot({path:`${out}/web-${width}-${locale}.png`,fullPage:true});
  }
  checks.push({width,locales:4,overflow:false});
 }
 await page.locator('[data-studio-option="quality"]').check();
 assert.deepEqual(await page.evaluate(()=>{const r=window.k2QA.studio.renderer;return[r.getPixelRatio(),r.shadowMap.enabled]}),[1,false]);
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.waitForFunction(()=>document.querySelector('[data-studio-play]').disabled);
 assert.equal(await page.locator('[data-studio-option="auto"]').isDisabled(),true);
 await page.screenshot({path:`out/reduced.png`.replace('out/',out+'/'),fullPage:true});
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.waitForFunction(()=>!document.querySelector('[data-studio-play]').disabled);
 await page.locator('[data-studio-part]').selectOption('Turret');
 assert.equal(await page.evaluate(()=>window.k2QA.studio.selectedPart.name),'Turret');
 // Project a real mesh point, then use a native tap to exercise Raycaster.
 await page.locator('.studio-canvas canvas').scrollIntoViewIfNeeded();
 await page.evaluate(()=>window.k2QA.studio.selectPart('all'));
 const rect=await page.locator('.studio-canvas canvas').boundingBox();
 const distance=()=>page.evaluate(()=>{const s=window.k2QA.studio;return s.camera.position.distanceTo(s.controls.target)});
 const beforePinch=await distance(),cdp=await context.newCDPSession(page);
 const fingers=spread=>[1,2].map((id,i)=>({id,x:rect.x+rect.width/2+(i?spread:-spread),y:rect.y+rect.height/2}));
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:fingers(35)});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:fingers(70)});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 assert.ok(await distance()<beforePinch,'Two-finger spread zooms in');
 assert.equal(await page.evaluate(()=>window.k2QA.studio.selectedPart),null,'Pinch must not select a part');
 await cdp.detach();
 const point=await page.evaluate(async()=>{
  const {Raycaster,Vector2}=await import('/node_modules/three/build/three.module.js');const s=window.k2QA.studio;
  s.selectPart('all');s.root.updateMatrixWorld(true);s.camera.updateMatrixWorld(true);
  const r=s.renderer.domElement.getBoundingClientRect(),ray=new Raycaster();
  for(let y=-.7;y<.8;y+=.05)for(let x=-.7;x<.8;x+=.05){
   ray.setFromCamera(new Vector2(x,y),s.camera);let object=ray.intersectObject(s.root,true)[0]?.object;
   while(object){const entry=Object.entries(s.parts).find(([,part])=>part===object);if(entry)return{x:r.left+(x+1)*r.width/2,y:r.top+(1-y)*r.height/2,expected:entry[0]};object=object.parent;}
  }
  throw new Error('No selectable mesh pixel');
 });
 await page.touchscreen.tap(point.x,point.y);
 assert.equal(await page.evaluate(()=>window.k2QA.studio.selectedPart?.name),point.expected,'Tap selects a real exterior group');
 await page.locator('.studio-comparison summary').click();
 await page.waitForFunction(()=>{const img=document.querySelector('.studio-comparison img');return img.complete&&img.naturalWidth>0});
 await page.route('**/models/k2-pipeline.glb',route=>route.fulfill({status:404,body:'missing'}));
 await page.evaluate(()=>window.k2QA.mount());await page.locator('[data-studio-retry]').waitFor({state:'visible'});
 assert.equal(await page.locator('[data-studio-play]').isDisabled(),true);
 await page.screenshot({path:`${out}/web-fallback.png`,fullPage:true});
 await page.unroute('**/models/k2-pipeline.glb');await page.locator('[data-studio-retry]').click();await page.waitForSelector('.model-studio[data-ready="true"]');
 await page.evaluate(()=>window.k2QA.studio.destroy());assert.equal(await page.locator('.studio-canvas canvas').count(),0);
 assert.deepEqual(errors,[]);
 await writeFile(`${out}/browser-report.json`,JSON.stringify({url,checks,errors,lowPower:true,reducedMotion:true,touchPicking:true,pinchZoom:true,fallbackRetry:true,disposed:true},null,2)+'\n');
 console.log('K2 clips, responsive locales, low power, reduced motion, touch picking, fallback/retry and disposal passed');
}finally{await browser.close()}
