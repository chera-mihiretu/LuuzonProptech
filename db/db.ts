import { MongoClient } from "mongodb";
import { MONGODB_URI } from "../app/config/envs";

console.log("🚀🚀🚀 MONGO_URI", MONGODB_URI);
const client = new MongoClient(MONGODB_URI);

export { client };