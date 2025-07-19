// lib/mongo.js (updated)
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.NEXT_PUBLIC_MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ MongoDB connection string is missing.");
}

const client = new MongoClient(MONGO_URI);

async function connectToMongo(dbName) {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
    console.log("✅ Connected to MongoDB");
  }
  return client.db(dbName);
}

export { connectToMongo };