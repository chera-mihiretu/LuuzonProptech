"use server";

import { auth } from "@/lib/auth";
import { tenantRegistrationFormSchema } from "@/app/zod_validation/auth_validation";

export async function registerUserEmail(email: string, password: string, name: string)  {
    // Server-side validation using existing schema (without confirmPassword)
    const serverSchema = tenantRegistrationFormSchema.omit({ confirmPassword: true });

    const validation = serverSchema.safeParse({ name, email, password });
    if (!validation.success) {
        const firstIssue = validation.error.issues[0];
        return {
            success: false,
            message: firstIssue?.message || "Invalid input. Please check your entries.",
        };
    }

    try{

        const user = await auth.api.signUpEmail({
            body : {
                email,
                password,
                name
            }
        });


        return {
            success: true,
            message: "Account created succesfully, Please check your for verification !"
        }
        
 
    } catch (e) {
        
        const error = e as Error;
        return {
            success: false, 
            message: error.message || "Unkown Error"
        }
    }

    
}