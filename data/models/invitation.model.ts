import { ObjectId } from "mongodb";

type InvitationStatus = "pending" | "accepted" | "rejected" | "canceled";

export interface InvitationModel {
    _id?: ObjectId;
    agency_owner_id?: string;
    token?: string;
    agency_manager?: string;
    agency_name?: string;
    invited_person_email?: string;
    created_at?: Date;
    expires_at?: Date;
    status?: InvitationStatus;
}