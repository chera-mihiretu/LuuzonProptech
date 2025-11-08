import { client } from "./db";

const db = client.db();

const USER_PROFILES = "user_profiles";
const AGENCY_PROPERTIES = "agency_properties";
const INVITATIONS = "invitations";
const APPLICATIONS = "applications";

const userCollection = db.collection(USER_PROFILES);
const agencyPropertiesCollection = db.collection(AGENCY_PROPERTIES);
const invitationsCollection = db.collection(INVITATIONS);
const applicationsCollection = db.collection(APPLICATIONS);


export { userCollection, agencyPropertiesCollection, invitationsCollection, applicationsCollection };