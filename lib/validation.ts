import {z} from 'zod';
export const signupSchema=z.object({email:z.string().email(),password:z.string().min(8),name:z.string().min(2).max(80)});
export const loginSchema=z.object({email:z.string().email(),password:z.string().min(1)});
export const resetPasswordSchema=z.object({password:z.string().min(8)});
export const websiteSchema=z.object({name:z.string().min(1),birthday:z.string().min(1)}).passthrough();
