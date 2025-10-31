import { betterAuth, email } from "better-auth";
import { client } from "../db/db";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { sendMailLink, sendMailOTP, sendMailResetLink } from "@/services/email/nodemailer";
import { emailOTP } from "better-auth/plugins";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "@/app/config/envs";
const db = client.db();

export const auth = betterAuth({
    socialProviders: {
        google: { 
            clientId: GOOGLE_CLIENT_ID, 
            clientSecret: GOOGLE_CLIENT_SECRET, 
        }, 
    },
    
    emailVerification: {
        
         sendVerificationEmail: async ({ user, url }) => {
            try{
                await sendMailLink({email: user.email, name: user.name, url});
            } catch(e) {
                console.log(e)
            }
        },
        sendOnSignUp: true
    },

    emailAndPassword: {
        requireEmailVerification: true,
        enabled: true,
        sendResetPassword: async ({ user, url }, request) => {
            await sendMailResetLink({email: user.email, name: user.name, url});
        }
    },

    database: mongodbAdapter(db, {
        client
    }),
    plugins: [
        nextCookies(), 
        
    ]
}); 