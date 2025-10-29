import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { MONGO_URI, BETTER_AUTH_SECRET, BETTER_AUTH_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../../app/config/envs";
import { client as nativeClient } from "../../db/db";

// Reuse existing MongoDB native client for Better Auth storage
const mongoClient: MongoClient = nativeClient;

export const auth = betterAuth({
	baseURL: BETTER_AUTH_URL,
	secret: BETTER_AUTH_SECRET,
	database: {
		type: "mongodb",
		client: mongoClient
	},
	emailAndPassword: {
		enabled: true
	},
	socialProviders: {
		google: {
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET
		}
	}
});

export type Auth = typeof auth;


