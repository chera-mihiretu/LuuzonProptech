// Modification happens here 

import { ObjectId } from "mongodb";

// We add a new interface (2) One for agency and one for dossier 
export interface UserModel {
    _id?: ObjectId, 
    user_id: string;
    agency_owner_id?: string;
    email: string
    name: string
    dossier?: TenantDossier;
    agency?: AgencyModel;
    role: string;
    created_at: Date;
    last_sign_in?: Date;
}

export interface AgencyModel {
    _id?: ObjectId;
    name: string;
    email: string;
    address: string;
    siren_siret: string;
    manager_name: string;
    permissions?: Permissions[]
}

export enum Permissions {
    DELETE_PROPERT = 'delete_property', 
    EDIT_PROPERTY = 'edit_property', 
    ACCEPT_APPICATION = 'accept_application', 
    REJECT_APPLICATION = 'reject_application', 
    PERMISSION_EDIT = 'edit_permission',
}

export interface DossierDocument {
    url: string;
    name?: string;
    type?: string;
}

export interface TenantDossier  {
    tenant_id: string;
    avatar_url?: string;
    profileInfo: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
        address?: string;
    };
    employmentDetails: {
        job_title?: string;
        employer?: string; // e.g., 'Air France'
        salary?: number; // Exact salary
        employment_status?: EmploymentStatus;
    };
    uploaded_docs?: DossierDocument[]; // Watermarked documents (ID, proof of payment, etc.)
    shareable_link?: string; // Shareable dossier link
    ai_credit_score?: number | null; // Placeholder for AI credit scoring badge
    application_type?: ApplicationType; // e.g., applies as single
    gdpr_summary?: string; // Anonymized resume for non-logged access (Comment 7, e.g., 'First name works in aviation industry with salary range 2.5-3.5k applies as single')
}

export enum ApplicationType {
Single = 'Single',
Couple = 'Couple',
Family = 'Family',
}

export enum EmploymentStatus {
    FullTime = 'FullTime',
    PartTime = 'PartTime',
    Contract = 'Contract',
    Unemployed = 'Unemployed',
}