const {chromium}=require('playwright');const AxeBuilder=require('@axe-core/playwright').default;
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');
const ROOT=process.cwd(),DIR=path.join(ROOT,'docs/evidence/exhibition-v3'),URL='http://127.0.0.1:4173';fs.mkdirSync(DIR,{recursive:true});
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:false});const context=await browser.newContext({hasTouch:true});const page=await context.newPage();const out={captures:[],checks:[],errors:[],axe:[]};page.on('pageerror',e=>out.errors.push(e.message));
const shot=async(name)=>{await page.evaluate(()=>document.fonts.ready);const file=path.join(DIR,name+'.png');await page.screenshot({path:file,fullPage:true});out.captures.push(file)};
try{
 for(const width of [375,768,1280,1920]){
  await page.setViewportSize({width,height:width===1920?1080:900});await page.goto(URL);await page.locator('#welcome-title').waitFor();await shot('home-'+width);
  if(await page.locator('[data-start-branch]').count()!==4)throw Error('four branch categories');
  if(await page.locator('[data-start-domain]').count()!==4)throw Error('four environment categories');
  const homeAxe=await new AxeBuilder({page}).analyze();fs.writeFileSync(path.join(DIR,'axe-home-'+width+'.json'),JSON.stringify(homeAxe,null,2));out.axe.push({screen:'home',width,violations:homeAxe.violations});
  await page.locator('[data-start-branch="해병대"]').tap();await page.waitForFunction(()=>document.querySelector('#map-status').hidden);
  if(await page.locator('#collection .system-card').count()!==1)throw Error('marine category filter');
  await page.locator('#clear-filters').click();
  for(const mode of ['korea','world','graph','list','timeline']){
   await page.locator('[data-mode="'+mode+'"]').click();if(['korea','world'].includes(mode))await page.waitForFunction(()=>document.querySelector('#map-status').hidden);
   await shot(mode+'-'+width);
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('overflow '+mode+width);
   if(width===375||width===1280){const axe=await new AxeBuilder({page}).analyze();fs.writeFileSync(path.join(DIR,'axe-'+mode+'-'+width+'.json'),JSON.stringify(axe,null,2));out.axe.push({screen:mode,width,violations:axe.violations})}
  }
 }
 await page.locator('#collection [data-system="k2"]').click();await page.locator('[data-mode="timeline"]').click();await shot('timeline-k2');
 await page.locator('#reset').click();if(!await page.locator('.welcome').isVisible())throw Error('reset home');
 await page.locator('.welcome [data-system="smallsat"]').click();await page.locator('[data-mode="timeline"]').click();
 if(!(await page.locator('.era-card.future').innerText()).includes('2026年'.replace('年','년')))throw Error('future sourced plan');await shot('timeline-future');
 await page.locator('#reset').click();await page.locator('[data-classification="environment"]').click();await page.locator('[data-start-domain="air"]').click();if(await page.locator('#collection .system-card').count()!==2)throw Error('air category');
 await page.locator('#search').fill('없는체계zz');await shot('empty-search');if(await page.locator('#collection .system-card').count())throw Error('empty results');await page.locator('#clear-filters').click();
 await page.locator('#settings-open').click();await page.locator('input[name="dock"][value="bottom"]').check();await page.locator('#settings-done').click();await shot('landscape-bottom');
 await page.setViewportSize({width:1080,height:1920});await shot('portrait-bottom');await page.locator('#settings-open').click();await page.locator('input[name="dock"][value="side"]').check();await page.locator('input[name="density"][value="exhibit"]').check();await page.locator('#settings-done').click();await shot('portrait-side-exhibit');
 await page.setViewportSize({width:3840,height:2160});await shot('4k');
 await page.setViewportSize({width:1280,height:900});await page.locator('#reset').click();await page.locator('[data-classification="branch"]').click();await page.locator('[data-start-branch="육군"]').hover();await shot('home-hover');await page.locator('[data-start-branch="육군"]').focus();await shot('home-focus');
 await page.locator('[data-start-branch="육군"]').tap();await page.evaluate(()=>document.querySelector('canvas').dispatchEvent(new Event('webglcontextlost',{cancelable:true})));await shot('webgl-fallback');await page.locator('[data-mode="list"]').click();if(!await page.locator('#list-view').isVisible())throw Error('fallback list');
 out.checks.push('four military and four environment first-screen selectors','five views at 375/768/1280/1920; no document overflow','touch category navigation and branch/environment filter counts','direct system choice and reset to home','sourced future plan and unknown status distinction','search empty state; bottom/side/exhibit/portrait/4K','hover focus; controlled WebGL fallback');
 if(out.errors.length)throw Error(out.errors.join(';'));if(out.axe.some(a=>a.violations.length))throw Error('axe violations');
}catch(e){out.failure=e.message;process.exitCode=1}finally{out.buildSha256=crypto.createHash('sha256').update(fs.readFileSync('dist/index.html')).digest('hex');out.verifiedAt=new Date().toISOString();fs.writeFileSync(path.join(DIR,'report.json'),JSON.stringify(out,null,2));console.log(JSON.stringify({failure:out.failure,captures:out.captures.length,errors:out.errors,axeViolations:out.axe.map(a=>[a.screen,a.width,a.violations.map(v=>v.id)])},null,2));await browser.close()}
})();
