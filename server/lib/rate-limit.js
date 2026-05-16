const MEMORY_BUCKETS = new Map();
const WINDOW_CONFIGS = [
  { name: "minute", limit: 5, windowSeconds: 60 },
  { name: "hour", limit: 30, windowSeconds: 3600 },
];

async function hashValue(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getIpFromRequest(request) {
  const forwarded = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
  return forwarded.split(",")[0].trim();
}

async function getKvBucket(kv, key, nowMs) {
  const raw = await kv.get(key, "json");

  if (!raw || typeof raw !== "object" || !raw.resetAt || raw.resetAt <= nowMs) {
    return { count: 0, resetAt: nowMs };
  }

  return raw;
}

async function updateKvBucket(kv, key, bucket, windowSeconds, nowMs) {
  const resetAt = bucket.resetAt > nowMs ? bucket.resetAt : nowMs + windowSeconds * 1000;
  const nextBucket = {
    count: bucket.count + 1,
    resetAt,
  };

  await kv.put(key, JSON.stringify(nextBucket), {
    expirationTtl: windowSeconds,
  });

  return nextBucket;
}

function getMemoryBucket(key, nowMs) {
  const bucket = MEMORY_BUCKETS.get(key);

  if (!bucket || bucket.resetAt <= nowMs) {
    return { count: 0, resetAt: nowMs };
  }

  return bucket;
}

function updateMemoryBucket(key, bucket, windowSeconds, nowMs) {
  const resetAt = bucket.resetAt > nowMs ? bucket.resetAt : nowMs + windowSeconds * 1000;
  const nextBucket = {
    count: bucket.count + 1,
    resetAt,
  };

  MEMORY_BUCKETS.set(key, nextBucket);
  return nextBucket;
}

export function getRequestId() {
  return crypto.randomUUID();
}

export async function getClientIpHash(request) {
  return hashValue(getIpFromRequest(request));
}

export async function enforceRateLimit({ env, ipHash }) {
  const nowMs = Date.now();
  const kv = env.ASSISTANT_RATE_LIMIT_KV;

  for (const windowConfig of WINDOW_CONFIGS) {
    const key = `rate_limit:${windowConfig.name}:${ipHash}`;
    const bucket = kv ? await getKvBucket(kv, key, nowMs) : getMemoryBucket(key, nowMs);

    if (bucket.count >= windowConfig.limit && bucket.resetAt > nowMs) {
      return {
        ok: false,
        window: windowConfig.name,
        retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - nowMs) / 1000)),
      };
    }

    if (kv) {
      await updateKvBucket(kv, key, bucket, windowConfig.windowSeconds, nowMs);
    } else {
      updateMemoryBucket(key, bucket, windowConfig.windowSeconds, nowMs);
    }
  }

  return { ok: true };
}
