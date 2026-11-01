const {chromium}=require('playwright'),fs=require('fs'),assert=require('assert/strict');
(async()=>{
 const b=await chromium.launch({channel:'chrome',headless:true}),p=await b.newPage({viewport:{width:390,height:844}}),errors=[];
 p.on('pageerror',error=>errors.push(error.message));
 await p.route('**/assets/visitor-satellite-stage-*.js',async r=>{const f=new URL(r.request().url()).pathname.split('/').pop();await r.fulfill({body:fs.readFileSync('dist/assets/'+f,'utf8').replace(/constructor\(([^)]*)\)\{Object.assign/,'constructor($1){window.__satellite=this;Object.assign'),contentType:'application/javascript'})});
 await p.goto('http://127.0.0.1:4181/?view=visit&step=sim&item=k216');await p.locator('.visit-satellite[data-ready=true]').waitFor({timeout:60000});
 await p.evaluate(()=>window.__satellite.viewer.canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));
 await p.locator('[data-satellite-retry]').waitFor({state:'visible'});assert.equal(await p.locator('[data-move=forward]').isDisabled(),true);
 const stopped=await p.evaluate(()=>window.__satellite.viewer.useDefaultRenderLoop);assert.equal(stopped,false);
 await p.screenshot({path:'artifacts/satellite-equipment/context-loss-390.png'});
 await p.locator('[data-satellite-retry]').click();await p.locator('.visit-satellite[data-ready=true]').waitFor({timeout:60000});
 assert.equal(await p.locator('[data-move=forward]').isDisabled(),false);
 await p.route('**/k9-photo-reconstructed.glb',r=>r.abort());await p.selectOption('#visit-equipment-picker','k9');
 await p.locator('[data-satellite-retry]').waitFor({state:'visible',timeout:60000});assert.equal(await p.locator('[data-move=forward]').isDisabled(),true);
 await p.unroute('**/k9-photo-reconstructed.glb');await p.locator('[data-satellite-retry]').click();await p.locator('.visit-satellite[data-ready=true]').waitFor({timeout:60000});
 await p.selectOption('#visit-language','en');await p.locator('.visit-satellite[data-ready=true]').waitFor({timeout:60000});assert.equal(await p.locator('[data-map-context]').textContent(),'Satellite overview');
 assert.deepEqual(errors,[]);fs.writeFileSync('artifacts/satellite-equipment/recovery.json',JSON.stringify({contextLoss:true,retry:true,modelFailure:true,language:true,errors},null,2));await b.close();console.log('PASS context loss, failed GLB, retry and language');
})().catch(e=>{console.error(e);process.exit(1)});
