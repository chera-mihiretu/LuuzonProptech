"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { userCollection } from "@/db/collections";

/**
 * Updates the last_sign_in timestamp for the current user
 * This is called when dashboards are loaded to track user activity
 */
export async function updateLastSignIn() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || !session.user || !session.user.id) {
            return {
                success: false,
                message: "No active session found"
            };
        }

        // Update last_sign_in timestamp
        const result = await userCollection.updateOne(
            { user_id: session.user.id },
            { $set: { last_sign_in: new Date() } }
        );

        if (result.matchedCount === 0) {
            return {
                success: false,
                message: "User profile not found"
            };
        }

        return {
            success: true,
            message: "Last sign in updated successfully"
        };
    } catch (error) {
        const err = error as Error;
        console.error("Error updating last_sign_in:", err);
        return {
            success: false,
            message: err.message || "Error updating last sign in"
        };
    }
}

