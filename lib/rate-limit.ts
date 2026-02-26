/**
 * Simple in-memory rate limiter untuk API routes.
 * Cocok untuk single-instance / dev. Production: gunakan Redis/Upstash
 * agar limit konsisten across serverless instances.
 */

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

const DEFAULT_WINDOW_MS = 60 * 1000; // 1 menit
const DEFAULT_MAX = 30;

function getKey(identifier: string, prefix: string): string {
  return `${prefix}:${identifier}`;
}

function getIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIp) return realIp.trim();
  return "unknown";
}

/**
 * Cek apakah request melebihi limit. Jika ya, return Response 429.
 * @param request - Request object (untuk baca IP)
 * @param prefix - Nama endpoint, e.g. "comments", "upload", "seed"
 * @param options - max = jumlah request per window, windowMs = panjang window (ms)
 */
export function rateLimit(
  request: Request,
  prefix: string,
  options: { max?: number; windowMs?: number } = {}
): Response | null {
  const max = options.max ?? DEFAULT_MAX;
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const id = getIdentifier(request);
  const key = getKey(id, prefix);
  const now = Date.now();

  let entry = store.get(key);
  if (!entry || now >= entry.resetAt) {
    entry = { count: 1, resetAt: now + windowMs };
    store.set(key, entry);
    return null;
  }

  entry.count += 1;
  if (entry.count > max) {
    return new Response(
      JSON.stringify({
        error: "Terlalu banyak request. Coba lagi nanti.",
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  return null;
}

/** Bersihkan entry yang sudah expired (panggil periodically jika perlu) */
export function pruneStore(): void {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now >= entry.resetAt) store.delete(key);
  }
}
