const {chromium}=require('playwright');
const fs=require('fs');
const assert=require('assert/strict');
(async()=>{
 const out='artifacts/satellite-equipment';fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage();const errors=[],checks=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/assets/visitor-satellite-stage-*.js',async route=>{
  const file=new URL(route.request().url()).pathname.split('/').pop();
  const body=fs.readFileSync('dist/assets/'+file,'utf8').replace(/constructor\(([^)]*)\)\{Object.assign/,'constructor($1){window.__satellite=this;Object.assign');
  await route.fulfill({body,contentType:'application/javascript'});
 });
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:width===390?844:1000});
  for(const id of process.env.QA_ITEM?[process.env.QA_ITEM]:['k2','k9','k21','k216','fa50','dosan','chungnam','chunmoo','nuri']){
   console.log(width,id);
   await page.goto(`http://127.0.0.1:4181/?view=visit&step=orbit&item=${id}`);
   await page.locator('.visit-satellite[data-ready=true]').waitFor({timeout:60000});
   await page.waitForFunction(()=>window.__satellite.viewer.scene.globe.tilesLoaded,null,{timeout:30000});
   await page.waitForTimeout(500);
   const state=await page.evaluate(()=>({model:!!window.__satellite.model,url:window.__satellite.item.model,height:window.__satellite.groundHeight,overflow:document.documentElement.scrollWidth>innerWidth,stage:document.querySelector('#visit-stage').getBoundingClientRect().toJSON(),images:window.__satellite.viewer.imageryLayers.length,terrain:window.__satellite.viewer.terrainProvider.constructor.name}));
   assert.equal(state.model,true,id);assert.equal(state.overflow,false,id);assert.equal(state.images,1);
   await page.screenshot({path:`${out}/${id}-${width}.png`});checks.push({width,id,...state});
   await page.locator('[data-map-context]').click();
   assert.equal(await page.evaluate(()=>window.__satellite.camera.context),true);
  }
 }
 await page.goto('http://127.0.0.1:4181/?view=visit&step=sim&item=k9');
 await page.locator('.visit-satellite[data-ready=true]').waitFor({timeout:60000});
 await page.keyboard.down('ArrowUp');await page.waitForTimeout(1200);await page.keyboard.up('ArrowUp');
 const distance=await page.evaluate(()=>Math.hypot(window.__satellite.offset.east,window.__satellite.offset.north));
 assert.ok(distance>1);await page.locator('#visit-reset').click();
 assert.equal(await page.evaluate(()=>Math.hypot(window.__satellite.offset.east,window.__satellite.offset.north)),0);
 await page.locator('#visit-view').click();assert.equal(await page.evaluate(()=>window.__satellite.camera.onboard),true);
 await page.selectOption('#visit-equipment-picker','nuri');
 await page.locator('.visit-satellite[data-ready=true]').waitFor({timeout:60000});
 assert.equal(await page.locator('[data-move=forward]').isDisabled(),true);
 assert.deepEqual(errors,[]);fs.writeFileSync(out+(process.env.QA_ITEM?'/focused-report.json':'/report.json'),JSON.stringify({checks,distance,errors},null,2));
 await browser.close();console.log('PASS',checks.length,'orbit states, movement/reset/view/fixed controls');
})().catch(error=>{console.error(error);process.exit(1)});
