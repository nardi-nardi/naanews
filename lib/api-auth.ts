import { NextResponse } from "next/server";

const SEED_API_KEY = process.env.SEED_API_KEY;

/**
 * Protects the seed route. If SEED_API_KEY is set, requests must include
 * header x-api-key matching it. If not set, seed is allowed (dev only).
 */
export function requireSeedAuth(request: Request): NextResponse | null {
  if (!SEED_API_KEY) return null;

  const key = request.headers.get("x-api-key");
  if (key !== SEED_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
