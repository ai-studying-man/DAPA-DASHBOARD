import {chromium} from 'playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const out='artifacts/3d/fleet/review';await mkdir(out,{recursive:true});
const entries=JSON.parse(await readFile('src/fleet-assets.json','utf8'));
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}});const index=[];
 for(const width of [375,768,1280])for(let batch=0;batch<3;batch++){
  const cells=[];
  for(const entry of entries.slice(batch*13,batch*13+13)){
   const source=`artifacts/3d/fleet/qa/${entry.id}-${width}.png`;
   cells.push(`<figure><figcaption>${entry.id} · ${width}px</figcaption><img src="data:image/png;base64,${(await readFile(source)).toString('base64')}"></figure>`);index.push(source);
  }
  await page.setContent(`<style>body{margin:0;padding:16px;background:#dce3eb;font:14px sans-serif;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}figure{margin:0;background:white;padding:8px}img{width:100%;height:490px;object-fit:contain;object-position:top}figcaption{font-weight:bold}</style>${cells.join('')}`);
  await page.locator('img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));
  await page.screenshot({path:`${out}/all-${width}-${batch}.png`,fullPage:true});
 }
 await writeFile(`${out}/coverage.json`,JSON.stringify({images:index,count:index.length,overview:'Contact sheets preserve every full capture; inspect originals for small text.'},null,2)+'\n');
 console.log('117 screenshots indexed in nine overview sheets');
}finally{await browser.close()}
