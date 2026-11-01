import {visitorEquipment} from '../../src/visitor-catalog.js';
import {chromium} from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const out='artifacts/visitor/coverage';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));
// QA-only instrumentation of the existing viewer class, never shipped to visitors.
await page.route('**/assets/model-studio-*.js',async route=>{let body=fs.readFileSync('dist/assets/'+new URL(route.request().url()).pathname.split('/').pop(),'utf8');body=body.replace(/constructor\(([^)]*)\)\{this.host/,'constructor($1){window.__studio=this;this.host');await route.fulfill({body,contentType:'application/javascript'})});
const subset=process.env.QA_ITEMS?.split(',');
for(const item of visitorEquipment.filter(e=>!subset||subset.includes(e.id))){console.log(item.id);for(const step of ['equipment','orbit','sim','video']){
 await page.goto(`http://127.0.0.1:4181/?view=visit&step=${step}&item=${item.id}`);await page.locator('.visit-shell').waitFor();
 if(item.model&&['orbit','sim'].includes(step))await page.locator('[data-ready=true]').waitFor({timeout:25000});
 if(step==='sim'&&item.model){await page.locator('[data-move=forward]:enabled').waitFor();const before=await page.evaluate(()=>window.__studio.root.position.z);await page.keyboard.down('ArrowUp');await page.waitForTimeout(200);await page.keyboard.up('ArrowUp');assert((await page.evaluate(()=>window.__studio.root.position.z))<before);await page.locator('#visit-reset').click();assert.equal(await page.evaluate(()=>window.__studio.root.position.z),before);const box=await page.locator('[data-move=forward]').boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.waitForTimeout(200);await page.mouse.up();assert((await page.evaluate(()=>window.__studio.root.position.z))<before);await page.locator('#visit-reset').click();}
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.waitForTimeout(280);await page.screenshot({path:`${out}/${item.id}-${step}.png`});checks.push({id:item.id,step,model:Boolean(item.model)});
}}
await page.goto('http://127.0.0.1:4181/?view=visit&step=sim&item=k2');await page.locator('[data-ready=true]').waitFor();await page.locator('[data-move=forward]:enabled').waitFor();await page.keyboard.down('ArrowUp');await page.waitForTimeout(1800);await page.keyboard.up('ArrowUp');assert.match(await page.locator('#visit-progress').innerText(),/도착/);
for(const code of ['ko','en','ja','zh']){await page.locator('#visit-language').selectOption(code);await page.locator('[data-ready=true]').waitFor();assert.equal(await page.locator('html').getAttribute('lang'),{ko:'ko',en:'en',ja:'ja',zh:'zh-CN'}[code]);await page.screenshot({path:`${out}/language-${code}.png`});}
const previous=subset&&fs.existsSync(out+'/report.json')?JSON.parse(fs.readFileSync(out+'/report.json')).checks.filter(e=>!subset.includes(e.id)):[];
fs.writeFileSync(out+'/report.json',JSON.stringify({checks:[...previous,...checks],errors},null,2));assert.deepEqual(errors,[]);await browser.close();console.log(checks.length+' equipment states passed');
