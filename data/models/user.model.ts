// Modification happens here 

import { ObjectId } from "mongodb";

// We add a new interface (2) One for agency and one for dossier 
export interface UserModel {
    _id?: ObjectId, 
    user_id: string;
    agency_owner_id?: string;
    email: string
    name: string
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

