'use server';
import { getMeSession, validateAuthorization } from "@/app/api/authorization/role-validation";
import { userCollection, applicationsCollection } from "@/db/collections";
import { UserModel } from "@/data/models/user.model";
import { ApplicationModel, ApplicationStatus } from "@/data/models/application.model";
import { UserRoles } from "@/data/constants";
import { ObjectId } from "mongodb";

export async function createApplication(propertyId: string) {
    try {
        // Validate authorization
        const allow = await validateAuthorization([UserRoles.TENANT]);
        if (!allow) {
            return {
                success: false,
                message: "Not authorized"
            };
        }

        const session = await getMeSession();
        const userId = session.user.id;

        // Get user with dossier
        const user: UserModel | null = await userCollection.findOne<UserModel | null>({
            user_id: userId
        });

        if (!user) {
            return {
                success: false,
                message: "User not found"
            };
        }

        // Check if user has a dossier
        if (!user.dossier) {
            return {
                success: false,
                message: "Please complete your dossier before applying. You can update it from your profile."
            };
        }

        // Validate that dossier has required information
        const dossier = user.dossier;
        const hasRequiredInfo = 
            dossier.profileInfo?.first_name &&
            dossier.profileInfo?.last_name &&
            dossier.profileInfo?.email &&
            dossier.profileInfo?.phone &&
            dossier.employmentDetails?.job_title &&
            dossier.employmentDetails?.employer &&
            dossier.employmentDetails?.salary !== undefined &&
            dossier.employmentDetails?.employment_status;

        if (!hasRequiredInfo) {
            return {
                success: false,
                message: "Please complete all required fields in your dossier before applying. Required: Name, Email, Phone, Job Title, Employer, Salary, and Employment Status."
            };
        }

        // Check if application already exists
        const existingApplication = await applicationsCollection.findOne({
            tenant_id: user._id,
            property_id: new ObjectId(propertyId)
        });

        if (existingApplication) {
            return {
                success: false,
                message: "You have already applied for this property"
            };
        }

        // Create application
        const application: ApplicationModel = {
            tenant_id: user._id!,
            property_id: new ObjectId(propertyId),
            status: ApplicationStatus.PENDING,
            created_at: new Date(),
            updated_at: new Date()
        };

        const result = await applicationsCollection.insertOne(application as any);

        if (result.insertedId) {
            // Convert ObjectId instances to strings for client component compatibility
            return {
                success: true,
                message: "Application submitted successfully",
                data: {
                    id: result.insertedId.toString(),
                    tenant_id: application.tenant_id.toString(),
                    property_id: application.property_id.toString(),
                    status: application.status,
                    created_at: application.created_at?.toISOString(),
                    updated_at: application.updated_at?.toISOString()
                }
            };
        } else {
            return {
                success: false,
                message: "Failed to create application"
            };
        }
    } catch (error) {
        console.error("Error creating application:", error);
        return {
            success: false,
            message: "Failed to create application"
        };
    }
}

