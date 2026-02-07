/**
 * Simple in-memory rate limiter (MVP, no Redis needed).
 * Tracks requests per key (IP) using a sliding window.
 */

type RateLimitEntry = {
  timestamps: number[]
}

const store = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < 120_000)
    if (entry.timestamps.length === 0) store.delete(key)
  }
}, 300_000)

type RateLimitConfig = {
  maxRequests: number
  windowMs: number
}

type RateLimitResult = {
  allowed: boolean
  remaining: number
  resetMs: number
}

export function rateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key) ?? { timestamps: [] }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < config.windowMs)

  if (entry.timestamps.length >= config.maxRequests) {
    const oldest = entry.timestamps[0]
    return {
      allowed: false,
      remaining: 0,
      resetMs: oldest + config.windowMs - now,
    }
  }

  entry.timestamps.push(now)
  store.set(key, entry)

  return {
    allowed: true,
    remaining: config.maxRequests - entry.timestamps.length,
    resetMs: config.windowMs,
  }
}

/** Get client IP from request headers */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return "unknown"
}
