const { chromium } = require('playwright');
const fs = require('node:fs');
const ROOT = process.env.KDEF_ROOT || process.cwd();
const URL = 'http://127.0.0.1:4173';
(async () => {
  const browser = await chromium.launch({ channel:'chrome', headless:false, args:['--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  const report={errors,captures:[],checks:[]};
  async function shot(name) { const file=ROOT+'/docs/evidence/'+name+'.png'; await page.screenshot({path:file,fullPage:true}); report.captures.push(file); }
  try {
    for(const width of [375,768,1280]) {
      await page.setViewportSize({width,height:900}); await page.goto(URL+'/?showcase=1');
      await page.locator('.showcase h1').waitFor(); await shot('primitives-'+width);
    }
    for (const width of [375,768,1280]) {
      await page.setViewportSize({width,height:width===375?812:900}); await page.goto(URL+'/?system=k2');
      await page.waitForFunction(()=>document.querySelector('#map-status').hidden,{timeout:30000});
      for(const mode of ['korea','world','graph','list']) {
        await page.locator('[data-mode="'+mode+'"]').click();
        if(mode==='world') await page.waitForFunction(()=>document.querySelector('#map-status').hidden);
        await page.evaluate(()=>document.fonts.ready); await shot(mode+'-'+width);
        const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
        if(overflow) throw new Error('horizontal overflow '+mode+' '+width);
      }
    }
    await page.setViewportSize({width:1920,height:1080}); await page.goto(URL+'/?system=k2');
    await page.waitForFunction(()=>document.querySelector('#map-status').hidden);
    await shot('landscape-1920');
    await page.locator('.domain-chips [data-domain="air"]').click();
    if(await page.locator('#collection .system-card').count()!==2) throw new Error('air filter');
    await page.locator('#search').fill('FA-50');
    if(await page.locator('#collection .system-card').count()!==1) throw new Error('search');
    await page.locator('#search').fill('없는체계zzzz');
    await shot('search-empty');
    if(await page.locator('#collection .system-card').count()!==0) throw new Error('empty');
    await page.locator('#clear-filters').click(); await page.locator('#branch').selectOption('해병대');
    if(await page.locator('#collection .system-card').count()!==1) throw new Error('marine filter');
    await page.locator('.domain-chips [data-domain="sea"]').click();
    if(await page.locator('#collection .system-card').count()!==1) throw new Error('marine sea');
    await page.locator('.domain-chips [data-domain="land"]').click();
    if(await page.locator('#collection .system-card').count()!==1) throw new Error('marine land');
    await page.locator('#reset').click();
    if(!await page.locator('.welcome').isVisible())throw Error('reset returns home');
    await page.locator('[data-start-all]').click();
    await page.locator('#collection [data-system="fa50"]').click();
    if(!(await page.locator('#detail h2').innerText()).includes('FA-50')) throw new Error('selection');
    await page.locator('#settings-open').click(); await page.locator('input[name="dock"][value="bottom"]').check();
    await page.locator('#settings-done').click(); await shot('landscape-bottom');
    await page.locator('#settings-open').click(); await page.locator('input[name="layout"][value="tall"]').check();
    await page.locator('input[name="density"][value="exhibit"]').check(); await page.locator('#settings-done').click();
    await page.evaluate(()=>document.querySelector('main').scrollTop=0); await shot('manual-tall-exhibit');
    await page.setViewportSize({width:1080,height:1920}); await shot('portrait-1080');
    await page.locator('#settings-open').click(); await page.locator('input[name="layout"][value="auto"]').check(); await page.locator('input[name="dock"][value="side"]').check(); await page.locator('#settings-done').click(); await shot('portrait-side');
    await page.locator('#reset').click();
    if(!await page.locator('.welcome').isVisible())throw Error('reset returns home');
    await page.locator('[data-start-all]').click(); await page.locator('[data-mode="graph"]').click();
    await page.locator('.graph-node[data-to-world]').click();
    if(!(await page.locator('#mode-title').innerText()).includes('세계')) throw new Error('graph relation');
    const allRequests=[]; page.on('request', r=>allRequests.push(r.url()));
    await page.route('**/*', route=>route.request().url().startsWith(URL)?route.continue():route.abort());
    await page.reload(); await page.waitForFunction(()=>document.querySelector('#map-status').hidden);
    report.checks.push('375/768/1280 all 4 modes; zero document overflow','air/search/empty/marine multi-domain filters','selection and graph-to-world navigation','landscape bottom nav; manual portrait; 1080x1920 side nav','all assets fetched from local origin only');
    if(allRequests.some(u=>!u.startsWith(URL))) throw new Error('external runtime asset');
    if(errors.length) throw new Error(errors.join('; '));
  } catch (error) { report.failure=error.message; await shot('failure'); process.exitCode=1; }
  finally { fs.writeFileSync(ROOT+'/docs/evidence/browser-qa.json',JSON.stringify(report,null,2)); await browser.close(); console.log(JSON.stringify(report,null,2)); }
})();
