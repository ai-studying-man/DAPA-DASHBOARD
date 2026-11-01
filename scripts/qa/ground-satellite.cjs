const {chromium}=require('playwright');
const fs=require('node:fs');const assert=require('node:assert/strict');
(async()=>{
 const out='artifacts/3d/ground-photo-refinement/browser';fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage();const errors=[],responses=[],checks=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('response',response=>{if(/arcgisonline|elevation3d/.test(response.url()))responses.push({url:response.url(),status:response.status()})});
 // QA-only access to the real scene instance. Production code has no test hook.
 await page.route('**/assets/terrain-experience-*.js',async route=>{
  const response=await route.fetch();const source=await response.text();
  assert.ok(/constructor\([^)]*\)\{/.test(source));
  await route.fulfill({response,body:source.replace(/constructor\([^)]*\)\{/,'$&window.__terrainQA=this;')});
 });
 try{
  for(const [width,height] of [[1440,1000],[390,844]]){
   await page.setViewportSize({width,height});
   for(const id of ['k2','k9']){
    const modelResponse=page.waitForResponse(r=>r.url().endsWith(`${id}-photo-refined.glb`)&&r.status()===200);
    await page.goto(`http://127.0.0.1:4181/?experience=terrain&system=${id}`,{waitUntil:'domcontentloaded'});
    await modelResponse;
    await page.locator('.terrain-experience[data-ready=true]').waitFor({timeout:90000});
    const placement=await page.evaluate(async()=>{
     const e=window.__terrainQA,C=e.C;
     const sample=C.Cartographic.fromDegrees(128.7063,37.6677);
     await C.sampleTerrainMostDetailed(e.viewer.terrainProvider,[sample]);
     const anchor=C.Cartographic.fromCartesian(C.Matrix4.getTranslation(e.model.modelMatrix,new C.Cartesian3()));
     return {terrain:sample.height,anchor:anchor.height,scale:e.model.scale,url:e.root.dataset.modelUrl,exaggeration:e.viewer.scene.verticalExaggeration};
    });
    fs.writeFileSync(`${out}/placement-${id}-${width}.json`,JSON.stringify(placement,null,2));
    assert.ok(Number.isFinite(placement.terrain));assert.ok(Math.abs(placement.anchor-placement.terrain)<2,JSON.stringify(placement));
    assert.equal(placement.scale,1);assert.equal(placement.exaggeration,1);
    checks.push({id,width,placement});
    for(const view of ['exterior','hatch','driver','region','peninsula']){
     await page.locator(`button[data-view=${view}]`).click();
     let tilesLoaded=true;
     try{await page.waitForFunction(()=>window.__terrainQA.viewer.scene.globe.tilesLoaded,{},{timeout:15000})}
     catch(error){if(error.name!=='TimeoutError')throw error;tilesLoaded=false;}
     checks.push({id,width,view,tilesLoaded});
     if(view==='exterior'){
      const framed=await page.evaluate(()=>{const e=window.__terrainQA,point=e.viewer.scene.cartesianToCanvasCoordinates(e.model.boundingSphere.center);return {x:point.x/e.viewer.canvas.clientWidth,y:point.y/e.viewer.canvas.clientHeight}});
      assert.ok(framed.x>.2&&framed.x<.8&&framed.y>.2&&framed.y<.7,JSON.stringify(framed));
     }
     await page.screenshot({path:`${out}/${id}-${view}-${width}.png`,fullPage:true});
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    }
    await page.locator('.terrain-information summary').click();
    await page.locator('.terrain-reference img').evaluate(image=>image.decode());
    await page.locator('.terrain-reference').screenshot({path:`${out}/${id}-reference-${width}.png`});
   }
  }
  assert.ok(responses.some(r=>/World_Imagery.*tile/.test(r.url)&&r.status===200));
  assert.ok(responses.some(r=>/Terrain3D/.test(r.url)&&r.status===200));
  assert.deepEqual(errors,[]);
  fs.writeFileSync(`${out}/report.json`,JSON.stringify({checks,errors,responses},null,2));
  console.log('PASS: K2/K9 actual satellite+elevation, 20 views, metre scale and terrain anchor');
 }catch(error){fs.writeFileSync(`${out}/failure.json`,JSON.stringify({message:error.message,checks,errors,responses},null,2));await page.screenshot({path:`${out}/failure.png`,fullPage:true});throw error}
 finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
