import { client } from "./db";

const db = client.db();

const USER_PROFILES = "user_profiles";
const AGENCY_PROPERTIES = "agency_properties";


const userCollection = db.collection(USER_PROFILES);
const agencyPropertiesCollection = db.collection(AGENCY_PROPERTIES);


export { userCollection, agencyPropertiesCollection };