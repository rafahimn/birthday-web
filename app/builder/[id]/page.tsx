"use client";
import {useState} from 'react';
import {defaultContent} from '@/lib/types';
import {MasterTemplate} from '@/components/template/MasterTemplate';

export default function Builder(){
  const [c,setC]=useState(defaultContent);
  const [status,setStatus]=useState<null|{type:'saving'|'saved'|'publishing'|'published'|'error';msg:string}>(null);

  async function saveDraft(){
    setStatus({type:'saving',msg:'Saving...'});
    try{
      const res=await fetch('/api/websites',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(c)});
      if(!res.ok) throw new Error('failed');
      setStatus({type:'saved',msg:'Draft saved ✓'});
    }catch{
      setStatus({type:'error',msg:'Could not save draft. Try again.'});
    }
  }

  async function publish(){
    setStatus({type:'publishing',msg:'Publishing...'});
    try{
      const res=await fetch('/api/publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(c)});
      if(!res.ok) throw new Error('failed');
      setStatus({type:'published',msg:'Published! 🎉'});
    }catch{
      setStatus({type:'error',msg:'Could not publish. Try again.'});
    }
  }

  return <main className="min-h-screen p-4"><div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[380px_1fr]"><aside className="card p-5"><h1 className="text-2xl font-bold">Website Builder</h1>{[['name','Birthday Person'],['birthday','Birthday (YYYY-MM-DD)'],['greeting','Greeting'],['message','Message']].map(([k,l])=><label className="mt-4 block text-sm" key={k}>{l}<input value={(c as any)[k]} onChange={e=>setC({...c,[k]:e.target.value})} className="mt-1 w-full rounded-lg bg-zinc-900 p-3"/></label>)}<button onClick={saveDraft} disabled={status?.type==='saving'||status?.type==='publishing'} className="btn mt-6 w-full disabled:opacity-50">{status?.type==='saving'?'Saving...':'Save Draft'}</button><button onClick={publish} disabled={status?.type==='saving'||status?.type==='publishing'} className="btn btn-secondary mt-2 w-full disabled:opacity-50">{status?.type==='publishing'?'Publishing...':'Publish'}</button>{status&&<p className={`mt-3 text-sm ${status.type==='error'?'text-red-400':'text-emerald-400'}`}>{status.msg}</p>}</aside><section className="card overflow-hidden"><div className="border-b border-white/10 p-4 text-sm text-zinc-400">Live Preview</div><div className="h-[calc(100vh-5rem)] overflow-y-auto"><MasterTemplate content={c}/></div></section></div></main>;
}