import {NextResponse} from 'next/server';
import {requireAdmin} from '@/lib/auth'; import {db} from '@/lib/db';
export const runtime='nodejs';
export async function GET(){try{await requireAdmin();return NextResponse.json(await db.template.findMany({orderBy:{createdAt:'desc'}}))}catch(e){return NextResponse.json({error:'Forbidden'},{status:403})}}
export async function PATCH(req:Request){try{await requireAdmin();const {id,spotlight}=await req.json();const t=await db.template.findUnique({where:{id}});if(!t)return NextResponse.json({error:'Not found'},{status:404});return NextResponse.json(await db.template.update({where:{id},data:{config:{...(t.config||{}),spotlight:!!spotlight}}}))}catch(e){return NextResponse.json({error:'Forbidden'},{status:403})}}
