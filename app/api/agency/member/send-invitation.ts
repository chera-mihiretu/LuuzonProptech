'use server';
import { userCollection } from "@/db/collections"
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


export async function sendInvitation(email :string)  {
    try {
        if (!await validateAuthorization(UserRoles.AGENCY_MANAGER)) {
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
            userId: session.user.id
        })

        if (!user) {
            return {
                success: false, 
                message: "You cannot perform this action"
            }
        }


        const invitationToken = await generateInvitationToken(
            session.user.id, 
        );

        const url : string = `${BASE_URL}/singup?token=${invitationToken}`;

        
        await sendInvitationMail(
            {
                email, 
                url, 
                agencyManager: session.user.name, 
                agencyName: user.agency?.name!
            }

        )
        return {
            success: true, 
            message: "Invitation Sent Successfully"
        }
    } catch (e) {
        const error = e as Error;
        return {
            success: false, 
            message: error.message
        }
    }
}