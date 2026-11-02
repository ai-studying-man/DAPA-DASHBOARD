import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage();await page.goto((process.env.QA_URL||'http://127.0.0.1:4173/')+'?view=fleet&item=k2&lang=ko');await page.waitForSelector('[data-ready="true"]');
 await page.locator('[data-fleet-equipment]').focus();await page.keyboard.press('ArrowDown');await page.waitForFunction(()=>window.fleetQA.selected==='k9');
 assert.equal(await page.locator('[data-fleet-equipment]').evaluate(e=>e===document.activeElement),true,'Equipment keyboard selection must preserve focus');
 await page.keyboard.press('ArrowDown');await page.waitForFunction(()=>window.fleetQA.selected==='chunmoo');
 for(const [control,value]of [['filter','air'],['language','ja']]){
  const selector=`[data-fleet-${control}]`;await page.locator(selector).focus();await page.locator(selector).selectOption(value);await page.waitForSelector('[data-ready="true"]');
  assert.equal(await page.locator(selector).evaluate(e=>e===document.activeElement),true,control+' focus');
 }
 await page.locator('[data-fleet-step="1"]').click();await page.waitForSelector('[data-ready="true"]');assert.equal(await page.locator('[data-fleet-step="1"]').evaluate(e=>e===document.activeElement),true,'Next focus');
 console.log('Native equipment arrow navigation, filter, language and next-button focus passed');
}finally{await browser.close()}
