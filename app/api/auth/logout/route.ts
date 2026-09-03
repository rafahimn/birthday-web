export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import {NextResponse} from 'next/server';import {sessionCookie} from '@/lib/auth';export async function GET(req:Request){const r=NextResponse.redirect(new URL('/',req.url));r.cookies.set(sessionCookie,'',{httpOnly:true,expires:new Date(0),path:'/'});return r}