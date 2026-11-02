// Preserve complete names for assistive technology while keeping descriptors intact visually.
export function equipmentNameMarkup(value){
 const escape=text=>text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return String(value).split(/(\([^)]*\))/g).map(part=>part.startsWith('(')?`<wbr><span class="equipment-name-phrase">${escape(part)}</span>`:escape(part)).join('');
}
