'use server';

import { PropertyModel } from "@/data/models/property.model";
import { getMeSession, validateAuthorization } from "../../authorization/role-validation";
import { UserRoles } from "@/data/constants";
import { redirect } from "next/navigation";
import MY_ROUTES from "@/data/routes";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { agencyPropertiesCollection, userCollection } from "@/db/collections";
import { UserModel } from "@/data/models/user.model";
import { ObjectId } from "mongodb";

export async function addProperty(propertyData: PropertyModel) {
    try {
        // Validate authorization
        const allowed = await validateAuthorization(UserRoles.AGENCY_MANAGER);
        if (!allowed) {
            return {
                success: false,
                message: "You are not authorized to add properties"
            };
        }

        

        const session = await getMeSession();
        const userId = session.user.id;

        // Get user to extract agency_id
        const user: UserModel | null = await userCollection.findOne<UserModel | null>({
            user_id: userId
        });

        if (!user || !user.agency?._id) {
            return {
                success: false,
                message: "User or agency not found"
            };
        }

        // Prepare property data with user_id and agency_id
        const property: PropertyModel = {
            agency_id: user.agency._id,
            user_id: userId,
            ...propertyData,
            created_at: new Date(),
            updated_at: new Date(),
        };

        const result = await agencyPropertiesCollection.insertOne(property);
        return {
            success: true,
            message: "Property added successfully",
            data: {
                acknowledged: result.acknowledged,
                insertedId: result.insertedId.toString()
            }
        };
    } catch (e) {
        const error = e as Error;
        return {
            success: false,
            message: error.message || "Error adding property"
        };
    }
}