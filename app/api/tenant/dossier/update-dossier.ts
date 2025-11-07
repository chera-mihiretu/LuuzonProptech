'use server';
import { getMeSession, validateAuthorization } from "@/app/api/authorization/role-validation";
import { userCollection } from "@/db/collections";
import { UserModel, TenantDossier } from "@/data/models/user.model";
import { UserRoles } from "@/data/constants";

export async function updateTenantDossier(dossier: TenantDossier) {
    const allow = await validateAuthorization([UserRoles.TENANT]);
    if (!allow) {
        return {
            success: false,
            message: "Not authorized"
        };
    }
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

        // Ensure tenantId is set
        const updatedDossier: TenantDossier = {
            ...dossier,
            tenant_id: dossier.tenant_id || userId
        };

        const result = await userCollection.updateOne(
            { user_id: userId },
            { $set: { dossier: updatedDossier } }
        );

        if (result.matchedCount === 0) {
            return {
                success: false,
                message: "User not found"
            };
        }

        return {
            success: true,
            message: "Dossier updated successfully",
            data: updatedDossier
        };
    } catch (error) {
        console.error("Error updating dossier:", error);
        return {
            success: false,
            message: "Failed to update dossier"
        };
    }
}

