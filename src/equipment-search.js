// Local sparse retrieval. Group terms express exhibition concepts across languages.
const concepts=[
 ['잠수함','물속','바닷속','수중','잠항','submarine','도산'],
 ['전차','탱크','tank','흑표'],['자주포','곡사포','포병','howitzer','artillery'],
 ['헬기','헬리콥터','회전익','helicopter','500md','코브라','아파치','수리온','uh60p','lah'],
 ['전투기','전투기체','fighter','보라매','kf21','fa50','f22','f117'],
 ['무인기','드론','무인항공기','drone','uav','리모아이','무인정찰'],
 ['인공위성','위성','우주','궤도','satellite','425','smallsat','anasis'],
 ['호위함','군함','수상함','frigate','충남함'],['상륙','수륙양용','amphibious','kaav'],
 ['정찰','감시','관측','reconnaissance'],['장갑차','장갑차량','ifv','apc'],
 ['방공','대공','천궁','airdefense'],['로켓','발사체','누리','rocket'],
 ['훈련기','조종훈련','trainer','kt1','t50'],['구난','견인','recovery'],
 ['박격포','mortar','km181','km187'],['다연장','천무','mlrs'],
];
const norm=s=>String(s??'').normalize('NFKC').toLowerCase().replace(/[-‐‑–]/g,'');
const noise=new Set(['찾아줘','장비','무기','체계','하는','찾기','관련','에서','있는','the','for']);
export function searchEquipment(items,query,fields){
  const q=norm(query).trim();if(!q)return items;
  const terms=q.split(/[^\p{L}\p{N}]+/u).filter(x=>x&&!noise.has(x));
  const groups=concepts.filter(g=>g.some(word=>q.includes(word)));
  const documents=items.map(item=>{
    const title=norm([item.id,item.name,item.english].filter(Boolean).join(' '));
    const body=norm([title,...fields(item)].filter(Boolean).join(' '));
    return {item,title,body};
  });
  const weighted=groups.map(words=>{
    const frequency=documents.filter(d=>words.some(word=>d.body.includes(word))).length;
    return {words,weight:5+5*Math.log((documents.length+1)/(frequency+1))};
  });
  const rows=documents.map(({item,title,body})=>{
    const direct=terms.reduce((sum,term)=>sum+(title.includes(term)?9:body.includes(term)?3:0),0);
    // A setting qualifies the mission: underwater reconnaissance should surface
    // a submarine before an aircraft or land vehicle described as reconnaissance.
    const underwater=/물속|바닷속|수중|잠항/.test(q);
    const setting=underwater && /잠수함|submarine|도산/.test(body)?24:0;
    const related=weighted.reduce((sum,g)=>sum+(g.words.some(word=>body.includes(word))?g.weight:0),setting);
    return {item,score:(title.includes(q)?30:0)+direct+related};
  });
  return rows.filter(r=>r.score>0).sort((a,b)=>b.score-a.score).map(r=>r.item);
}
