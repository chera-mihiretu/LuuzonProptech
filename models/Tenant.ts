import { mongoose } from "../db/mongoose";

export type TenantDocument = {
	name: string;
	email: string;
	authUserId: string; // Better Auth user id linkage
	createdAt: Date;
	updatedAt: Date;
};

const TenantSchema = new mongoose.Schema<TenantDocument>(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, lowercase: true, unique: true, index: true },
		authUserId: { type: String, required: true, index: true }
	},
	{ timestamps: true }
);

export const Tenant = mongoose.models.Tenant || mongoose.model<TenantDocument>("Tenant", TenantSchema);


