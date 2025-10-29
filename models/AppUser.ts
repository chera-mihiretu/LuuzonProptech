import { mongoose } from "../db/mongoose";

export type UserRole = "tenant" | "agency" | "admin" | "superAdmin";

export type AppUserDocument = {
	authUserId: string; // Better Auth user id
	email: string;
	name?: string | null;
	role: UserRole;
	// Optional references for role-specific profiles
	agencyId?: string | null;
	createdAt: Date;
	updatedAt: Date;
};

const AppUserSchema = new mongoose.Schema<AppUserDocument>(
	{
		authUserId: { type: String, required: true, unique: true, index: true },
		email: { type: String, required: true, lowercase: true, unique: true },
		name: { type: String, default: null },
		role: { type: String, required: true, enum: ["tenant", "agency", "admin", "superAdmin"], index: true },
		agencyId: { type: String, default: null }
	},
	{ timestamps: true }
);

export const AppUser = mongoose.models.AppUser || mongoose.model<AppUserDocument>("AppUser", AppUserSchema);


