import { ObjectId } from "mongodb";

export interface ApplicationModel {
    id?: ObjectId;
    tenant_id: ObjectId; 
    property_id: ObjectId;
    status: ApplicationStatus; 
    created_at?: Date; 
    updated_at?: Date; 
}

export enum ApplicationStatus {
    PENDING = 'pending', 
    ACCEPTED = 'accepted', 
    REJECTED = 'rejected', 
}   