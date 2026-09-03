import {db} from '@/lib/db';
export async function getGooglePhotosToken(user:any){
 const gp=user.profile?.settings?.googlePhotos;if(!gp?.accessToken)return null;
 if(!gp.expiresAt||Date.now()<Number(gp.expiresAt)-60000)return gp.accessToken;
 if(!gp.refreshToken||!process.env.GOOGLE_PHOTOS_CLIENT_ID||!process.env.GOOGLE_PHOTOS_CLIENT_SECRET)return gp.accessToken;
 const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:process.env.GOOGLE_PHOTOS_CLIENT_ID,client_secret:process.env.GOOGLE_PHOTOS_CLIENT_SECRET,refresh_token:gp.refreshToken,grant_type:'refresh_token'})});
 if(!r.ok)return gp.accessToken; const t=await r.json(); const settings={...(user.profile?.settings||{}),googlePhotos:{...gp,accessToken:t.access_token,expiresAt:Date.now()+Number(t.expires_in||3600)*1000}};
 await db.profile.update({where:{id:user.id},data:{settings}}).catch(()=>{}); return t.access_token;
}
