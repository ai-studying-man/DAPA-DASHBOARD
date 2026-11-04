import {chromium} from 'playwright';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

const fleet = JSON.parse(await readFile('src/fleet-assets.json','utf8'));
const partFor = {PropellerStudy:'Propeller', RotorStudy:'MainRotor', TurretTraverse:'Turret', BarrelElevation:'Gun'};
const browser = await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
const results = [], errors = [];
try {
  const page = await browser.newPage({viewport:{width:1280,height:900}});
  page.on('pageerror', error => errors.push(error.message));
  await page.goto((process.env.QA_URL || 'http://127.0.0.1:4205/')+'?view=fleet&item=k2');
  for (const item of fleet) {
    await page.locator('[data-fleet-equipment]').selectOption(item.id);
    await page.waitForFunction(id => window.fleetQA?.selected === id &&
      window.fleetQA.studio.ui.dataset.ready === 'true', item.id);
    const clips = item.clips.filter(name => partFor[name]);
    for (const clip of clips) {
      const part = partFor[clip];
      await page.locator('[data-studio-clip]').selectOption(clip);
      const rest = await page.evaluate(part => window.fleetQA.studio.parts[part].quaternion.toArray(),part);
      await page.locator('[data-studio-play]').click();
      await page.waitForFunction(({part,rest}) => window.fleetQA.studio.parts[part].quaternion.toArray()
        .some((v,i) => Math.abs(v-rest[i]) > .01), {part,rest});
      await page.locator('[data-studio-stop]').click();
    }
    results.push({id:item.id,rotationsVerified:clips});
  }
  assert.deepEqual(errors,[]);
  await mkdir('artifacts/3d',{recursive:true});
  await writeFile('artifacts/3d/fleet-part-motion.json',JSON.stringify(results,null,2));
  console.log(results.length+' exhibits, '+results.flatMap(r=>r.rotationsVerified).length+' verified part rotations');
} finally { await browser.close(); }
