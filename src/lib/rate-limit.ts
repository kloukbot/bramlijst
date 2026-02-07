import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Falls back to in-memory if env vars not set (local dev without Redis)
const redis = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  ? new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  : null

// Rate limiter for API endpoints (10 requests per 10 seconds per IP)
export const apiRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
      prefix: "ratelimit:api",
    })
  : null

// Rate limiter for webhooks (100 requests per minute)
export const webhookRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: true,
      prefix: "ratelimit:webhook",
    })
  : null

// Helper function that matches the old interface
export async function checkRateLimit(
  identifier: string,
  type: "api" | "webhook" = "api"
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  const limiter = type === "webhook" ? webhookRateLimit : apiRateLimit

  if (!limiter) {
    // No Redis configured, allow all (development)
    return { success: true }
  }

  const result = await limiter.limit(identifier)
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  }
}

/** Get client IP from request headers */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return "unknown"
}
