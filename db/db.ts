import { MongoClient } from "mongodb";
import { MONGO_URI } from "../app/config/envs";

const client = new MongoClient(MONGO_URI);

export { client };