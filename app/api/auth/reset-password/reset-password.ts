'use server';
import { auth } from "@/lib/auth";


export async function resetPassword (password : string, token : string ) {
    try {
        const result = await auth.api.resetPassword({
            body: {
                newPassword: password, 
                token
            }
        })

        return {
            success: true, 
            message: "Password reseted succesfully"
        }
    } catch (e) {
        const error = e as Error;

        return {
            success: false, 
            message: error.message
        }
    }
}