import { UserRoles } from "@/data/constants";
import { UserModel } from "@/data/models/user.model";
import { userCollection } from "@/db/collections";


export async function validateAuthorization(useId : string, role : UserRoles) {
    try {
        const user : UserModel | null = await userCollection.findOne<UserModel|null>({
            userId: useId
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