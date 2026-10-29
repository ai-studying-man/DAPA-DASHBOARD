import {assetReadiness} from '../src/asset-readiness.js';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const rows=assetReadiness();for(const row of rows)if(row.model){const b=await readFile('public/'+row.model.replace(/^\.\//,''));row.bytes=b.length;row.sha256=createHash('sha256').update(b).digest('hex')}
await writeFile('public/data/3d-asset-readiness.json',JSON.stringify(rows,null,2)+'\n');console.log(rows.reduce((t,r)=>(t[r.status]=(t[r.status]||0)+1,t),{}));
