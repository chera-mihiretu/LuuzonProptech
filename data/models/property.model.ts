import { ObjectId } from "mongodb";

export interface PropertyModel {
    _id?: ObjectId; 
    agency_id?: ObjectId;
    user_id?: string;    
    title?: string; 
    description?: string; 
    price?: number; 
    currency?: string; 
    status: 'listed' | 'rented' | 'archived';     
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    location_point?: GeoJsonPoint; 
    property_images?: PropertyImage[]; 
    amenities?: string; 
    unique_link?: string; 
    created_at?: Date; 
    updated_at?: Date; 
}

interface GeoJsonPoint {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
}

interface PropertyImage {
    url: string;
    description?: string;
}