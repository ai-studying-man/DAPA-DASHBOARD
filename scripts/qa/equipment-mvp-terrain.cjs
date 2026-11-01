const {chromium}=require('playwright');const fs=require('node:fs');const assert=require('node:assert/strict');
(async()=>{
 const allItems=JSON.parse(fs.readFileSync('src/equipment-mvp.json'));
 const scope=process.env.QA_ITEMS?.split(',');
 const items=scope?allItems.filter(item=>scope.includes(item.id)):allItems;
 const out='artifacts/3d/equipment-mvp/terrain';fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage();const checks=[],errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/assets/terrain-experience-*.js',async route=>{const filename=new URL(route.request().url()).pathname.split('/').at(-1);const source=fs.readFileSync('dist/assets/'+filename,'utf8');await route.fulfill({status:200,contentType:'application/javascript',body:source.replace(/constructor\([^)]*\)\{/,'$&window.__terrainQA=this;')})});
 try{
  for(const [width,height] of [[1440,1000],[390,844]])for(const item of items){
   await page.setViewportSize({width,height});
   await page.goto(`http://127.0.0.1:4181/?experience=terrain&system=${item.id}`,{waitUntil:'domcontentloaded'});
   await page.locator('.terrain-experience[data-ready=true]').waitFor({timeout:60000});
   const placement=await page.evaluate(()=>{const e=window.__terrainQA,C=e.C;return {height:e.height,anchor:C.Cartographic.fromCartesian(e.anchor).height,model:e.root.dataset.modelUrl,ready:e.model.ready}});
   assert.ok(placement.ready);assert.ok(Math.abs(placement.anchor-placement.height-(item.altitude||0)-.1)<.02);
   const views=await page.locator('button[data-view]').evaluateAll(buttons=>buttons.map(button=>button.dataset.view));
   for(const view of views){
    await page.locator(`button[data-view=${view}]`).click();
    let tilesLoaded=true;try{await page.waitForFunction(()=>window.__terrainQA.viewer.scene.globe.tilesLoaded,{},{timeout:5000})}catch(error){if(error.name!=='TimeoutError')throw error;tilesLoaded=false}
    await page.screenshot({path:`${out}/${item.id}-${view}-${width}.png`,fullPage:true});
    checks.push({id:item.id,width,view,tilesLoaded});
   }
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   fs.writeFileSync(`${out}/checkpoint.json`,JSON.stringify({checks,errors},null,2));
  }
  assert.deepEqual(errors,[]);
  const previous=scope&&fs.existsSync(`${out}/report.json`)?JSON.parse(fs.readFileSync(`${out}/report.json`)).checks.filter(check=>!scope.includes(check.id)):[];
  fs.writeFileSync(`${out}/report.json`,JSON.stringify({checks:[...previous,...checks],errors},null,2));
  console.log(`PASS: ${items.length} terrain routes refreshed; ${previous.length+checks.length} total view checks retained`);
 }catch(error){fs.writeFileSync(`${out}/failure.json`,JSON.stringify({message:error.message,checks,errors},null,2));await page.screenshot({path:`${out}/failure.png`,fullPage:true});throw error}finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
