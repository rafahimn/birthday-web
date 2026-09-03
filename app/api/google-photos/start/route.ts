import {NextResponse} from 'next/server'; import {getSessionUser} from '@/lib/auth';
export const runtime='nodejs';
export async function GET(req:Request){
 const u=await getSessionUser();if(!u)return NextResponse.redirect(new URL('/login',req.url));
 const id=process.env.GOOGLE_PHOTOS_CLIENT_ID, redirect=process.env.GOOGLE_PHOTOS_REDIRECT_URI||new URL('/api/google-photos/callback',req.url).toString();
 if(!id)return NextResponse.json({error:'Google Photos is not configured. Add GOOGLE_PHOTOS_CLIENT_ID and GOOGLE_PHOTOS_CLIENT_SECRET.'},{status:503});
 const state=crypto.randomUUID(); const returnTo=new URL(req.url).searchParams.get('returnTo')||'/dashboard'; const url=new URL('https://accounts.google.com/o/oauth2/v2/auth');
 url.searchParams.set('client_id',id);url.searchParams.set('redirect_uri',redirect);url.searchParams.set('response_type','code');url.searchParams.set('scope','https://www.googleapis.com/auth/photospicker.mediaitems.readonly');url.searchParams.set('access_type','offline');url.searchParams.set('prompt','consent');url.searchParams.set('state',state);
 const res=NextResponse.redirect(url);res.cookies.set('bb_google_photos_state',state,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:600});res.cookies.set('bb_google_photos_return',returnTo,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:600});return res;
}