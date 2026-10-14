import {templates} from './i18n-templates.js';
import {uiTranslations} from './i18n-ui.js';
import {equipmentTranslations} from './i18n-equipment.js';

const storageKey='dapa-exhibit-locale-v1';
const locales={ko:'ko-KR',en:'en-US',ja:'ja-JP',zh:'zh-CN'};
const normalize=code=>code==='zh-CN'||code==='zh-Hans'?'zh':code;
let locale='ko';
try{const saved=normalize(globalThis.localStorage?.getItem(storageKey));if(Object.hasOwn(locales,saved))locale=saved;}catch{/* Storage can be blocked in kiosk browsers. */}
const resources={...uiTranslations,...equipmentTranslations};
const entries=Object.entries(resources).sort((a,b)=>b[0].length-a[0].length);
const originals=new WeakMap();
const missing=new Set();
let root,observer,scheduled=false;
const pendingNodes=new Set();
export const getLocale=()=>locale;
export function translateText(text,code=locale){
 if(!text||code==='ko')return text;
 const trimmed=text.trim(),exact=resources[trimmed]?.[code];
 if(exact)return text.replace(trimmed,exact);
 for(const [pattern,values] of templates){const match=trimmed.match(pattern);if(match)return text.replace(trimmed,values[code].replace(/\{(\d+)\}/g,(_,index)=>translateText(match[Number(index)],code)));}
 // Composed captions retain separators, dates, counts, and equipment identifiers.
 let result=text;
 for(const [original,translations] of entries){
  if(original.length<2||!translations[code])continue;
  if(result.includes(original))result=result.split(original).join(translations[code]);
 }
 if(/[가-힣]/.test(result)){missing.add(trimmed);return text;}
 return result;
}
export function t(key,params={}){return translateText(key).replace(/\{(\w+)\}/g,(_,name)=>params[name]??`{${name}}`);}
function remember(node,key,current){
 let entry=originals.get(node);if(!entry){entry={};originals.set(node,entry);}
 const previous=entry[key];
 if(!previous||current!==previous.rendered)entry[key]={original:current,rendered:current};
 return entry[key];
}
function translateNode(node){
 if(node.nodeType===3){
  if(node.parentElement?.closest('script,style,[data-no-translate],.english,[data-guide-caption]'))return;
  const record=remember(node,'text',node.nodeValue);const value=translateText(record.original);
  if(node.nodeValue!==value)node.nodeValue=value;record.rendered=value;return;
 }
 if(node.nodeType!==1||node.closest('[data-no-translate]'))return;
 // Implicit option values follow textContent; freeze the original before translating labels.
 if(node.tagName==='OPTION'&&!node.hasAttribute('value'))node.setAttribute('value',node.textContent);
 for(const attr of ['aria-label','title','placeholder','alt']){
  if(!node.hasAttribute(attr))continue;
  const record=remember(node,attr,node.getAttribute(attr)),value=translateText(record.original);
  if(node.getAttribute(attr)!==value)node.setAttribute(attr,value);record.rendered=value;
 }
 if(node.matches('[data-app-language]'))node.value=locale;
}
export function refreshLocalization(){
 if(!root)return;
 observer?.disconnect();
 translateNode(root);
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);while(walker.nextNode())translateNode(walker.currentNode);
 document.documentElement.lang=locales[locale];
 observer?.observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','placeholder','alt']});
}
export function setLocale(code){
 code=normalize(code);if(!Object.hasOwn(locales,code))return false;
 const changed=locale!==code;locale=code;missing.clear();
 try{globalThis.localStorage?.setItem(storageKey,code);}catch{/* Selection still works for this session. */}
 refreshLocalization();
 if(changed)document.dispatchEvent(new CustomEvent('app-language-change',{detail:{locale:code,language:code}}));
 return true;
}
export function initLocalization(element=document.body){
 root=element;
 observer=new MutationObserver(records=>{
  for(const record of records){if(record.type==='childList')record.addedNodes.forEach(node=>pendingNodes.add(node));else pendingNodes.add(record.target);}
  if(scheduled)return;scheduled=true;
  queueMicrotask(()=>{
   scheduled=false;observer.disconnect();
   for(const node of pendingNodes){if(!node.isConnected)continue;translateNode(node);if(node.nodeType===1){const walker=document.createTreeWalker(node,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);while(walker.nextNode())translateNode(walker.currentNode);}}
   pendingNodes.clear();observer.observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','placeholder','alt']});
  });
 });
 document.addEventListener('change',event=>{if(event.target.matches('[data-app-language]'))setLocale(event.target.value);});
 document.addEventListener('kiosk-language-change',event=>setLocale(event.detail.language));
 refreshLocalization();
 return {refresh:refreshLocalization,missing:()=>[...missing]};
}
export function untranslatedCopy(){return [...missing];}
