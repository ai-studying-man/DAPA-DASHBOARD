import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {representatives} from '../src/representative-data.js';
const urls=[...new Set(representatives.flatMap(r=>[r.video.url,r.photo.url,...r.facts.map(f=>f.url),...r.additional.map(s=>s.url)]))];
const records=await Promise.all(urls.map(async url=>{try{const response=await fetch(url,{signal:AbortSignal.timeout(20000)});const bytes=Buffer.from(await response.arrayBuffer());return{url,status:response.status,contentType:response.headers.get('content-type'),bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')}}catch(error){return{url,error:error.message}}}));
fs.mkdirSync('docs/representatives',{recursive:true});fs.writeFileSync('docs/representatives/source-manifest.json',JSON.stringify({retrievedAt:new Date().toISOString(),systems:representatives.map(r=>({id:r.id,branch:r.branch,video:r.video,photo:r.photo,facts:r.facts,additional:r.additional,model:r.model})),records},null,2));
console.log('Sources',records.length,'verified',records.filter(r=>r.status===200).length);console.log(records.filter(r=>r.status!==200));
if(records.some(r=>r.status!==200))process.exitCode=1;
