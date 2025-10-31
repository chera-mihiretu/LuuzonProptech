import { client } from "./db";

const db = client.db();

const USER_PROFILES = "user_profiles";


const userCollection = db.collection(USER_PROFILES);


export { userCollection };