"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { UserModel } from "@/data/models/user.model";
import { UserRoles } from "@/data/constants";
import { userCollection } from "@/db/collections";
import { createAdminForTheApp } from "../register/register";
import { ObjectId } from "mongodb";


export async function saveUserAsTenant() {
    const session = await auth.api.getSession({
        headers : await headers()
    });

    if (!session) {
        redirect('/login')
    }

    const count = await userCollection.countDocuments() 
    
    if (count === 0) {
        return createAdminForTheApp(session.user.id, session.user.name, session.user.email);
    }

    const user : UserModel = {
        user_id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: UserRoles.TENANT, 
        created_at: new Date(),        
    }

    try {
        await userCollection.insertOne(
            user
        )
        return {
            success: true, 
            message: "Success"
        }
    } catch (e) {
        const error = e as Error;
        return {
            success: false, 
            message: "Error while creating user " + error.message
        }
    }

}

export async function saveUserAsAgency(
    agencyName : string, address : string, 
    agencyEmail : string, siren : string,
    managerName: string) {
   
    const session = await auth.api.getSession({
        headers : await headers()
    });


    if (!session) {
        redirect('/login')
    }

    const count = await userCollection.countDocuments() 
    
    if (count === 0) {
        return createAdminForTheApp(session.user.id, session.user.name, session.user.email);
    }
    const user : UserModel = {
        user_id: session.user.id,
        email: session.user.email,
        name: session.user.name, 
        agency: {
            _id: new ObjectId(),
            name: agencyName,
            email: agencyEmail,
            address: address,
            siren_siret: siren,
            manager_name: managerName
        },
        role: UserRoles.AGENCY_MANAGER, 
        created_at: new Date(),        
    }

    try {
        await userCollection.insertOne(
            user
        )
        

        return {
            success: true, 
            message: "Success"
        }
    } catch (e) {
        const error = e as Error;
        return {
            success: false, 
            message: "Error while creating user " + error.message
        }
    }
}