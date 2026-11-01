const {chromium}=require('playwright');
const fs=require('node:fs');
(async()=>{
 const out='artifacts/3d/environment-assets/browser';fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage();const errors=[],results=[];
 page.on('pageerror',error=>errors.push(error.message));
 for(const [width,height] of [[1440,1000],[390,844]]){
  await page.setViewportSize({width,height});
  await page.goto('http://127.0.0.1:4181/?view=service');
  await page.waitForFunction(()=>document.querySelector('#service-status')?.textContent.startsWith('외형 보정'));
  for(const branch of ['army','navy','air','marine']){
   if(branch!=='army'){
    const response=page.waitForResponse(r=>r.url().includes(({navy:'dosan',air:'fa50',marine:'kaav'})[branch]+'-surface-refinement.glb')&&r.status()===200);
    await page.locator(`[data-branch=${branch}]`).click();await response;
    await page.waitForFunction(()=>document.querySelector('#service-status')?.textContent.startsWith('외형 보정'));
   }
   await page.locator('#vehicle-focus').evaluate(button=>{if(button.disabled||button.getAttribute('aria-pressed')!=='true')throw new Error('Exhibit focus unavailable')});
   await page.evaluate(()=>new Promise(resolve=>{let count=0;const frame=()=>++count<8?requestAnimationFrame(frame):resolve();requestAnimationFrame(frame)}));
   await page.locator('.service-stage').scrollIntoViewIfNeeded();
   await page.screenshot({path:`${out}/${branch}-${width}.png`,fullPage:true});
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   if(overflow)throw new Error('Horizontal overflow: '+branch+' '+width);
   results.push({branch,width,focus:true,overflow});
   if(branch==='army'){
    await page.locator('#exhibit-selection').selectOption('1');
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await page.screenshot({path:`${out}/k9-${width}.png`,fullPage:true});
   }
   if(['navy','air'].includes(branch)){
    const motion=page.getByRole('button',{name:'전시 경로 재생'});await motion.click();
    if(await motion.getAttribute('aria-pressed')!=='true')throw new Error('Motion unavailable');
    await page.evaluate(()=>new Promise(resolve=>{let n=0;const frame=()=>++n<15?requestAnimationFrame(frame):resolve();requestAnimationFrame(frame)}));
    await page.locator('.service-stage').scrollIntoViewIfNeeded();
    await page.screenshot({path:`${out}/${branch}-motion-${width}.png`,fullPage:true});
    results.push({branch,width,motion:true});
   }
  }
 }
 // Existing animated trial remains available through the comparison route.
 await page.goto('http://127.0.0.1:4181/?view=service&surface=legacy');
 await page.locator('#vehicle-drive:not([disabled])').waitFor();
 await page.locator('#vehicle-drive').click();
 if(await page.locator('#vehicle-drive').getAttribute('aria-pressed')!=='true')throw new Error('Legacy drive unavailable');
 await page.screenshot({path:`${out}/legacy-drive-390.png`,fullPage:true});
 fs.writeFileSync(`${out}/report.json`,JSON.stringify({results,errors,legacyDrive:true},null,2));
 await browser.close();if(errors.length)throw new Error(errors.join('\n'));
 console.log('PASS: eight branch/viewport views, equipment focus, legacy drive, no page errors');
})().catch(error=>{console.error(error);process.exitCode=1});
