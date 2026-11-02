import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const base=process.env.QA_URL||'http://127.0.0.1:4173/';
const out=process.env.QA_OUT||'artifacts/3d/k2-pipeline/production';await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
try{
 const checks=[];
 for(const width of [375,1280]){
  const page=await browser.newPage({viewport:{width,height:900},hasTouch:true});const errors=[],models=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().includes('k2-pipeline.glb'))models.push({url:r.url(),status:r.status()})});
  await page.goto(base+'?view=dashboard&system=k2&model=pipeline',{waitUntil:'domcontentloaded'});
  await page.locator('[data-demo-open]').click();await page.locator('[data-demo-mode="exterior"]').click();
  await page.locator('#demo-model-host [data-ready="true"]').waitFor({timeout:30000});
  const host=page.locator('#demo-model-host');
  assert.equal(await host.locator('[data-studio-clip] option').count(),3);
  await host.locator('[data-studio-clip]').selectOption('TurretTraverse');await host.locator('[data-studio-play]').click();
  const timing=await page.evaluate(()=>new Promise(resolve=>{const intervals=[];let prior=performance.now();function frame(now){intervals.push(now-prior);prior=now;if(intervals.length===60){const ordered=[...intervals].sort((a,b)=>a-b);resolve({frames:60,fps:60000/intervals.reduce((a,b)=>a+b,0),p95FrameMs:ordered[56]})}else requestAnimationFrame(frame)}requestAnimationFrame(frame)}));
  assert.equal(await host.locator('[data-studio-play]').getAttribute('aria-pressed'),'true');
  await page.screenshot({path:`${out}/controls-${width}.png`,fullPage:true});
  await host.locator('.studio-canvas').scrollIntoViewIfNeeded();
  await page.screenshot({path:`${out}/dashboard-${width}.png`,fullPage:true});
  await host.locator('[data-studio-stop]').click();
  assert.equal(await host.locator('[data-studio-play]').getAttribute('aria-pressed'),'false');
  await page.locator('#demo-close').click();await page.locator('#demo-model-host .studio-canvas canvas').waitFor({state:'detached'});
  assert.ok(models.some(m=>m.status===200),'Candidate GLB HTTP 200');assert.deepEqual(errors,[]);
  checks.push({width,models,timing,errors,opened:true,played:true,stopped:true,closed:true});await page.close();
 }
 const info=await browser.newPage();const response=await info.request.get(new URL('models/k2-pipeline.glb',base).href);assert.equal(response.status(),200);assert.equal((await response.body()).subarray(0,4).toString(),'glTF');
 await writeFile(`${out}/report.json`,JSON.stringify({base,checks,scope:'Chrome viewport emulation; not physical mobile GPU or deployment terrain validation'},null,2)+'\n');console.log(JSON.stringify({base,checks}));
}finally{await browser.close()}
