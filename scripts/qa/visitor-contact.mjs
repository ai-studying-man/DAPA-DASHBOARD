import {PNG} from 'pngjs';
import fs from 'node:fs';
import {visitorEquipment} from '../../src/visitor-catalog.js';
for(let batch=0;batch<5;batch++){
 const items=visitorEquipment.slice(batch*8,batch*8+8),out=new PNG({width:780,height:items.length*422});out.data.fill(255);
 for(const [row,item]of items.entries())for(const [col,step]of ['equipment','orbit','sim','video'].entries()){
  const src=PNG.sync.read(fs.readFileSync(`artifacts/visitor/coverage/${item.id}-${step}.png`));
  for(let y=0;y<422;y++)for(let x=0;x<195;x++){
   const from=(y*2*src.width+x*2)*4,to=((row*422+y)*780+col*195+x)*4;src.data.copy(out.data,to,from,from+4);
  }
 }
 fs.writeFileSync(`artifacts/visitor/coverage/contact-${batch+1}.png`,PNG.sync.write(out));
 fs.writeFileSync(`artifacts/visitor/coverage/contact-${batch+1}.json`,JSON.stringify(items.map(e=>e.id)));
}
