import {NextResponse} from 'next/server'; import {cookies} from 'next/headers'; import {getSessionUser} from '@/lib/auth'; import {db} from '@/lib/db';
export const runtime='nodejs';
export async function GET(req:Request){
 const u=await getSessionUser();const q=new URL(req.url).searchParams;if(!u)return NextResponse.redirect(new URL('/login',req.url));
 if(q.get('state')!==cookies().get('bb_google_photos_state')?.value)return NextResponse.json({error:'Invalid OAuth state'},{status:400});
 const code=q.get('code');if(!code)return NextResponse.json({error:'Missing code'},{status:400});
 const redirect=process.env.GOOGLE_PHOTOS_REDIRECT_URI||new URL('/api/google-photos/callback',req.url).toString();
 const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({code,client_id:process.env.GOOGLE_PHOTOS_CLIENT_ID||'',client_secret:process.env.GOOGLE_PHOTOS_CLIENT_SECRET||'',redirect_uri:redirect,grant_type:'authorization_code'})});
 if(!r.ok)return NextResponse.json({error:'Google OAuth failed',detail:await r.text()},{status:400});
 const token=await r.json();const profile=u.profile||{};const settings={...(profile.settings||{}),googlePhotos:{accessToken:token.access_token,refreshToken:token.refresh_token,expiresAt:Date.now()+Number(token.expires_in||3600)*1000}};
 await db.profile.update({where:{id:u.id},data:{settings}});const rawReturn=cookies().get('bb_google_photos_return')?.value||'/dashboard';const returnTo=rawReturn.startsWith('/')&&!rawReturn.startsWith('//')?rawReturn:'/dashboard';return NextResponse.redirect(new URL(returnTo+(returnTo.includes('?')?'&':'?')+'googlePhotos=connected',req.url));
}