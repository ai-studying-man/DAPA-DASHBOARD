import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.QA_URL||'http://127.0.0.1:4173/',out=process.env.QA_OUT||'artifacts/3d/fleet/interactions';await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
try{
 const context=await browser.newContext({viewport:{width:375,height:900},hasTouch:true}),page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'?view=fleet&item=k9');await page.waitForSelector('[data-ready="true"]');
 const motion=[];
 for(const [id,clip]of [['k9','Turntable'],['k9','TurretTraverse'],['k9','BarrelElevation'],['425','ExplodedView'],['lah','RotorStudy'],['muav','PropellerStudy']]){
  await page.locator('[data-fleet-equipment]').selectOption(id);await page.waitForSelector('[data-ready="true"]');
  await page.locator('[data-studio-clip]').selectOption(clip);
  await page.locator('.studio-canvas').screenshot({path:`${out}/${clip}-rest.png`});
  await page.locator('[data-studio-play]').click();await page.waitForFunction(clip=>{const s=window.fleetQA.studio;return s.motion.mixer.existingAction(s.motion.clips.find(c=>c.name===clip)).time>.4},clip);
  await page.locator('.studio-canvas').screenshot({path:`${out}/${clip}-mid.png`});
  await page.locator('[data-studio-stop]').click();await page.locator('.studio-canvas').screenshot({path:`${out}/${clip}-settled.png`});motion.push(clip);
 }
 // Use the runtime's own object types to find a visible mesh pixel, then send native touch.
 await page.locator('[data-fleet-equipment]').selectOption('425');await page.waitForSelector('[data-ready="true"]');await page.locator('.studio-canvas').scrollIntoViewIfNeeded();
 const point=await page.evaluate(()=>{
  const s=window.fleetQA.studio,rect=s.renderer.domElement.getBoundingClientRect();
  const object=s.parts.Hull.children.find(x=>x.isMesh)||s.parts.Hull;
  const point=object.position.clone();object.getWorldPosition(point);point.project(s.camera);
  return{x:rect.x+(point.x+1)*rect.width/2,y:rect.y+(1-point.y)*rect.height/2};
 });
 await page.touchscreen.tap(point.x,point.y);assert.ok(await page.evaluate(()=>window.fleetQA.studio.selectedPart?.name),'Native touch selects a part');
 await page.locator('[data-studio-play]').click();await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>!window.fleetQA.studio.motion.active);assert.equal(await page.locator('[data-studio-play]').isDisabled(),true);await page.emulateMedia({reducedMotion:'no-preference'});
 await page.route('**/models/fleet/lah.glb',route=>route.fulfill({status:404,body:'missing'}));
 await page.locator('[data-fleet-equipment]').selectOption('lah');await page.locator('[data-studio-retry]').waitFor({state:'visible'});
 assert.equal(await page.locator('.mvp-reference img').count(),1);assert.equal(await page.locator('[data-studio-play]').isDisabled(),true);
 await page.screenshot({path:`${out}/fallback.png`,fullPage:true});await page.unroute('**/models/fleet/lah.glb');await page.locator('[data-studio-retry]').click();await page.waitForSelector('[data-ready="true"]');
 await page.locator('[data-fleet-equipment]').selectOption('k10');await page.waitForSelector('[data-ready="true"]');await page.locator('header a').click();await page.goBack();await page.waitForSelector('[data-ready="true"]');assert.equal(await page.locator('[data-fleet-equipment]').inputValue(),'k10');
 assert.deepEqual(errors,[]);await writeFile(`${out}/report.json`,JSON.stringify({motion,nativeTouch:true,reducedDuringPlayback:true,fallbackRetry:true,historyRestore:true,errors},null,2)+'\n');console.log('Fleet motion frames, touch, reduced motion, fallback/retry and history restore passed');
}finally{await browser.close()}
