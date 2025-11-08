'use server';

import { getMeSession, validateAuthorization } from "@/app/api/authorization/role-validation";
import { applicationsCollection, agencyPropertiesCollection, userCollection } from "@/db/collections";
import { ApplicationModel, ApplicationStatus } from "@/data/models/application.model";
import { PropertyModel } from "@/data/models/property.model";
import { UserModel, TenantDossier } from "@/data/models/user.model";
import { UserRoles } from "@/data/constants";
import { ObjectId } from "mongodb";

interface ApplicationWithDetails {
    id: string;
    tenant_id: string;
    property_id: string;
    status: ApplicationStatus;
    created_at: string;
    updated_at: string;
    property?: {
        _id: string;
        agency_id?: string;
        user_id?: string;
        title?: string;
        description?: string;
        price?: number;
        currency?: string;
        status?: 'listed' | 'rented' | 'archived';
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        property_images?: any[];
        amenities?: string;
        unique_link?: string;
        created_at?: string;
        updated_at?: string;
    };
    tenant?: {
        _id: string;
        name: string;
        email: string;
        dossier?: TenantDossier;
    };
}

export async function getAgencyApplications(page: number = 1, limit: number = 10) {
    try {
        const allowed = await validateAuthorization([UserRoles.AGENCY_MANAGER, UserRoles.AGENCY_STAFF]);

        if (!allowed) {
            return {
                success: false,
                message: "You are not authorized to view applications",
                data: [],
                pagination: {
                    currentPage: 1,
                    totalPages: 0,
                    totalItems: 0,
                    itemsPerPage: limit
                }
            };
        }

        const session = await getMeSession();
        if (!session || !session.user) {
            return {
                success: false,
                message: "Session not found",
                data: [],
                pagination: {
                    currentPage: 1,
                    totalPages: 0,
                    totalItems: 0,
                    itemsPerPage: limit
                }
            };
        }

        const userId = session.user.id;

        // Get all properties owned by this agency
        const agencyProperties = await agencyPropertiesCollection
            .find<PropertyModel>({ user_id: userId })
            .toArray();

        if (agencyProperties.length === 0) {
            return {
                success: true,
                message: "No applications found",
                data: [],
                pagination: {
                    currentPage: 1,
                    totalPages: 0,
                    totalItems: 0,
                    itemsPerPage: limit
                }
            };
        }

        // Filter out any properties without _id
        const propertyIds = agencyProperties
            .map(p => p._id)
            .filter((id): id is ObjectId => id !== undefined && id !== null);

        // Calculate skip for pagination
        const skip = (page - 1) * limit;

        // If no valid property IDs, return empty result
        if (propertyIds.length === 0) {
            return {
                success: true,
                message: "No applications found",
                data: [],
                pagination: {
                    currentPage: 1,
                    totalPages: 0,
                    totalItems: 0,
                    itemsPerPage: limit
                }
            };
        }

        // Get total count for pagination
        const totalItems = await applicationsCollection.countDocuments({
            property_id: { $in: propertyIds }
        });
        const totalPages = Math.ceil(totalItems / limit);

        // Fetch applications with pagination
        const applications = await applicationsCollection
            .find<ApplicationModel>({
                property_id: { $in: propertyIds }
            })
            .sort({ created_at: -1 }) // Sort by newest first
            .skip(skip)
            .limit(limit)
            .toArray();

        // Fetch related properties and tenants
        const applicationsWithDetails: ApplicationWithDetails[] = await Promise.all(
            applications.map(async (app) => {
                // Fetch property
                const property = await agencyPropertiesCollection.findOne<PropertyModel>({
                    _id: app.property_id
                });

                // Fetch tenant with dossier
                const tenant = await userCollection.findOne<UserModel>({
                    _id: app.tenant_id
                });

                // Serialize property
                const serializedProperty = property && property._id ? {
                    ...property,
                    _id: property._id.toString(),
                    agency_id: property.agency_id?.toString(),
                    created_at: property.created_at?.toISOString(),
                    updated_at: property.updated_at?.toISOString(),
                } : undefined;

                // Serialize tenant (dossier is already a plain object, but ensure it's serializable)
                const serializedTenant = tenant && tenant._id ? {
                    _id: tenant._id.toString(),
                    name: tenant.name,
                    email: tenant.email,
                    dossier: tenant.dossier ? JSON.parse(JSON.stringify(tenant.dossier)) : undefined
                } : undefined;

                return {
                    id: (app as any)._id?.toString() || '',
                    tenant_id: app.tenant_id.toString(),
                    property_id: app.property_id.toString(),
                    status: app.status,
                    created_at: app.created_at?.toISOString() || new Date().toISOString(),
                    updated_at: app.updated_at?.toISOString() || new Date().toISOString(),
                    property: serializedProperty,
                    tenant: serializedTenant
                };
            })
        );

        return {
            success: true,
            message: "Applications fetched successfully",
            data: applicationsWithDetails,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage: limit
            }
        };
    } catch (error) {
        console.error("Error fetching applications:", error);
        return {
            success: false,
            message: "Failed to fetch applications",
            data: [],
            pagination: {
                currentPage: 1,
                totalPages: 0,
                totalItems: 0,
                itemsPerPage: limit
            }
        };
    }
}

