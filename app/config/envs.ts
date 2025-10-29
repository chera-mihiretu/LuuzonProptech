const MONGO_URI : string = process.env.MONGO_URI || "";
const BETTER_AUTH_SECRET: string = process.env.BETTER_AUTH_SECRET || "changeme-better-auth-secret";
const BETTER_AUTH_URL: string = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID || "google-client-id-placeholder";
const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET || "google-client-secret-placeholder";

export { MONGO_URI, BETTER_AUTH_SECRET, BETTER_AUTH_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET };