"use server";

import { auth } from "@/lib/auth";
import { tenantRegistrationFormSchema } from "@/app/zod_validation/auth_validation";
import { userCollection } from "@/db/collections";
import { UserModel } from "@/data/models/user.model";
import { UserRoles } from "@/data/constants";
import { ObjectId } from "mongodb";

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

export async function registerUserAgency(
    name: string,
    email: string,
    password: string,
    agencyName: string,
    agencyEmail: string,
    agencyAddress: string,
    sirenNumber: string
) {

   

    let success = false;
    let message = '';
    try {
        const user = await auth.api.signUpEmail({
            body: {
                name,
                email, 
                password
            }
        })
        const count = await userCollection.countDocuments() 

        if (count === 0) {
            return createAdminForTheApp(user.user.id, name, email);
        }
        const userModel : UserModel =  {
            user_id: user.user.id, 
            email: email, 
            name: name, 
            agency: {
                _id: new ObjectId(),
                name: agencyName,
                email: agencyEmail,
                address: agencyAddress,
                siren_siret: sirenNumber,
                manager_name: name
            },
            role: UserRoles.AGENCY_MANAGER, 
            created_at: new Date(),
        }

        success = true;
        message = "Account created succesfully, Please check your email for verification !"

        
        await userCollection.insertOne(userModel)
        
    } catch (e) {
        const error = e as Error;

        if (!success) message = error.message;
    }

    return {
        success, 
        message
    }

}

export async function registerUserTenant(
    name: string,
    email: string,
    password: string,
) {

    const count = await userCollection.countDocuments() 

    

    let success = false;
    let message = '';
    try {
        const user = await auth.api.signUpEmail({
            body: {
                name,
                email, 
                password
            }
        })
        if (count === 0) {
            return createAdminForTheApp(user.user.id, name, email);
        }
        const userModel : UserModel =  {
            user_id: user.user.id, 
            email: email,  
            name: name, 
            role: UserRoles.TENANT, 
            created_at: new Date(),
        }

        success = true;
        message = "Account created succesfully, Please check your email for verification !"

        
        await userCollection.insertOne(userModel as any)
        
    } catch (e) {
        const error = e as Error;

        if (!success) message = error.message;
    }

    return {
        success, 
        message
    }

}


export async function createAdminForTheApp(userId: string, name : string, email : string) {
    try {
       
        const adminUser : UserModel = {
            user_id: userId,
            agency_owner_id: userId,
            name: name, 
            role: UserRoles.ADMIN,
            email: email,
            created_at: new Date(),
        }
        await userCollection.insertOne(adminUser as any);

        return {
            success: true, 
            message: "Welcome, You are the first (Admin)",
        }
    } catch (e) {
        const error = e as Error;
        return {
            success: false, 
            message: error.message
        }
    }
}