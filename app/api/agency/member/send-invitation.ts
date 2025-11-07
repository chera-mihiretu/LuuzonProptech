'use server';
import { invitationsCollection, userCollection } from "@/db/collections"
import { getMeSession, validateAuthorization } from "../../authorization/role-validation"
import { auth } from "@/lib/auth"
import MY_ROUTES from "@/data/routes"
import { redirect } from "next/navigation"
import { UserRoles } from "@/data/constants"
import { generateInvitationToken } from "@/lib/jwt_decryption"
import { UserModel } from "@/data/models/user.model"
import { BASE_URL } from "@/app/config/envs"
import { sendInvitationMail } from "@/services/email/nodemailer"
import { headers } from "next/headers";
import { InvitationModel } from "@/data/models/invitation.model";
import { ObjectId } from "mongodb";

// Helper function to serialize MongoDB objects to plain objects
function serializeInvitation(invitation: any): any {
    return {
        _id: invitation._id?.toString() || null,
        agency_owner_id: invitation.agency_owner_id,
        token: invitation.token,
        agencyManager: invitation.agencyManager,
        agencyName: invitation.agencyName,
        invited_person_email: invitation.invited_person_email,
        created_at: invitation.created_at instanceof Date ? invitation.created_at.toISOString() : invitation.created_at,
        expires_at: invitation.expires_at instanceof Date ? invitation.expires_at.toISOString() : invitation.expires_at,
        status: invitation.status,
    };
}

// Helper function to serialize User objects to plain objects
function serializeUser(user: any): any {
    return {
        _id: user._id?.toString() || null,
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role,
        agency_owner_id: user.agency_owner_id,
        agency: user.agency ? {
            _id: user.agency._id?.toString() || null,
            name: user.agency.name,
            email: user.agency.email,
            address: user.agency.address,
            siren_siret: user.agency.siren_siret,
            manager_name: user.agency.manager_name,
            permissions: user.agency.permissions || [],
        } : undefined,
        created_at: user.created_at instanceof Date ? user.created_at.toISOString() : user.created_at,
        last_sign_in: user.last_sign_in instanceof Date ? user.last_sign_in.toISOString() : user.last_sign_in,
    };
}


export async function sendInvitation(email :string)  {
    try {
        if (!await validateAuthorization([UserRoles.AGENCY_MANAGER])) {
            return {
                success: false, 
                message: "You cannot perform this action, Not authorized"
            }
        }
        const count = await userCollection.findOne({
            userEmail: email, 
        })

        const session = await getMeSession();



        if (count) {
            return {
                success: false, 
                message: "This email is associated with account so try different email!"
            }
        }

        const user : UserModel | null = await userCollection.findOne<UserModel|null>({
            user_id: session.user.id
        })

        if (!user) {
            
            return {
                success: false, 
                message: "You cannot perform this action"
            }
        }


        const invitationToken = await generateInvitationToken(
            session.user.id, 
            email, 

        );

        const url : string = `${BASE_URL}${MY_ROUTES.register}?token=${invitationToken}`;


        
        await sendInvitationMail(
            {
                email, 
                url, 
                agencyManager: session.user.name, 
                agencyName: user.agency?.name!
            }

        )

        const invitation : InvitationModel = {
            agency_owner_id: session.user.id,
            token: invitationToken,
            agency_manager: session.user.name,
            agency_name: user.agency?.name!,
            invited_person_email: email,
            created_at: new Date(),
            expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
            status: "pending",
        }

        await invitationsCollection.updateOne({
            agency_owner_id: session.user.id,
            invited_person_email: email
        }, {
            $set: invitation
        }, {
            upsert: true
        });

        return {
            success: true, 
            message: "Invitation Sent Successfully"
        }
    } catch (e) {
        const error = e as Error;
        console.error("Error sending invitation:", error);
        return {
            success: false, 
            message: error.message
        }
    }
}



