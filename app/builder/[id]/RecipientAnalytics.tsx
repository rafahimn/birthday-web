'use client';
import {useEffect,useState} from 'react';
export default function RecipientAnalytics({websiteId}:{websiteId:string}){
 const [items,setItems]=useState<any[]>([]);
 useEffect(()=>{fetch('/api/recipient-analytics?websiteId='+encodeURIComponent(websiteId)).then(r=>r.ok?r.json():null).then(j=>setItems(j?.items||[])).catch(()=>{})},[websiteId]);
 if(!items.length)return <p className="text-xs text-zinc-500">No recipient visits yet. Publish and share a personalized link.</p>;
 return <div className="space-y-2">{items.map(x=><div key={x.recipientId} className="grid grid-cols-5 gap-2 rounded-xl bg-white/5 p-2 text-xs"><span className="col-span-1 truncate">{x.recipientId}</span><span>👀 {x.views}</span><span>↗ {x.shares}</span><span>💖 {x.reactions}</span><span>✍️ {x.wishes}</span></div>)}</div>
}
