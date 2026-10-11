const {chromium}=require('playwright');const fs=require('node:fs');const DIR='docs/evidence/light-v2';
(async()=>{const {default:lighthouse}=await import('lighthouse');const browser=await chromium.launch({channel:'chrome',headless:false,args:['--remote-debugging-port=9222']});const output=[];
try{for(const preset of ['mobile','desktop'])for(let run=1;run<=3;run++){
const options={port:9222,output:'json',onlyCategories:['performance','accessibility','best-practices','seo'],logLevel:'error',...(preset==='desktop'?{preset:'desktop'}:{})};
const result=await lighthouse('http://127.0.0.1:4173',options);fs.writeFileSync(`${DIR}/lighthouse-home-${preset}-${run}.json`,result.report);output.push({preset,run,scores:Object.fromEntries(Object.entries(result.lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)]))});console.log(output.at(-1));}
fs.writeFileSync(DIR+'/lighthouse-summary.json',JSON.stringify(output,null,2));}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
