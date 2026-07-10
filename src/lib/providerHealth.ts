export type HealthStatus = 'ok' | 'blocked' | 'down' | 'timeout' | 'error'

interface ProviderStats {
  attempts: number
  successes: number
  failures: number
  timeouts: number
  totalLatencyMs: number
  lastLatencyMs: number | null
  lastStatus: HealthStatus | null
  lastCheckedAt: number | null
  consecutiveFailures: number
}

// Module-scope: persists for the life of the warm serverless instance /
// dev server process. Resets on cold start — acceptable for now, and swappable
// for Vercel KV/Redis later without changing call sites (recordResult/isDegraded).
const stats = new Map<string, ProviderStats>()

function getStats(id: string): ProviderStats {
  let s = stats.get(id)
  if (!s) {
    s = {
      attempts: 0,
      successes: 0,
      failures: 0,
      timeouts: 0,
      totalLatencyMs: 0,
      lastLatencyMs: null,
      lastStatus: null,
      lastCheckedAt: null,
      consecutiveFailures: 0,
    }
    stats.set(id, s)
  }
  return s
}

export function recordResult(id: string, status: HealthStatus, latencyMs: number): void {
  const s = getStats(id)
  s.attempts++
  s.lastLatencyMs = latencyMs
  s.lastStatus = status
  s.lastCheckedAt = Date.now()
  s.totalLatencyMs += latencyMs

  if (status === 'ok' || status === 'blocked') {
    s.successes++
    s.consecutiveFailures = 0
  } else {
    s.failures++
    s.consecutiveFailures++
    if (status === 'timeout') s.timeouts++
  }
}

/** 3+ failures in a row: still attempted, but pushed behind healthy providers. */
export function isDegraded(id: string): boolean {
  return (stats.get(id)?.consecutiveFailures ?? 0) >= 3
}

export function getHealthSnapshot(): Record<string, ProviderStats & { avgLatencyMs: number | null; availability: number | null }> {
  const out: Record<string, ProviderStats & { avgLatencyMs: number | null; availability: number | null }> = {}
  for (const [id, s] of stats.entries()) {
    out[id] = {
      ...s,
      avgLatencyMs: s.attempts ? Math.round(s.totalLatencyMs / s.attempts) : null,
      availability: s.attempts ? Math.round((s.successes / s.attempts) * 100) : null,
    }
  }
  return out
}

const PROBE_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

const PROBE_CACHE_TTL_MS = 90_000
const probeCache = new Map<string, { status: HealthStatus; latencyMs: number; expiresAt: number }>()

/** Real network check against the built embed URL — catches dead domains / 404s that string-building alone can't. */
export async function probeUrl(url: string, timeoutMs: number): Promise<{ status: HealthStatus; latencyMs: number }> {
  const cached = probeCache.get(url)
  if (cached && cached.expiresAt > Date.now()) {
    return { status: cached.status, latencyMs: cached.latencyMs }
  }

  const start = Date.now()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  let result: { status: HealthStatus; latencyMs: number }
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': PROBE_UA },
      cache: 'no-store',
    })
    const latencyMs = Date.now() - start
    if (res.status === 401 || res.status === 403) {
      result = { status: 'blocked', latencyMs } // server-side fetch bot-blocked; not proof the real iframe fails
    } else if (res.ok) {
      result = { status: 'ok', latencyMs }
    } else {
      result = { status: 'down', latencyMs }
    }
  } catch {
    const latencyMs = Date.now() - start
    result = { status: controller.signal.aborted ? 'timeout' : 'error', latencyMs }
  } finally {
    clearTimeout(timer)
  }

  probeCache.set(url, { ...result, expiresAt: Date.now() + PROBE_CACHE_TTL_MS })
  return result
}
