import { MongoClient, type Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("⚠️ MONGODB_URI is not defined — DB features will be unavailable");
}

const globalForMongo = globalThis as unknown as {
  _mongoClient?: MongoClient;
  _mongoClientPromise?: Promise<MongoClient>;
};

function getClientPromise(): Promise<MongoClient> {
  if (!MONGODB_URI) {
    return Promise.reject(new Error("MONGODB_URI is not defined"));
  }

  if (process.env.NODE_ENV === "development") {
    // In dev, reuse across HMR
    if (!globalForMongo._mongoClientPromise) {
      const client = new MongoClient(MONGODB_URI, {
        connectTimeoutMS: 10_000,
        serverSelectionTimeoutMS: 10_000,
      });
      globalForMongo._mongoClientPromise = client.connect();
    }
    return globalForMongo._mongoClientPromise;
  }

  // In production, also reuse via global to avoid new connections per request
  if (!globalForMongo._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI, {
      connectTimeoutMS: 10_000,
      serverSelectionTimeoutMS: 10_000,
    });
    globalForMongo._mongoClientPromise = client.connect();
  }
  return globalForMongo._mongoClientPromise;
}

const clientPromise = getClientPromise();
export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("naanews");
}
