"use client";
import {useEffect,useState} from 'react';
import type {BirthdayContent} from '@/lib/types';
export function MasterTemplate({demo=false,slug,content}:{demo?:boolean;slug?:string;content?:BirthdayContent}){
  const [screen,setScreen]=useState(0);
  const [cut,setCut]=useState(false);
  const [candles,setCandles]=useState([false,false,false]);
  const [typed,setTyped]=useState('');
  const name=content?.name || (demo?'Riya':slug?decodeURIComponent(slug):'Birthday Star');
  const greeting=content?.greeting?`${content.greeting}${content.greeting.includes(name)?'':`, ${name}`}`:`Happy Birthday, ${name}!`;
  const message=content?.message || `Every moment with ${name} is a memory worth keeping.`;
  useEffect(()=>{let i=0;setTyped('');const t=setInterval(()=>{i++;setTyped(greeting.slice(0,i));if(i>=greeting.length)clearInterval(t)},65);return()=>clearInterval(t)},[greeting]);
  const tabs=['Greeting','Cake','Reasons','Photos','Video','Letter','Secret'];
  return <main className="min-h-screen bg-gradient-to-b from-pink-950 via-fuchsia-950 to-zinc-950 px-5 py-10 text-center"><div className="mx-auto max-w-4xl"><p className="text-sm uppercase tracking-[.35em] text-pink-300">A special birthday experience</p><h1 className="mt-5 text-5xl font-black md:text-7xl">{typed}</h1><div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-8"><div className="text-8xl">🎂</div><h2 className="mt-4 text-2xl font-bold">Make a wish</h2><div className="mt-6 flex justify-center gap-3">{candles.map((b,i)=><button key={i} onClick={()=>setCandles(a=>a.map((v,j)=>j===i?!v:v))} className="text-5xl">{b?'💨':'🕯️'}</button>)}</div><button onClick={()=>setCut(true)} className="btn mt-7">{cut?'Cake Cut! 🎉':'Cut the Cake'}</button></div><div className="mt-8 flex flex-wrap justify-center gap-2">{tabs.map((x,i)=><button key={x} onClick={()=>setScreen(i)} className={`rounded-full px-4 py-2 text-sm ${screen===i?'bg-white text-black':'bg-white/10'}`}>{x}</button>)}</div><section className="card mx-auto mt-6 max-w-2xl p-7 text-left"><h3 className="text-xl font-bold">{tabs[screen]}</h3><p className="mt-3 text-zinc-300">{screen===0?message:screen===1?(cut?'Cake cut! Happy Birthday! 🎉':'Tap candles to blow them out, then cut the cake.'):screen===6?'🔐 There is a little secret waiting for you.':'This section is connected to the reusable builder content model.'}</p></section><footer className="mt-10 text-sm text-zinc-500">Birthday Builder • {demo?'Live Demo':'Published Website'}</footer></div></main>}