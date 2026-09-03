'use client';
import {useEffect,useState} from 'react';
export default function Page(){
 const [p,setP]=useState<any>({}),[msg,setMsg]=useState('');
 useEffect(()=>{fetch('/api/profile').then(r=>r.json()).then(setP)},[]);
 async function save(){setMsg('Saving...');const r=await fetch('/api/profile',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(p)});setMsg(r.ok?'Profile saved!':'Could not save');}
 return <main className="mx-auto max-w-3xl p-6 md:p-10"><div className="card p-6 md:p-8"><h1 className="text-3xl font-bold">Profile</h1><p className="mt-2 text-zinc-400">Your public creator profile appears on birthday pages.</p>
 <div className="mt-6 grid gap-5"><div className="flex items-center gap-5"><div className="h-20 w-20 overflow-hidden rounded-full bg-white/10">{p.avatarUrl?<img src={p.avatarUrl} className="h-full w-full object-cover"/>:<div className="grid h-full place-items-center text-2xl">👤</div>}</div><input className="flex-1" placeholder="Avatar image URL" value={p.avatarUrl||''} onChange={e=>setP({...p,avatarUrl:e.target.value})}/></div>
 <label>Display name<input className="mt-1" value={p.name||''} onChange={e=>setP({...p,name:e.target.value})}/></label>
 <label>Bio<textarea className="mt-1" rows={5} value={p.bio||''} onChange={e=>setP({...p,bio:e.target.value})}/></label>
 <button className="btn" onClick={save}>Save Profile</button>{msg&&<p className="text-emerald-400">{msg}</p>}</div></div></main>
}
