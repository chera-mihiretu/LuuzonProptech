"use server";

import { auth } from "@/lib/auth";
import { tenantRegistrationFormSchema } from "@/app/zod_validation/auth_validation";
import { userCollection, invitationsCollection } from "@/db/collections";
import { AgencyModel, UserModel } from "@/data/models/user.model";
import { UserRoles } from "@/data/constants";
import { InvitationTokenPayload, validateInvitationToken } from "@/lib/jwt_decryption";

export async function getInvitationEmail(token: string) {
  try {
    const payload = validateInvitationToken(token) as InvitationTokenPayload;
    if (payload.email && payload.sub === "employee_invite") {
      return {
        success: true,
        email: payload.email,
      };
    }
    return {
      success: false,
      message: "Invalid invitation token",
    };
  } catch (error) {
    return {
      success: false,
      message: "Invalid or expired invitation token",
    };
  }
}

export async function saveAgencyStaff(
  token: string,
  name: string,
  email: string,
  password: string
) {
  // Server-side validation
  const serverSchema = tenantRegistrationFormSchema.omit({ confirmPassword: true });
  const validation = serverSchema.safeParse({ name, email, password });
  
  if (!validation.success) {
    const firstIssue = validation.error.issues[0];
    return {
      success: false,
      message: firstIssue?.message || "Invalid input. Please check your entries.",
    };
  }

  try {
    // Validate token
    const payload = validateInvitationToken(token) as InvitationTokenPayload;
    
    if (payload.sub !== "employee_invite") {
      return {
        success: false,
        message: "Invalid invitation token",
      };
    }

    // Verify email from token matches provided email
    if (payload.email !== email) {
      return {
        success: false,
        message: "Email does not match invitation",
      };
    }

    // Find and validate invitation
    const invitation = await invitationsCollection.findOne({
      token: token,
      invited_person_email: email,
      status: "pending",
    });


    if (!invitation) {
        console.log('Invitation token', token)
      return {
        success: false,
        message: "Invitation not found or already used",
      };
    }

    // Check if invitation is expired
    if (new Date() > invitation.expires_at) {
      return {
        success: false,
        message: "Invitation has expired",
      };
    }

    // Register the user
    const user = await auth.api.signUpEmail({
      body: {
        email: email,
        password: password,
        name: name,
      },
    });

    const inviter : UserModel | null = await userCollection.findOne<UserModel|null>({
      user_id: invitation.agency_owner_id,
    });

    // Create user profile with agency_owner_id
    const userModel: UserModel = {
      user_id: user.user.id,
      email: email,
      name: name,
      agency: inviter?.agency as AgencyModel,
      agency_owner_id: invitation.agency_owner_id,
      role: UserRoles.AGENCY_STAFF,
      created_at: new Date(),
    };

    await userCollection.insertOne(userModel);

    // Update invitation status to accepted
    await invitationsCollection.updateOne(
      { invited_person_email: email },
      { $set: { status: "accepted" } }
    );

    return {
      success: true,
      message: "Account created successfully! Please check your email for verification.",
    };
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      message: err.message || "Failed to create account",
    };
  }
}

