import assert from 'node:assert/strict';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const base=process.env.QA_URL || 'http://127.0.0.1:4187/';
const fullFleet=process.argv.includes('--all');
const out=process.env.QA_OUT || (fullFleet?'artifacts/3d/fleet-angles':'artifacts/3d/representative-angles');
const catalog=JSON.parse(await readFile(new URL('../../src/fleet-assets.json',import.meta.url),'utf8'));
const systems=fullFleet?['k2',...catalog.map(item=>item.id).filter(id=>id!=='k2')]:['k2','k9','kaav','chungnam','dosan','fa50','kf21','muav','remoeye','425','smallsat'];
const views=['front','right','back','top','home'];
await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try {
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const board=await browser.newPage({viewport:{width:1200,height:510}});
  const errors=[],images=new Map();
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'?view=fleet&item=k2');
  for(const id of systems){
    await page.locator('[data-fleet-equipment]').selectOption(id);
    await page.waitForFunction(id=>window.fleetQA?.selected===id && window.fleetQA.studio.ui.dataset.ready==='true',id);
    assert.ok(await page.evaluate(()=>Boolean(window.fleetQA.studio.scene.environment?.isTexture)));
    const row=[];
    for(const view of views){
      await page.locator('[data-studio-view="'+view+'"]').click();
      const canvas=page.locator('.studio-canvas canvas');
      await canvas.scrollIntoViewIfNeeded();
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      row.push(await canvas.screenshot());
    }
    images.set(id,row);
    const htmlRow=(key)=>'<tr><th>'+key+'</th>'+images.get(key).map(bytes=>'<td><img src="data:image/png;base64,'+bytes.toString('base64')+'"></td>').join('')+'</tr>';
    await board.setContent('<style>*{box-sizing:border-box}body{font:16px system-ui;background:#edf2f4}table{width:100%;table-layout:fixed}th:first-child{width:72px}img{width:100%}th,td{background:white;padding:4px}</style><table><thead><tr><th>체계</th>'+['정면','우측','후면','상면','사선'].map(x=>'<th>'+x+'</th>').join('')+'</tr></thead>'+htmlRow('k2')+(id==='k2'?'':htmlRow(id))+'</table>');
    await board.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
    await board.locator('table').screenshot({path:out+'/'+id+'.png'});
  }
  assert.deepEqual(errors,[]);
  await writeFile(out+'/report.json',JSON.stringify({base,systems,views,captures:systems.length*views.length,errors},null,2));
} finally {await browser.close();}
