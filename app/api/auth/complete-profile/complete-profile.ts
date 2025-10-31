"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { UserModel } from "@/data/models/user.model";
import { UserRoles } from "@/data/constants";
import { userCollection } from "@/db/collections";


export async function saveUserAsTenant() {
    const session = await auth.api.getSession({
        headers : await headers()
    });

    if (!session) {
        redirect('/login')
    }

    const user : UserModel = {
        userId: session.user.id,
        userEmail: session.user.email,
        role: UserRoles.TENANT, 
        createdAt: new Date(),        
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

    const user : UserModel = {
        userId: session.user.id,
        userEmail: session.user.email,
        agencyName: agencyName,
        managerName: managerName, 
        role: UserRoles.AGENCY_MANAGER, 
        address, 
        agencyEmail, 
        createdAt: new Date(),        
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