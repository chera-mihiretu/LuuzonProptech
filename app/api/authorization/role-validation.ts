import { UserRoles } from "@/data/constants";
import { UserModel } from "@/data/models/user.model";
import MY_ROUTES from "@/data/routes";
import { userCollection } from "@/db/collections";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export async function validateAuthorization(role : UserRoles) {
    const session = await auth.api.getSession({
        headers:   await headers()
    })

    if (!session) {
        redirect(MY_ROUTES.login);
    } 
    const userId = session.user.id;
    try {
        const user : UserModel | null = await userCollection.findOne<UserModel|null>({
            user_id: userId
        })
        

        if (user) {
           if (user.role === role ) {
            return true; 
           }
        }
        return false;


    } catch (e) {
        throw e;
    }
}

export async function getMeSession() {
    const session = await auth.api.getSession({
        headers:   await headers()
    })
    if (!session) {
        redirect(MY_ROUTES.login);
    }
    
    return session;
}