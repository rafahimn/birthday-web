import {NextResponse} from 'next/server'; import {getSessionUser} from '@/lib/auth'; import {getGooglePhotosToken} from '@/lib/google-photos'; import {db} from '@/lib/db'; import {supabaseStorageUpload} from '@/lib/supabase-rest';
export const runtime='nodejs';
export async function POST(req:Request){
 const u=await getSessionUser();if(!u)return NextResponse.json({error:'Unauthorized'},{status:401});
 const {websiteId,items}=await req.json();const site=await db.website.findFirst({where:{id:websiteId,userId:u.id}});if(!site)return NextResponse.json({error:'Website not found'},{status:404});
 const token=await getGooglePhotosToken(u);if(!token)return NextResponse.json({error:'Connect Google Photos first.'},{status:400});
 const selected=Array.isArray(items)?items.slice(0,20):[];const gallery=Array.isArray(site.content?.gallery)?[...site.content.gallery]:[];
 for(const item of selected){const base=item?.mediaFile?.baseUrl||item?.baseUrl;if(!base)continue;const isVideo=String(item?.mimeType||'').startsWith('video/');const r=await fetch(base+(isVideo?'=dv':'=w2048-h2048'),{headers:{Authorization:`Bearer ${token}`}});if(!r.ok)continue;const blob=await r.blob();const ext=isVideo?'mp4':'jpg';const url=await supabaseStorageUpload('birthday-builder',`users/${u.id}/google-photos/${crypto.randomUUID()}.${ext}`,new File([await blob.arrayBuffer()],`google.${ext}`,{type:blob.type||`image/${ext}`}));gallery.push({url,caption:item?.mediaMetadata?.creationTime?'Imported from Google Photos':''});}
 const updated=await db.website.update({where:{id:site.id},data:{content:{...(site.content||{}),gallery}}});return NextResponse.json({ok:true,count:gallery.length,content:updated.content});
}
