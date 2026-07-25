const PREFIX='acc:';
export const readStorage=(key,fallback)=>{try{const v=localStorage.getItem(PREFIX+key);return v?JSON.parse(v):fallback}catch{return fallback}};
export const writeStorage=(key,value)=>{try{localStorage.setItem(PREFIX+key,JSON.stringify(value))}catch(e){console.error('Storage error',e)}};
export const generateId=()=>crypto.randomUUID?.()||`${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
export const hashPin=async pin=>{const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(pin));return [...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,'0')).join('')};
export const exportAll=()=>Object.fromEntries(Object.keys(localStorage).filter(k=>k.startsWith(PREFIX)).map(k=>[k.slice(PREFIX.length),JSON.parse(localStorage.getItem(k))]));
