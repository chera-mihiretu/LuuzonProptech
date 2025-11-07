'use server';
import { getMeSession, validateAuthorization } from "@/app/api/authorization/role-validation";
import { userCollection } from "@/db/collections";
import { UserModel } from "@/data/models/user.model";
import { UserRoles } from "@/data/constants";

export async function getTenantDossier() {
    try {
        const session = await getMeSession();
        const userId = session.user.id;

        const user: UserModel | null = await userCollection.findOne<UserModel | null>({
            user_id: userId
        });

        if (!user) {
            return {
                success: false,
                message: "User not found"
            };
        }

        return {
            success: true,
            data: user.dossier || null,
            userEmail: session.user.email || user.email,
            userId: userId
        };
    } catch (error) {
        console.error("Error fetching dossier:", error);
        return {
            success: false,
            message: "Failed to fetch dossier"
        };
    }
}

