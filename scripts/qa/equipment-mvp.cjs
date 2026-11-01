const {chromium}=require('playwright');const fs=require('node:fs');const assert=require('node:assert/strict');
(async()=>{
 const items=JSON.parse(fs.readFileSync('src/equipment-mvp.json'));
 const out='artifacts/3d/equipment-mvp/browser';fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage();const errors=[],checks=[];
 page.on('pageerror',error=>errors.push(error.message));
 try{
  for(const [width,height] of [[1440,1000],[390,844]]){
   await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:4181/?system=k2');
   const entry=page.locator('a[href="?view=equipment"]');
   if(!await entry.isVisible())await page.locator('#menu-toggle').click();
   await page.screenshot({path:`${out}/entry-${width}.png`,fullPage:true});
   await entry.click();
   await page.locator('#mvp-select option').first().waitFor({state:'attached'});
   assert.equal(await page.locator('#mvp-select option').count(),21);
   for(const item of items){
    await page.locator('#mvp-select').selectOption(item.id);
    await page.locator('#mvp-stage [data-ready=true]').waitFor({timeout:30000});
    if(item.image)await page.locator('#mvp-image img').evaluate(image=>image.decode());
    else assert.equal(await page.locator('#mvp-image img').count(),0);
    assert.equal(await page.locator('#app').getAttribute('data-selected'),item.id);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    for(const view of ['home','front','back','left','right','top']){
     await page.locator(`[data-studio-view=${view}]`).click();
     await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
     await page.locator('.mvp-model').screenshot({path:`${out}/${item.id}-${view}-${width}.png`});
    }
    await page.locator('[data-studio-view=home]').click();
    await page.locator('.studio-canvas').scrollIntoViewIfNeeded();
    await page.evaluate(()=>new Promise(resolve=>{let n=0;const frame=()=>++n<8?requestAnimationFrame(frame):resolve();requestAnimationFrame(frame)}));
    await page.screenshot({path:`${out}/${item.id}-page-${width}.png`,fullPage:true});
    checks.push({id:item.id,width,views:6,image:!!item.image});
   }
   await page.locator('#mvp-category').selectOption('foreign');assert.equal(await page.locator('#mvp-select option').count(),2);
   assert.match(await page.locator('#mvp-flags').textContent(),/해외 비교/);
  }
  assert.deepEqual(errors,[]);fs.writeFileSync(`${out}/report.json`,JSON.stringify({checks,errors},null,2));
  console.log('PASS: 21 equipment x 6 views x 2 sizes, image status and overseas filter');
 }catch(error){await page.screenshot({path:`${out}/failure.png`,fullPage:true});throw error}finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
