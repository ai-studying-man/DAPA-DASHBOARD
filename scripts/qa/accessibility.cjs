const {chromium}=require('playwright');
const fs=require('fs');const ROOT=process.env.KDEF_ROOT || process.cwd();const AxeBuilder=require('@axe-core/playwright').default;
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:false});const context=await browser.newContext();const page=await context.newPage();const out={axe:[],checks:[]};
 try{
  for(const width of [375,1280]){
   await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:4173/?system=k2');await page.waitForFunction(()=>document.querySelector('#map-status').hidden);
   for(const mode of ['korea','world','graph','list']){await page.locator('[data-mode="'+mode+'"]').click();if(mode==='world') await page.waitForFunction(()=>document.querySelector('#map-status').hidden);const result=await new AxeBuilder({page}).analyze();fs.writeFileSync(ROOT+'/docs/evidence/axe-'+width+'-'+mode+'.json',JSON.stringify(result,null,2));out.axe.push({width,mode,violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))});}
  }
  await page.setViewportSize({width:3840,height:2160});await page.goto('http://127.0.0.1:4173/?system=k2');await page.waitForFunction(()=>document.querySelector('#map-status').hidden);await page.screenshot({path:ROOT+'/docs/evidence/landscape-4k.png'});
  await page.setViewportSize({width:1440,height:900});
  
  const canvas=page.locator('#map-host canvas');const before=await canvas.screenshot();
  await page.locator('#zoom-in').click();const zoomed=await canvas.screenshot();if(before.equals(zoomed))throw Error('zoom image unchanged');
  await page.locator('#home-view').click();const box=await canvas.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+90,box.y+box.height/2+20,{steps:10});await page.mouse.up();const rotated=await canvas.screenshot();if(before.equals(rotated))throw Error('rotation unchanged');
  await page.locator('#settings-open').click();await page.keyboard.press('Escape');if(await page.locator('#settings').isVisible())throw Error('Escape failed');
  await page.locator('#branch').selectOption('해군');if(await page.locator('#collection .system-card').count()!==1)throw Error('navy filter');
  await page.locator('[data-mode="world"]').click();if(!(await page.locator('#result-count').innerText()).includes('0개국'))throw Error('world empty events');
  await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#reset').click();await page.locator('[data-start-all]').click();await page.screenshot({path:ROOT+'/docs/evidence/reduced-motion.png'});
  await page.locator('#detail .source-card').first().focus();if(!(await page.evaluate(()=>document.activeElement.tagName)).includes('A'))throw Error('source keyboard');
  out.checks.push('3840x2160 viewport','zoom and drag changed actual canvas','Escape closes settings','navy filter; no overseas events for domestic delivery','reduced motion','source link focus');
  if(out.axe.some(a=>a.violations.length))process.exitCode=1;
 }catch(e){out.failure=e.message;process.exitCode=1}finally{fs.writeFileSync(ROOT+'/docs/evidence/accessibility-qa.json',JSON.stringify(out,null,2));console.log(JSON.stringify(out,null,2));await browser.close()}
})();
