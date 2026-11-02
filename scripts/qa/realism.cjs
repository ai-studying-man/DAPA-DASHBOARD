const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const base=process.env.QA_URL||'http://127.0.0.1:4173/';
const out='artifacts/3d/realism-audit';fs.mkdirSync(out,{recursive:true});
// Asset presentation smoke check. Passing this never certifies photorealism.
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
 const page=await browser.newPage(),errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  for(const size of [{width:1440,height:1000},{width:1080,height:1920},{width:390,height:844}]){
   await page.setViewportSize(size);
   for(const id of ['dosan','k9','k2','fa50','chunmoo','chungnam','muav','kaav','425','smallsat']){
    await page.goto(base+'?system='+id,{waitUntil:'domcontentloaded'});
    await page.locator('[data-demo-open]').click();await page.locator('[data-demo-mode="exterior"]').click();
    const host=page.locator('#demo-model-host');
    await host.locator('.model-studio,.equipment-visual').first().waitFor();
    const native=await host.locator('.model-studio').count();
    if(native)await host.locator('[data-ready="true"]').waitFor({timeout:30000});
    else if(await host.locator('img').count())await host.locator('img').evaluate(image=>image.decode());
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false,id);
    checks.push({id,size,native:Boolean(native),ready:await host.locator('[data-ready="true"]').count(),photorealismVerified:false,overflow});
    await page.screenshot({path:`${out}/${id}-${size.width}.png`});await page.locator('#demo-close').click();
   }
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(`${out}/report.json`,JSON.stringify({base,checks,errors,scope:'presentation smoke test, not a photorealism certificate'},null,2)+'\n');
  console.log(`${checks.length} asset/viewport presentation checks passed; photorealism remains unverified.`);
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
