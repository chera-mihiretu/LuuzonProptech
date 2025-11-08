"use server";

import { auth } from "@/lib/auth";

export async function login(email: string, password: string) {
    try{
        const user = await auth.api.signInEmail({
            body: {
                email,
                password
                
            }
        });
        
        return {
            success: true, 
            message: "Log in success full", 
            user
        };
        
    } catch (e) {
        const error = e as Error;
        return {
            success : false, 
            message: error.message || "Unkown Error"
        }

    }
    
}