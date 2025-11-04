'use server';

import { PropertyModel } from "@/data/models/property.model";
import { getMeSession, validateAuthorization } from "../../authorization/role-validation";
import { UserRoles } from "@/data/constants";

import { agencyPropertiesCollection, userCollection } from "@/db/collections";
import { UserModel } from "@/data/models/user.model";
import { ObjectId } from "mongodb";
import { deleteMultipleFromSupabase } from "@/lib/supabase";


export async function addProperty(propertyData: PropertyModel) {
    try {
        // Validate authorization
        const allowed = await validateAuthorization([UserRoles.AGENCY_MANAGER]);
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


export async function getMyProperties(page: number = 1, limit: number = 12) {
    const allowed = await validateAuthorization([UserRoles.AGENCY_MANAGER, UserRoles.AGENCY_STAFF]);

    if (!allowed) {
        return {
            success: false,
            message: "You are not authorized to get properties",
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
    const userId = session.user.id;
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const totalItems = await agencyPropertiesCollection.countDocuments({ user_id: userId });
    const totalPages = Math.ceil(totalItems / limit);
    
    // Fetch properties with pagination
    const properties : PropertyModel[] = await agencyPropertiesCollection
        .find<PropertyModel>({ user_id: userId })
        .sort({ created_at: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit)
        .toArray();
    
    // Serialize MongoDB objects to plain objects for Client Components
    const serializedProperties = properties.map(property => ({
        ...property,
        _id: property._id?.toString(),
        agency_id: property.agency_id?.toString(),
        created_at: property.created_at?.toISOString(),
        updated_at: property.updated_at?.toISOString(),
    }));
    
    return {
        success: true,
        data: serializedProperties,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit
        }
    };
}

export async function deleteProperty(propertyId: string) {
    try {
        // Validate authorization - only AGENCY_MANAGER can delete
        const allowed = await validateAuthorization([UserRoles.AGENCY_MANAGER]);
        if (!allowed) {
            return {
                success: false,
                message: "You are not authorized to delete properties. Only Agency Managers can delete properties."
            };
        }

        const session = await getMeSession();
        const userId = session.user.id;

        // Convert string ID to ObjectId
        let objectId: ObjectId;
        try {
            objectId = new ObjectId(propertyId);
        } catch (error) {
            return {
                success: false,
                message: "Invalid property ID"
            };
        }

        // Find the property to verify ownership and get image URLs
        const property = await agencyPropertiesCollection.findOne<PropertyModel>({
            _id: objectId,
            user_id: userId
        });

        if (!property) {
            return {
                success: false,
                message: "Property not found or you don't have permission to delete it"
            };
        }

        // Delete images from Supabase if they exist
        if (property.property_images && property.property_images.length > 0) {
            const imageUrls = property.property_images
                .map(img => img.url)
                .filter((url): url is string => !!url);

            if (imageUrls.length > 0) {
                try {
                    // Extract bucket name and file paths from Supabase URLs
                    // URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
                    // Example: https://...supabase.co/storage/v1/object/public/luuzo_proptech/properties/uuid.jpg
                    // We need: bucket = "luuzo_proptech", path = "properties/uuid.jpg"
                    let bucketName: string | null = null;
                    const filePaths = imageUrls.map(url => {
                        try {
                            // Find the '/public/' part in the URL
                            const publicIndex = url.indexOf('/public/');
                            if (publicIndex === -1) {
                                console.warn('Could not find /public/ in URL:', url);
                                return null;
                            }
                            
                            // Extract everything after '/public/'
                            // Format: bucket/path, e.g., "luuzo_proptech/properties/uuid.jpg"
                            const afterPublic = url.substring(publicIndex + '/public/'.length);
                            
                            // Split by '/' to separate bucket name from path
                            const parts = afterPublic.split('/');
                            
                            if (parts.length < 2) {
                                console.warn('Invalid URL format, expected bucket/path:', url);
                                return null;
                            }
                            
                            // First part is the bucket name
                            const bucket = parts[0];
                            if (!bucketName) {
                                bucketName = bucket;
                            } else if (bucketName !== bucket) {
                                console.warn(`Bucket mismatch: expected ${bucketName}, got ${bucket} in URL:`, url);
                            }
                            
                            // Skip the bucket name (first part) and join the rest as the path
                            // Example: ["luuzo_proptech", "properties", "uuid.jpg"] -> "properties/uuid.jpg"
                            const path = parts.slice(1).join('/');
                            
                            if (!path) {
                                console.warn('Empty path extracted from URL:', url);
                                return null;
                            }
                            
                            return { bucket, path };
                        } catch (error) {
                            console.error('Error extracting path from URL:', url, error);
                            return null;
                        }
                    }).filter((item): item is { bucket: string; path: string } => item !== null);

                    if (filePaths.length === 0 || !bucketName) {
                        console.warn('No valid file paths extracted from URLs or bucket name not found:', imageUrls);
                        return;
                    }

                    // Group paths by bucket (in case there are multiple buckets, though unlikely)
                    const pathsByBucket = new Map<string, string[]>();
                    filePaths.forEach(({ bucket, path }) => {
                        if (!pathsByBucket.has(bucket)) {
                            pathsByBucket.set(bucket, []);
                        }
                        pathsByBucket.get(bucket)!.push(path);
                    });

                    console.log('Original URLs:', imageUrls);
                    console.log('Extracted bucket:', bucketName);
                    console.log('Extracted file paths for deletion:', pathsByBucket);

                    // Delete files from each bucket
                    let totalDeleted = 0;
                    for (const [bucket, paths] of pathsByBucket.entries()) {
                        console.log(`Deleting ${paths.length} files from bucket "${bucket}"`);
                        const deletedCount = await deleteMultipleFromSupabase(bucket, paths);
                        totalDeleted += deletedCount;
                        console.log(`Deleted ${deletedCount} out of ${paths.length} files from bucket "${bucket}"`);
                    }
                    
                    console.log(`Total deleted: ${totalDeleted} out of ${imageUrls.length} images from Supabase`);
                    
                    if (totalDeleted < imageUrls.length) {
                        console.warn(`Warning: Only ${totalDeleted} out of ${imageUrls.length} files were deleted from Supabase.`);
                    }
                    // Continue even if some images fail to delete - we still want to delete the property
                } catch (error) {
                    console.error('Error deleting images from Supabase:', error);
                    // Continue with property deletion even if image deletion fails
                }
            }
        }

        // Delete the property from MongoDB
        const result = await agencyPropertiesCollection.deleteOne({
            _id: objectId,
            user_id: userId
        });

        if (result.deletedCount === 0) {
            return {
                success: false,
                message: "Failed to delete property. Property may not exist or you don't have permission."
            };
        }

        return {
            success: true,
            message: "Property deleted successfully"
        };
    } catch (e) {
        const error = e as Error;
        return {
            success: false,
            message: error.message || "Error deleting property"
        };
    }
}