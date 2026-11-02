import {chromium} from 'playwright';
import {readFile,mkdir} from 'node:fs/promises';
const entries=JSON.parse(await readFile('src/fleet-assets.json','utf8'));
const out='docs/modeling/fleet/comparisons';await mkdir(out,{recursive:true});
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const image=async path=>`data:${path.endsWith('.webp')?'image/webp':path.endsWith('.jpg')?'image/jpeg':'image/png'};base64,${(await readFile(path)).toString('base64')}`;
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:540}});
 for(const entry of entries){
  const panels=[];
  for(const [view,label]of [['front','정면'],['side','측면'],['three-quarter','사선']])panels.push(`<figure><img src="${await image(`docs/modeling/fleet/${entry.id}-${view}.png`)}"><figcaption>Blender 실제 렌더 · ${label}</figcaption></figure>`);
  panels.push(`<figure>${entry.referencePhoto?.startsWith('./')?`<img src="${await image('public/'+entry.referencePhoto.slice(2))}">`:'<div class="pending">참고 이미지 미확보</div>'}<figcaption>${entry.referenceKind==='public-photo'?'공개 실사 사진':entry.referenceKind==='ai-generated'?'AI 참고 이미지 · 실제 촬영 아님':'사업 공개 자료 링크로 확인'}</figcaption></figure>`);
  await page.setContent(`<html lang="ko"><meta charset="utf-8"><style>body{margin:0;padding:24px;font:15px/1.6 sans-serif;color:#182433;background:white}h1{font-size:23px}main{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}figure{margin:0}img,.pending{width:100%;height:230px;object-fit:contain;background:#f2f4f6}.pending{display:grid;place-items:center}footer{font-size:12px;overflow-wrap:anywhere;margin-top:16px}</style><h1>${escape(entry.name)} · 형상 검토 증거 / 실사 품질 미검증</h1><main>${panels.join('')}</main><footer>서로 다른 시점의 자료입니다. 실측 카메라 정합·제조사 CAD·사진측량 인증이 아닙니다. ${entry.family==='satellite'?'위성 사업 개념형이며 특정 호기 형상이 아닙니다.':''}<br>참고 이미지: ${escape(entry.photoCredit||'미확보')}<br>${escape(entry.referenceUrl||entry.sources[0]?.url||'공개 근거는 카탈로그 참조')}<br>모델 원본 사용 조건: ${escape(entry.sourceLicense)} · 출처/수정 사항: ${escape(entry.modelAttribution)}</footer></html>`);
  await page.locator('img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));await page.screenshot({path:`${out}/${entry.id}.png`});
 }
 console.log('39 three-view Blender/reference evidence boards saved');
}finally{await browser.close()}
