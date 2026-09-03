import {NextResponse} from 'next/server'; import {getSessionUser} from '@/lib/auth'; import {getGooglePhotosToken} from '@/lib/google-photos'; import {db} from '@/lib/db';
export const runtime='nodejs';
export async function POST(){const u=await getSessionUser();if(!u)return NextResponse.json({error:'Unauthorized'},{status:401});const token=await getGooglePhotosToken(u);if(!token)return NextResponse.json({error:'Connect Google Photos first.'},{status:400});
 const r=await fetch('https://photospicker.googleapis.com/v1/sessions',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({})});
 if(!r.ok)return NextResponse.json({error:'Could not create Google Photos picker',detail:await r.text()},{status:502});return NextResponse.json(await r.json());
}