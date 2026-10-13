import fs from 'node:fs';
import {createHash} from 'node:crypto';
const assets=[
 {id:'k2-photo',title:'File:K2 Black Panther 20161106.jpg',file:'k2.jpg',thumbnail:true,licenses:['CC BY 3.0']},
 {id:'dosan-photo',title:'File:ROKS Dosan Ahn Changho class submarine.png',file:'dosan.png',thumbnail:true,licenses:['KOGL Type 1','Public domain','CC BY 4.0']},
 {id:'k2-video',title:'File:K2 Black Panther tank demonstrating the posture control function of the in-arm suspension unit at the Gyeryong Ground Forces Cultural Festival 2016.webm',file:'k2-posture.webm',licenses:['CC BY 3.0']},
];
const directory='public/media/representatives';fs.mkdirSync(directory,{recursive:true});
const api=new URL('https://commons.wikimedia.org/w/api.php');
for(const[k,v]of Object.entries({action:'query',format:'json',titles:assets.map(a=>a.title).join('|'),prop:'imageinfo',iiprop:'url|size|extmetadata',iiurlwidth:'1280'}))api.searchParams.set(k,v);
const metadata=await fetch(api,{headers:{'User-Agent':'KDefenseAtlas/1.0 public exhibition attribution research'}}).then(r=>{if(!r.ok)throw Error('Commons metadata '+r.status);return r.json()});
const records=[];
for(const asset of assets){
 const page=Object.values(metadata.query.pages).find(p=>p.title===asset.title),info=page?.imageinfo?.[0];
 if(!info)throw Error('Missing source '+asset.title);
 const license=info.extmetadata.LicenseShortName?.value;if(!asset.licenses.includes(license))throw Error('Unreviewed license '+asset.id+': '+license);
 const remote=new URL(asset.thumbnail?(info.thumburl||info.url):info.url);remote.search='';
 const r=await fetch(remote);if(!r.ok)throw Error('Asset '+asset.id+' '+r.status);
 const bytes=Buffer.from(await r.arrayBuffer());if(bytes.length>80*1024*1024)throw Error('Asset exceeds source repository budget '+asset.id);
 fs.writeFileSync(directory+'/'+asset.file,bytes);
 records.push({id:asset.id,title:page.title,file:directory+'/'+asset.file,url:remote.href,source:info.descriptionurl,license,licenseUrl:info.extmetadata.LicenseUrl?.value,author:info.extmetadata.Artist?.value,description:info.extmetadata.ImageDescription?.value,sourceMetadata:info.extmetadata,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
 console.log(asset.id,license,bytes.length);
}
fs.writeFileSync('docs/representatives/local-asset-manifest.json',JSON.stringify({retrievedAt:new Date().toISOString(),records},null,2));
