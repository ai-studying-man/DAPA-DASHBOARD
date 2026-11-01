const {chromium}=require('playwright');const fs=require('node:fs');const assert=require('node:assert/strict');
(async()=>{
 const out='artifacts/3d/ground-photo-refinement/dashboard';fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage();const checks=[];
 await page.route('**/assets/environment-viewer-*.js',async route=>{
  const response=await route.fetch(),source=await response.text();
  assert.ok(/async setSystem\([^)]*\)\{/.test(source));
  await route.fulfill({response,body:source.replace(/async setSystem\([^)]*\)\{/,'$&window.__environmentQA=this;')});
 });
 try{
  for(const width of [1440,390])for(const id of ['k2','k9']){
   await page.setViewportSize({width,height:width===390?844:1000});
   await page.goto(`http://127.0.0.1:4181/?system=${id}`,{waitUntil:'domcontentloaded'});
   await page.locator('[data-demo-open]').click();
   await page.locator('[data-demo-mode=environment]').click();
   await page.waitForFunction(()=>document.querySelector('#demo-play-status')?.textContent.includes('환경 준비 완료'),{},{timeout:90000});
   await page.locator('[data-scene-view=site]').click();
   const placement=await page.evaluate(async()=>{
    const e=window.__environmentQA,C=e.C,point=C.Cartographic.fromDegrees(...e.coords);
    await C.sampleTerrainMostDetailed(e.viewer.terrainProvider,[point]);
    return {sample:point.height,anchor:C.Cartographic.fromCartesian(e.anchor).height,modelReady:e.model.ready};
   });
   assert.ok(placement.modelReady);assert.ok(Math.abs(placement.sample-placement.anchor)<2);
   await page.screenshot({path:`${out}/${id}-${width}.png`,fullPage:true});checks.push({id,width,...placement});
  }
  fs.writeFileSync(`${out}/report.json`,JSON.stringify(checks,null,2));console.log('PASS: dashboard K2/K9 load and retain detailed terrain anchor at both widths');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