export async function getAgencyEmployees() {
    try {
        const allowed = await validateAuthorization([UserRoles.AGENCY_MANAGER, UserRoles.AGENCY_STAFF]);

        if (!allowed) {
            return {
                success: false, 
                message: "You cannot perform this action, Not authorized",
                employees: []
            }
        }

        const session = await getMeSession();
        if (!session) {
            return {
                success: false, 
                message: "You cannot perform this action, Not authorized",
                employees: []
            }
        }
        const user = await userCollection.findOne<UserModel>({user_id: session.user.id});

        const employees = await userCollection.find<UserModel>({
            $or: [
                {agency_owner_id: session.user.id},
                {user_id: user?.agency_owner_id}
            ]
           

        }).toArray();

        // Serialize MongoDB objects to plain objects
        const serializedEmployees = employees.map(serializeUser);

        return {
            success: true,
            message: "Employees fetched successfully",
            employees: serializedEmployees
        }
    } catch (e) {
        const error = e as Error;
        return {
            success: false,
            message: error.message,
            employees: []
        }
    }
}

// Permissions management
export async function getUserPermissions(targetUserId: string) {
    try {
        const allowed = await validateAuthorization([UserRoles.AGENCY_MANAGER, UserRoles.AGENCY_STAFF]);
        if (!allowed) {
            return { success: false, message: "Not authorized", permissions: [] };
        }

        const session = await getMeSession();
        const me: UserModel | null = await userCollection.findOne<UserModel | null>({ user_id: session.user.id });
        if (!me) {
            return { success: false, message: "Current user not found", permissions: [] };
        }

        const target: UserModel | null = await userCollection.findOne<UserModel | null>({ user_id: targetUserId });
        if (!target) {
            return { success: false, message: "Target user not found", permissions: [] };
        }

        if (target.agency_owner_id !== me.user_id) {
            return { success: false, message: "You cannot view permissions for this user", permissions: [] };
        }

        return { success: true, message: "Fetched", permissions: target.agency?.permissions || [] };
    } catch (e) {
        const error = e as Error;
        return { success: false, message: error.message, permissions: [] };
    }
}

export async function updateUserPermissions(targetUserId: string, permissions: any[]) {
    try {
        const allowed = await validateAuthorization([UserRoles.AGENCY_MANAGER, UserRoles.AGENCY_STAFF]);
        if (!allowed) {
            return { success: false, message: "Not authorized" };
        }

        const session = await getMeSession();
        const me: UserModel | null = await userCollection.findOne<UserModel | null>({ user_id: session.user.id });
        if (!me) {
            return { success: false, message: "Current user not found" };
        }

        const target: UserModel | null = await userCollection.findOne<UserModel | null>({ user_id: targetUserId });
        if (!target) {
            return { success: false, message: "Target user not found" };
        }

        if (target.agency_owner_id !== me.user_id) {
            return { success: false, message: "You cannot modify this user" };
        }

        // Authorization: manager always allowed; staff must have PERMISSION_EDIT
        if (me.role === UserRoles.AGENCY_STAFF) {
            const myPerms = me.agency?.permissions || [];
            const canEdit = Array.isArray(myPerms) && (myPerms.includes('PERMISSION_EDIT' as any) || myPerms.includes('permission_edit' as any));
            if (!canEdit) {
                return { success: false, message: "You have no privilege to edit permissions" };
            }
        }

        const result = await userCollection.updateOne(
            { user_id: targetUserId },
            { $set: { 'agency.permissions': permissions } }
        );

        if (result.matchedCount === 0) {
            return { success: false, message: "User not found" };
        }

        return { success: true, message: "Permissions updated" };
    } catch (e) {
        const error = e as Error;
        return { success: false, message: error.message };
    }   
}



export async function getAgencyInvitations() {
    try {
        const allowed = await validateAuthorization([UserRoles.AGENCY_MANAGER, UserRoles.AGENCY_STAFF]);

        if (!allowed) {
            return {
                success: false, 
                message: "You cannot perform this action, Not authorized",
                invitations: []
            }
        }

        const session = await getMeSession();
        if (!session) {
            return {
                success: false, 
                message: "You cannot perform this action, Not authorized",
                invitations: []
            }
        }

        const invitations = await invitationsCollection.find<InvitationModel>({
            agency_owner_id: session.user.id, 
        }).sort({ created_at: -1 }).toArray();

        // Serialize MongoDB objects to plain objects
        const serializedInvitations = invitations.map(serializeInvitation);

        return {
            success: true,
            message: "Invitations fetched successfully",
            invitations: serializedInvitations
        }
    } catch (e) {
        const error = e as Error;
        return {
            success: false,
            message: error.message,
            invitations: []
        }
    }
}