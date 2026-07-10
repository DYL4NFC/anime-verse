const ANILIST_URL = 'https://graphql.anilist.co'
const REQUEST_TIMEOUT = 5_000

const SEARCH_QUERY = `
query ($search: String) {
  Media(search: $search, type: ANIME) {
    id
  }
}
`

const anilistCache = new Map<string, number | null>()

function normalizeTitle(title: string): string {
  return title
    .replace(/\(TV\)/gi, '')
    .replace(/\(Movie\)/gi, '')
    .replace(/\(OVA\)/gi, '')
    .replace(/\(ONA\)/gi, '')
    .replace(/\(Special\)/gi, '')
    .replace(/:\s*.*$/, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeoutId)
  }
}

async function queryAnilist(title: string): Promise<number | null> {
  const normalized = normalizeTitle(title)

  if (anilistCache.has(normalized)) {
    return anilistCache.get(normalized)!
  }

  const maxRetries = 2

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetchWithTimeout(ANILIST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ query: SEARCH_QUERY, variables: { search: normalized } }),
      })

      if (res.status === 429) {
        if (attempt < maxRetries) {
          console.warn(`[anilistApi] 429 rate-limited. Retry in 1s`)
          await new Promise(r => setTimeout(r, 1000))
          continue
        }
        console.warn(`[anilistApi] 429 after retry, returning null`)
        anilistCache.set(normalized, null)
        return null
      }

      if (!res.ok) {
        console.error(`[anilistApi] HTTP ${res.status} for "${normalized}"`)
        anilistCache.set(normalized, null)
        return null
      }

      const json = await res.json()
      const id = json?.data?.Media?.id ?? null
      anilistCache.set(normalized, id)
      return id
    } catch (error) {
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 1000))
        continue
      }
      console.error(`[anilistApi] Failed for "${normalized}"`, error)
      anilistCache.set(normalized, null)
      return null
    }
  }

  anilistCache.set(normalized, null)
  return null
}

export async function getAnilistId(title: string): Promise<number | null> {
  return queryAnilist(title)
}
