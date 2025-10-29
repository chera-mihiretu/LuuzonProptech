import { mongoose } from "../db/mongoose";

export type AgencyDocument = {
	agencyName: string;
	managerName: string;
	agencyEmail: string; // login email (same as auth user email)
	address: string; // France address
	sirenSiret: string;
	authUserId: string; // Better Auth user id linkage
	otpVerified: boolean;
	otpCode?: string | null;
	otpExpiresAt?: Date | null;
	createdAt: Date;
	updatedAt: Date;
};

const AgencySchema = new mongoose.Schema<AgencyDocument>(
	{
		agencyName: { type: String, required: true, trim: true },
		managerName: { type: String, required: true, trim: true },
		agencyEmail: { type: String, required: true, unique: true, lowercase: true, index: true },
		address: { type: String, required: true },
		sirenSiret: { type: String, required: true, trim: true },
		authUserId: { type: String, required: true, index: true },
		otpVerified: { type: Boolean, default: false },
		otpCode: { type: String, default: null },
		otpExpiresAt: { type: Date, default: null }
	},
	{ timestamps: true }
);

export const Agency = mongoose.models.Agency || mongoose.model<AgencyDocument>("Agency", AgencySchema);


