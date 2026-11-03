import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';

// Run in the repo root. A missing or stale recording keeps the system pending.
const catalog=JSON.parse(await readFile('src/fleet-assets.json','utf8'));
const saved=process.argv[2] || 'unreal/DefenseExhibit/Saved';
const results=[];
for(const item of catalog){
  const bytes=await readFile(resolve('public',item.model));
  const hash=createHash('sha256').update(bytes).digest('hex');
  let status='missing';
  try{
    const record=JSON.parse(await readFile(resolve(saved,'PIE-'+item.id+'.json'),'utf8'));
    const positions=record.positions;
    const sampled=Array.isArray(positions) && positions.length>=7 &&
      positions.every(p=>Array.isArray(p) && p.length===3 && p.every(Number.isFinite)) &&
      positions.some(p=>p.some((value,i)=>Math.abs(value-positions[0][i])>.01));
    const valid=record.system===item.id && typeof record.engine==='string' && record.engine.length>0 &&
      /UEDPIE_/.test(record.world) && Number.isFinite(record.seconds) && record.seconds>=6 && sampled;
    status=record.sourceSha256!==hash?'stale':valid?'played':'invalid';
  }catch(error){
    if(error.code!=='ENOENT')status='unreadable';
  }
  results.push({id:item.id,status});
}
const played=results.filter(row=>row.status==='played').length;
console.log(JSON.stringify({total:results.length,played,results},null,2));
if(played!==results.length)process.exitCode=1;
