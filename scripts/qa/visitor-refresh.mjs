import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.QA_URL||'http://127.0.0.1:4196/';
const out='artifacts/visitor-mobile-refresh';await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'?view=visit&step=choose');await page.waitForSelector('#equipment-query');
 assert.equal(await page.locator('.visit-card').count(),40);
 assert.equal(await page.locator('.visit-image-label,img[src*="/mvp/"],img[src*="satellite-concepts"]').count(),0);
 await page.locator('#equipment-query').fill('물속 정찰');assert.equal(await page.locator('.visit-card').first().getAttribute('data-item'),'dosan');
 await page.locator('#equipment-query').fill('500MD');await page.locator('[data-item="500md"] img').evaluate(i=>i.decode());await page.locator('[data-item="500md"]').click();
 assert.equal(await page.locator('.visit-experience-tabs').count(),0);
 await page.locator('.visit-info summary').click();await page.locator('.visit-info figure img').evaluate(i=>i.decode());assert.ok(await page.locator('.visit-source-links a').count());
 await page.goto(base+'?view=visit&step=orbit&item=dosan');await page.waitForSelector('.visit-satellite[data-ready=true]',{timeout:90000});
 assert.equal(await page.locator('main').getAttribute('data-page'),'sim');
 await page.screenshot({path:out+'/dosan.png'});await page.locator('.visit-driving summary').click();
 assert.equal(await page.locator('[data-move=forward]').isEnabled(),true);
 await page.locator('[data-map-context]').click();await page.locator('.visit-renderer-bar button').click();await page.waitForSelector('.model-studio[data-ready=true]',{timeout:45000});
 await page.goto(base+'?view=fleet&item=500md');await page.waitForSelector('[data-fleet-query]');await page.locator('[data-fleet-query]').fill('드론');assert.equal(await page.locator('[data-fleet-equipment] option[value=remoeye]').count(),1);
 await page.goto(base+'?view=equipment&item=500md');await page.waitForSelector('#mvp-image img');await page.locator('#mvp-image img').evaluate(i=>i.decode());await page.locator('#mvp-next').click();
 assert.deepEqual(errors,[]);await writeFile(out+'/report.json',JSON.stringify({base,equipment:40,errors},null,2));console.log('40 cards, 500MD photo, intent search, real terrain, merged navigation, sources and legacy controls passed');
}finally{await browser.close()}


