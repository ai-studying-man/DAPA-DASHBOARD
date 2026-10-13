const {chromium}=require(process.cwd()+'/node_modules/playwright');
const AxeBuilder=require(process.cwd()+'/node_modules/@axe-core/playwright').default;
const fs=require('fs'),assert=require('node:assert/strict');
const width=Number(process.env.QA_WIDTH||1280),height=Number(process.env.QA_HEIGHT||900),url=process.env.QA_URL||'http://127.0.0.1:4173';
const dir=process.env.QA_EVIDENCE_DIR||'docs/evidence/representatives-v10/final';fs.mkdirSync(dir,{recursive:true});
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:false,args:['--mute-audio']});const context=await browser.newContext({viewport:{width,height},hasTouch:true});const page=await context.newPage();const report={viewport:{width,height},url,captures:[],errors:[],media:[],checks:[],axe:[]};page.on('pageerror',e=>report.errors.push(e.message));
 const shot=async name=>{const path=dir+'/'+width+'-'+name+'.png';await page.screenshot({path});report.captures.push(path)};
 try{
  await page.goto(url,{waitUntil:'domcontentloaded'});await page.locator('.hero-photo img').evaluate(img=>img.decode());await page.waitForTimeout(800);await shot('hero');
  await page.locator('[data-story-jump=story-representatives]').first().click();await page.waitForTimeout(1200);
  for(const id of ['k2','dosan','fa50','kaav']){const card=page.locator('.representative-card').filter({has:page.locator('[data-representative='+id+']')});await card.scrollIntoViewIfNeeded();await card.locator('img').evaluate(img=>img.decode());await page.waitForTimeout(350);await shot('card-'+id);}
  for(const id of ['k2','dosan','fa50','kaav']){
   await page.locator('.representative-card [data-representative='+id+']').first().click();await page.locator('#representative-dialog').waitFor({state:'visible'});await page.waitForTimeout(400);assert.equal(new URL(page.url()).searchParams.get('representative'),id);assert.equal(await page.locator('#representative-media video,#representative-media iframe').count(),0);await shot(id+'-poster');
   if(width===1280)report.axe.push({id,state:'poster',violations:(await new AxeBuilder({page}).include('#representative-dialog').analyze()).violations});
   await page.locator('[data-rep-action=play]').click();
   let state;
   if(id==='dosan'){
    const frame=page.frameLocator('#representative-media iframe');await frame.locator('video').waitFor();await frame.locator('button[data-plyr=play]:visible').first().click();await page.waitForTimeout(1400);state=await frame.locator('video').evaluate(v=>({time:v.currentTime,duration:v.duration,paused:v.paused,error:v.error?.code}));assert.ok(state.time>0);assert.equal(state.paused,false);
   }else{
    await page.waitForFunction(()=>document.querySelector('#representative-media video')?.currentTime>.6,{timeout:30000});state=await page.locator('#representative-media video').evaluate(v=>({time:v.currentTime,duration:v.duration,paused:v.paused,readyState:v.readyState,width:v.videoWidth,height:v.videoHeight,error:v.error?.code}));assert.equal(state.paused,false);assert.ok(state.width>=1280);
   }
   report.media.push({id,...state});await shot(id+'-playing');assert.equal(await page.locator('#representative-dialog').getAttribute('data-focus'),'true');await shot(id+'-focus');
   await page.locator('[data-rep-action=focus]').click();assert.equal(await page.locator('.representative-context').isVisible(),true);for(const summary of await page.locator('.representative-context summary').all())await summary.click();await page.locator('.representative-context').scrollIntoViewIfNeeded();await shot(id+'-sources');
   await page.locator('[data-rep-action=stop]').click();assert.equal(await page.locator('#representative-media video,#representative-media iframe').count(),0);assert.equal(await page.locator('#representative-dialog').getAttribute('data-focus'),'false');
   await page.keyboard.press('Escape');await page.locator('#representative-dialog').waitFor({state:'hidden'});await page.waitForURL(location=>!location.searchParams.has('representative'));assert.equal(new URL(page.url()).searchParams.has('representative'),false);report.checks.push({id,stopped:true,addressRestored:true});
  }
  if([375,1080,1280].includes(width)){
   for(const[id,branch]of[['k2','육군'],['dosan','해군'],['fa50','공군'],['kaav','해병대']]){
    await page.locator('#reset').click();await page.locator('.hero-branches [data-start-branch='+branch+']').click();await page.locator('#representative-dialog').waitFor({state:'visible'});await page.locator('[data-rep-action=inspect]').click();await page.locator('#system-demo').waitFor({state:'visible'});await page.waitForFunction(()=>document.querySelector('#demo-play-status')?.textContent.includes('환경 준비 완료'),null,{timeout:45000});await page.waitForTimeout(1400);assert.ok((await page.locator('#demo-title').innerText()).includes(id==='k2'?'K2':id==='fa50'?'FA-50':id==='dosan'?'도산안창호':'상륙돌격'));assert.equal(new URL(page.url()).searchParams.get('system'),id);await shot(id+'-3d');await page.keyboard.press('Escape');await page.locator('#system-demo').waitFor({state:'hidden'});
   }
  }
  await page.locator('#reset').click();
  if(width===1280){
   await page.locator('[data-story-jump=story-discover]').first().click();await page.waitForTimeout(1200);await page.locator('#branch-categories [data-start-branch=육군]').click();assert.equal(await page.locator('#branch').inputValue(),'육군');await shot('army-filter');await page.locator('#clear-filters').click();
   for(const mode of ['korea','world','graph','list','timeline']){await page.locator('[data-mode='+mode+']').click();await page.waitForTimeout(1200);await shot('mode-'+mode);}
   await page.locator('#reset').click();await page.locator('.hero-branches [data-start-branch=육군]').click();await page.route('**/k2-posture.webm',route=>route.abort());await page.locator('[data-rep-action=play]').click();await page.locator('#representative-media[data-state=error]').waitFor();await shot('media-error');await page.unroute('**/k2-posture.webm');await page.locator('.representative-retry').click();await page.waitForFunction(()=>document.querySelector('#representative-media video')?.currentTime>.5);assert.equal(await page.locator('#representative-media').getAttribute('data-state'),'playing');report.retry=true;await page.locator('#representative-media video').evaluate(v=>{v.currentTime=v.duration-.15});await page.waitForFunction(()=>document.querySelector('#representative-media video')?.ended);assert.equal(await page.locator('#representative-dialog').getAttribute('data-focus'),'false');report.seekEnded=true;await shot('media-ended');await page.locator('[data-rep-action=close]').click();
   await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url+'?representative=fa50');await page.locator('#representative-dialog').waitFor({state:'visible'});assert.ok((await page.locator('#representative-dialog-title').innerText()).includes('FA-50'));await shot('reduced-deep-link');await page.keyboard.press('Escape');await page.waitForURL(location=>!location.searchParams.has('representative'));report.deepLink=true;
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);report.overflow=false;
  fs.writeFileSync(dir+'/'+width+'-report.json',JSON.stringify(report,null,2));assert.equal(report.errors.length,0);console.log(width+' captured '+report.captures.length+' frames, errors '+report.errors.length+', axe '+report.axe.flatMap(a=>a.violations).length);
 }finally{await context.close();await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
