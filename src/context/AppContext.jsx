import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import {readStorage,writeStorage} from '../lib/storage'; import {THEMES} from '../lib/theme';
const C=createContext(null); const defaults={theme:'Teal',prefs:{lang:'fa',fontSize:'medium'},security:{pinHash:null,bioEnabled:false},ledger:[],incomes:[],invoices:[],customers:[],inventory:[],invoiceBrand:{issuer:'',phone:'',address:'',taxId:'',note:'با سپاس از خرید شما',logo:null}};
export function AppProvider({children}){const [ready,setReady]=useState(false),[activeTab,setActiveTab]=useState('dashboard');const [state,setState]=useState(defaults);const [isLocked,setIsLocked]=useState(false);
 useEffect(()=>{const n={};Object.entries(defaults).forEach(([k,v])=>n[k]=readStorage(k,v));setState(n);setIsLocked(Boolean(n.security.pinHash));setReady(true)},[]);
 const set=(key,value)=>setState(s=>{const v=typeof value==='function'?value(s[key]):value;writeStorage(key,v);return {...s,[key]:v}});
 const changeTheme=theme=>set('theme',theme); const changeLang=lang=>set('prefs',p=>({...p,lang})); const setSecurity=security=>set('security',security);
 const qty=item=>Number(item.stock||0)+(item.moves||[]).reduce((a,m)=>a+(m.type==='in'?1:-1)*Number(m.qty||0),0); const low=item=>Number(item.minStock)>0&&qty(item)<=Number(item.minStock);
 const value=useMemo(()=>({...state,ready,activeTab,setActiveTab,isLocked,setIsLocked,currentTheme:THEMES[state.theme]||THEMES.Teal,lang:state.prefs.lang,fontSize:state.prefs.fontSize,changeTheme,changeLang,setSecurity,setLedger:v=>set('ledger',v),setIncomes:v=>set('incomes',v),setInvoices:v=>set('invoices',v),setCustomers:v=>set('customers',v),setInventory:v=>set('inventory',v),setInvoiceBrand:v=>set('invoiceBrand',v),getItemCurrentQty:qty,isLowStock:low}),[state,ready,activeTab,isLocked]);
 return <C.Provider value={value}>{children}</C.Provider>}
export const useApp=()=>useContext(C);
