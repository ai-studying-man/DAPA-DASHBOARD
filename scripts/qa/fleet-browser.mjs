import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFile,mkdir,writeFile} from 'node:fs/promises';

const base=process.env.QA_URL||'http://127.0.0.1:4173/';
const out=process.env.QA_OUT||'artifacts/3d/fleet/qa';await mkdir(out,{recursive:true});
const entries=JSON.parse(await readFile('src/fleet-assets.json','utf8'));
const widths=process.env.QA_WIDTHS?process.env.QA_WIDTHS.split(',').map(Number):[375,768,1280];
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
const results=[],errors=[];
try{
 for(const width of widths){
  const context=await browser.newContext({viewport:{width,height:900},hasTouch:true});const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'?view=fleet&item=k2&lang=ko',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.model-studio[data-ready="true"]',{timeout:30000});
  assert.equal(await page.locator('[data-fleet-equipment] option').count(),39);
  for(const entry of entries){
   await page.evaluate(()=>{window.previousFleet=window.fleetQA.studio});
   await page.locator('[data-fleet-equipment]').selectOption(entry.id);
   await page.waitForSelector('.model-studio[data-ready="true"]',{timeout:30000});
   assert.equal(await page.evaluate(()=>window.previousFleet.disposed),true);
   assert.equal(await page.evaluate(()=>window.previousFleet.renderer.domElement.isConnected),false);
   assert.equal(await page.locator('[data-studio-clip] option').count(),entry.clips.length,entry.id);
   assert.equal(await page.locator('[data-studio-part] option').count(),entry.parts.length+1,entry.id);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false,entry.id+'/'+width);
   if(entry.referencePhoto)await page.locator('.mvp-reference img').evaluate(image=>image.decode());
   const motion=[];
   if(width===widths[0])for(const clip of entry.clips){
    await page.locator('[data-studio-clip]').selectOption(clip);
    await page.evaluate(()=>{window.transformBefore={};window.fleetQA.studio.root.traverse(o=>window.transformBefore[o.uuid]=[...o.position.toArray(),...o.quaternion.toArray()])});
    await page.locator('[data-studio-play]').click();
    await page.waitForFunction(clip=>{const s=window.fleetQA.studio;return s.motion.mixer.existingAction(s.motion.clips.find(c=>c.name===clip)).time>.18},clip);
    const changed=await page.evaluate(()=>{let changed=false;window.fleetQA.studio.root.traverse(o=>{const old=window.transformBefore[o.uuid],now=[...o.position.toArray(),...o.quaternion.toArray()];if(old&&now.some((v,i)=>Math.abs(v-old[i])>.00001))changed=true});return changed});
    assert.equal(changed,true,entry.id+'/'+clip);motion.push(clip);await page.locator('[data-studio-stop]').click();
   }
   if(entry.parts.length){await page.locator('[data-studio-part]').selectOption(entry.parts.at(-1));assert.equal(await page.evaluate(()=>window.fleetQA.studio.selectedPart?.name),entry.parts.at(-1));await page.locator('[data-studio-part]').selectOption('all')}
   await page.locator('.studio-canvas').scrollIntoViewIfNeeded();
   const timing=process.env.QA_FPS==='1'&&width===widths[0]?await page.evaluate(()=>new Promise(resolve=>{
    const studio=window.fleetQA.studio,draw=studio.draw,times=[];
    studio.draw=function(time){draw.call(studio,time);times.push(time);if(times.length===61){studio.draw=draw;const intervals=times.slice(1).map((t,i)=>t-times[i]).sort((a,b)=>a-b);resolve({renderedFrames:60,fps:60000/(times.at(-1)-times[0]),p95FrameMs:intervals[56]})}};
    studio.loop();
   })):null;
   await page.screenshot({path:`${out}/${entry.id}-${width}.png`,fullPage:true});
   results.push({id:entry.id,width,motion,parts:entry.parts.length,overflow:false,...(timing?{timing}:{})});
  }
  await page.locator('[data-studio-option="quality"]').check();
  assert.deepEqual(await page.evaluate(()=>{const r=window.fleetQA.studio.renderer;return[r.getPixelRatio(),r.shadowMap.enabled]}),[1,false]);
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('[data-studio-play]').disabled);
  await page.screenshot({path:`${out}/reduced-${width}.png`,fullPage:true});await page.emulateMedia({reducedMotion:'no-preference'});
  for(const locale of ['en','ja','zh']){
   await page.locator('[data-fleet-language]').selectOption(locale);await page.waitForSelector('[data-ready="true"]');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.screenshot({path:`${out}/locale-${locale}-${width}.png`,fullPage:true});
  }
  for(const domain of ['land','sea','air','space']){
   await page.locator('[data-fleet-filter]').selectOption(domain);await page.waitForSelector('[data-ready="true"]');
   assert.equal(await page.locator('[data-fleet-equipment] option').count(),entries.filter(x=>x.domain===domain).length);
  }
  await context.close();
 }
 assert.deepEqual(errors,[]);
 await writeFile(`${out}/report.json`,JSON.stringify({base,results,errors,allSystems:39,allClips:true,reducedMotion:true,lowPower:true,filters:true,locales:4,lifecycle:true},null,2)+'\n');
 console.log(JSON.stringify({systems:39,screens:results.length,clips:results.reduce((n,r)=>n+r.motion.length,0),errors}));
}finally{await browser.close()}
