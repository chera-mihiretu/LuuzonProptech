import { betterAuth, email } from "better-auth";
import { client } from "../db/db";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { sendMail } from "@/services/email/nodemailer";
const db = client.db();

export const auth = betterAuth({
    emailVerification: {
        
         sendVerificationEmail: async ({ user, url }) => {
            try{
                await sendMail({email: user.email, name: user.name, url});
            } catch(e) {
                console.log(e)
            }
        },
        sendOnSignUp: true
    },

    emailAndPassword: {
        requireEmailVerification: true,
        enabled: true
    },

    database: mongodbAdapter(db, {
        client
    }),
    plugins: [
        nextCookies(), 
    ]
}); 