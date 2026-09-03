import {cookies} from 'next/headers'; import {db} from './db';
import bcrypt from 'bcryptjs';
const COOKIE='bb_session';
export async function getSessionUser(){const id=cookies().get(COOKIE)?.value;if(!id)return null;return db.user.findUnique({where:{id}})}
export async function requireUser(){const u=await getSessionUser();if(!u)throw new Error('UNAUTHORIZED');return u}
export async function requireAdmin(){const u=await requireUser();if(u.role!=='admin')throw new Error('FORBIDDEN');return u}
export async function hashPassword(p:string){return bcrypt.hash(p,12)}
export async function verifyPassword(p:string,h:string){return bcrypt.compare(p,h)}
export const sessionCookie=COOKIE;
