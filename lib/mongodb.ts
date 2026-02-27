import { MongoClient, type Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("⚠️ MONGODB_URI is not defined — DB features will be unavailable");
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

async function connectToDatabase(): Promise<MongoClient | null> {
  if (!MONGODB_URI) {
    return null;
  }

  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI);
      clientPromise = client.connect();
    }
    return await clientPromise;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    client = null;
    clientPromise = null;
    return null;
  }
}

export async function getDb(): Promise<Db | null> {
  try {
    const mongoClient = await connectToDatabase();
    if (!mongoClient) return null;
    return mongoClient.db("naanews");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    return null;
  }
}

export default connectToDatabase;
