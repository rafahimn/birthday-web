import { supabaseRest } from './supabase-rest';

type Where = Record<string, any>;
type Model = 'user'|'profile'|'website'|'template'|'gallery'|'music'|'video'|'timeline'|'memory'|'wishlistItem'|'guestbook'|'analyticsEvent'|'media'|'notification'|'emailTemplate'|'setting'|'demoSite'|'recipientEvent'|'collaborativeWish'|'reaction'|'referral';
const tables: Record<Model,string> = {
  user:'profiles', profile:'profiles', website:'websites', template:'templates', gallery:'gallery', music:'music', video:'videos',
  timeline:'timeline', memory:'memories', wishlistItem:'wishlist_items', guestbook:'guestbook', analyticsEvent:'analytics_events',
  media:'media', notification:'notifications', emailTemplate:'email_templates', setting:'settings', demoSite:'demo_sites', recipientEvent:'recipient_events', collaborativeWish:'collaborative_wishes', reaction:'reactions', referral:'referrals'
};
const columns: Record<string,string> = { user:'*', profile:'*', website:'*', template:'*', gallery:'*', music:'*', video:'*', timeline:'*', memory:'*', wishlistItem:'*', guestbook:'*', analyticsEvent:'*', media:'*', notification:'*', emailTemplate:'*', setting:'*', demoSite:'*', recipientEvent:'*', collaborativeWish:'*', reaction:'*', referral:'*' };

function enc(v:any){return encodeURIComponent(String(v));}
function query(where:Where={}, extra='') {
  const parts:string[]=[];
  for (const [rawKey,v] of Object.entries(where)) {
    const k=snakeKey(rawKey);
    if (v && typeof v==='object' && 'in' in v) parts.push(`${k}=in.(${v.in.map(enc).join(',')})`);
    else if (v === null) parts.push(`${k}=is.null`);
    else parts.push(`${k}=eq.${enc(v)}`);
  }
  return parts.length ? `&${parts.join('&')}` : '';
}
function snakeKey(key:string){return key.replace(/[A-Z]/g,m=>`_${m.toLowerCase()}`)}
function mapInput(data:any) {
  const out:any={};
  for(const [k,v] of Object.entries(data||{})){
    if(k==='profile' || k==='passwordHash') continue;
    const nk=snakeKey(k);
    if(k.endsWith('At') && v) out[nk]=v instanceof Date?v.toISOString():v;
    else if(k==='emailVerified') out[nk]=v?new Date(v as any).toISOString():null;
    else if(v && typeof v==='object' && !Array.isArray(v) && !(v instanceof Date)) out[nk]=v;
    else out[nk]=v;
  }
  return out;
}
function mapRow(row:any) {
  if (!row) return row;
  const out:any={...row};
  const pairs:[string,string][]=[['email_verified','emailVerified'],['created_at','createdAt'],['updated_at','updatedAt']];
  for (const [a,b] of pairs) if (a in out){out[b]=out[a]?new Date(out[a]):null;delete out[a];}
  return out;
}

class Repo {
  constructor(private model:Model) {}
  private table(){return tables[this.model]}
  async findUnique({where}:any){
    const rawKey=Object.keys(where)[0], val=where[rawKey], key=snakeKey(rawKey);
    const rows=await supabaseRest<any[]>(`${this.table()}?select=${columns[this.model]}&${key}=eq.${enc(val)}&limit=1`);
    return mapRow(rows?.[0]||null);
  }
  async findFirst({where={},orderBy}:any={}){
    let path=`${this.table()}?select=${columns[this.model]}${query(where)}&limit=1`;
    if(orderBy){const [k,dir]=Object.entries(orderBy)[0] as [string,any];path += `&order=${snakeKey(k)}.${dir==='asc'?'asc':'desc'}`}
    const rows=await supabaseRest<any[]>(path); return mapRow(rows?.[0]||null);
  }
  async findMany({where={},orderBy,select,take}:any={}){
    let path=`${this.table()}?select=${select?Object.keys(select).filter(k=>select[k]).join(','):columns[this.model]}${query(where)}`;
    if(orderBy){const [k,dir]=Object.entries(orderBy)[0] as [string,any];path += `&order=${snakeKey(k)}.${dir==='asc'?'asc':'desc'}`}
    if(take) path += `&limit=${take}`;
    const rows=await supabaseRest<any[]>(path); return (rows||[]).map(mapRow);
  }
  async create({data}:any){
    const payload=mapInput(data);
    if(this.model==='user') throw new Error('Use Supabase Auth to create users');
    const rows=await supabaseRest<any[]>(this.table(),{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)}); return mapRow(rows?.[0]);
  }
  async update({where,data}:any){
    const rawKey=Object.keys(where)[0], val=where[rawKey], key=snakeKey(rawKey);
    const payload=mapInput(data);
    for(const [k,v] of Object.entries(data||{})){
      if(v && typeof v==='object' && 'increment' in (v as any)){
        const current=await this.findUnique({where}); payload[snakeKey(k)]=Number((current as any)?.[k]||0)+Number((v as any).increment||0);
      }
    }
    const rows=await supabaseRest<any[]>(`${this.table()}?${key}=eq.${enc(val)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)}); return mapRow(rows?.[0]);
  }
  async updateMany({where,data}:any){
    const rows=await supabaseRest<any[]>(`${this.table()}?select=id${query(where).replace(/^&/,'&')}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(mapInput(data))}); return {count:rows?.length||0};
  }
  async deleteMany({where}:any){
    const rows=await supabaseRest<any[]>(`${this.table()}?select=id${query(where)}`,{method:'DELETE',headers:{Prefer:'return=representation'}}); return {count:rows?.length||0};
  }
  async count({where={}}:any={}){
    const {url,key}=(()=>{const u=process.env.NEXT_PUBLIC_SUPABASE_URL!,k=process.env.SUPABASE_SERVICE_ROLE_KEY!;return {url:u.replace(/\/$/,''),key:k}})();
    const r=await fetch(`${url}/rest/v1/${this.table()}?select=id${query(where)}&limit=1`,{headers:{apikey:key,Authorization:`Bearer ${key}`,Prefer:'count=exact'},cache:'no-store'});
    if(!r.ok) throw new Error(`Supabase count ${r.status}`); const range=r.headers.get('content-range'); return range?Number(range.split('/')[1]):(await r.json()).length;
  }
  async upsert({where,update,create}:any){
    const existing=await this.findUnique({where}); return existing ? this.update({where,data:update}) : this.create({data:create});
  }
}

const db:any={};
for(const m of Object.keys(tables) as Model[]) db[m]=new Repo(m);
export {db};
