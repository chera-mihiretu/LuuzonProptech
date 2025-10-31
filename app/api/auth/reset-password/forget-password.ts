"use server";
import { auth } from "@/lib/auth";


export async function forgetPassword (email : string, redirect : string) {
    try {
        const result = await auth.api.forgetPassword({
            body : {
                email, 
                redirectTo: redirect
            }
        })

        return {
            success : true, 
            message: "Reset link is sent to your email"
        }
    } catch (e) {
        const error = e as Error;

        return {
            success : false, 
            message: error.message
        }
    }
}