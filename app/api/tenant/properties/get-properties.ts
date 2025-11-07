'use server';

import { agencyPropertiesCollection } from "@/db/collections";
import { validateAuthorization } from "@/app/api/authorization/role-validation";
import { UserRoles } from "@/data/constants";
import { PropertyModel } from "@/data/models/property.model";

export async function getTenantProperties(page: number = 1, limit: number = 12) {
  const allowed = await validateAuthorization([UserRoles.TENANT]);
  
  if (!allowed) {
    return {
      success: false,
      message: "You are not authorized to view properties",
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: limit
      }
    };
  }

  // Calculate skip for pagination
  const skip = (page - 1) * limit;
  
  // Query for all listed properties (from all agencies)
  const baseQuery: any = { status: 'listed' };

  // Get total count for pagination
  const totalItems = await agencyPropertiesCollection.countDocuments(baseQuery);
  const totalPages = Math.ceil(totalItems / limit);
  
  // Fetch properties with pagination
  const properties: PropertyModel[] = await agencyPropertiesCollection
    .find<PropertyModel>(baseQuery)
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

export async function getTenantPropertyById(propertyId: string) {
  try {
    const allowed = await validateAuthorization([UserRoles.TENANT]);

    if (!allowed) {
      return {
        success: false,
        message: "You are not authorized to view properties",
        data: null
      };
    }

    const { ObjectId } = await import("mongodb");
    
    // Convert string ID to ObjectId
    let objectId;
    try {
      objectId = new ObjectId(propertyId);
    } catch (error) {
      return {
        success: false,
        message: "Invalid property ID",
        data: null
      };
    }

    // Find the property (only listed properties)
    const property = await agencyPropertiesCollection.findOne<PropertyModel>({
      _id: objectId,
      status: 'listed'
    });

    if (!property) {
      return {
        success: false,
        message: "Property not found or not available",
        data: null
      };
    }

    // Serialize MongoDB objects to plain objects for Client Components
    const serializedProperty = {
      ...property,
      _id: property._id?.toString(),
      agency_id: property.agency_id?.toString(),
      created_at: property.created_at?.toISOString(),
      updated_at: property.updated_at?.toISOString(),
    };

    return {
      success: true,
      data: serializedProperty
    };
  } catch (e) {
    const error = e as Error;
    return {
      success: false,
      message: error.message || "Error fetching property",
      data: null
    };
  }
}


