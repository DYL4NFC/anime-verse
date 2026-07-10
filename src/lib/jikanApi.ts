import type { Anime } from '@/types/anime'

const BASE = 'https://api.jikan.moe/v4'
const REQUEST_TIMEOUT = 10_000
const MAX_RETRIES = 3

export interface JikanPagination {
  last_visible_page: number
  has_next_page: boolean
  items: { total: number; count: number; per_page: number }
}

export interface JikanResponse<T> {
  data: T
  pagination: JikanPagination
}

const SAFE_EMPTY: JikanResponse<unknown[]> = {
  data: [],
  pagination: { last_visible_page: 1, has_next_page: false, items: { total: 0, count: 0, per_page: 25 } },
}

function emptyResponse<T>(): JikanResponse<T> {
  return SAFE_EMPTY as JikanResponse<T>
}

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
  try {
    const res = await fetch(url, { ...init, signal: controller.signal })
    return res
  } finally {
    clearTimeout(timeoutId)
  }
}

async function safeFetch<T>(url: string, init?: RequestInit): Promise<JikanResponse<T>> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(url, init)

      if (res.status === 429) {
        const delay = attempt * 1500
        console.warn(`[jikanApi] 429 rate-limited. Retry ${attempt}/${MAX_RETRIES} in ${delay}ms → ${url}`)
        await new Promise(r => setTimeout(r, delay))
        continue
      }

      if (!res.ok) {
        console.error(`[jikanApi] HTTP ${res.status} → ${url}`)
        return emptyResponse<T>()
      }

      return await res.json()
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        console.error(`[jikanApi] Failed after ${MAX_RETRIES} attempts → ${url}`, error)
        return emptyResponse<T>()
      }
      const delay = attempt * 1500
      console.warn(`[jikanApi] Attempt ${attempt} failed. Retry in ${delay}ms → ${url}`)
      await new Promise(r => setTimeout(r, delay))
    }
  }

  return emptyResponse<T>()
}

export async function fetchTopAnime(page: number = 1): Promise<JikanResponse<Anime[]>> {
  return safeFetch<Anime[]>(
    `${BASE}/top/anime?limit=25&page=${page}`,
    { next: { revalidate: 86400 } },
  )
}

export async function fetchAnimeById(id: string): Promise<JikanResponse<Anime> | null> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(`${BASE}/anime/${id}`, {
        next: { revalidate: 3600 },
      })

      if (res.status === 404) return null

      if (res.status === 429) {
        const delay = attempt * 1500
        console.warn(`[jikanApi] 429 on fetchAnimeById. Retry ${attempt}/${MAX_RETRIES} in ${delay}ms`)
        await new Promise(r => setTimeout(r, delay))
        continue
      }

      if (!res.ok) {
        console.error(`[jikanApi] fetchAnimeById HTTP ${res.status} for id=${id}`)
        return null
      }

      return await res.json()
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        console.error(`[jikanApi] fetchAnimeById failed after ${MAX_RETRIES} attempts for id=${id}`, error)
        return null
      }
      const delay = attempt * 1500
      console.warn(`[jikanApi] fetchAnimeById attempt ${attempt} failed. Retry in ${delay}ms`)
      await new Promise(r => setTimeout(r, delay))
    }
  }

  return null
}

export async function fetchAnimeEpisodes(id: string, page: number = 1): Promise<JikanResponse<unknown[]>> {
  return safeFetch<unknown[]>(
    `${BASE}/anime/${id}/episodes?page=${page}`,
    { next: { revalidate: 3600 } },
  )
}

export async function fetchUpcomingAnime(): Promise<JikanResponse<Anime[]>> {
  return safeFetch<Anime[]>(
    `${BASE}/seasons/upcoming?limit=25`,
    { next: { revalidate: 86400 } },
  )
}

interface SearchFilters {
  genres?: string
  year?: number
  status?: 'airing' | 'complete' | 'upcoming'
}

export async function searchAnime(
  query: string,
  page: number = 1,
  filters: SearchFilters = {},
): Promise<JikanResponse<Anime[]>> {
  let url = `${BASE}/anime?q=${encodeURIComponent(query)}&limit=20&page=${page}`
  if (filters.genres) url += `&genres=${filters.genres}`
  if (filters.year) url += `&start_date=${filters.year}-01-01&end_date=${filters.year}-12-31`
  if (filters.status) url += `&status=${filters.status}`
  return safeFetch<Anime[]>(url, { next: { revalidate: 300 } })
}

export async function fetchGenres(): Promise<JikanResponse<{ mal_id: number; name: string }[]>> {
  return safeFetch<{ mal_id: number; name: string }[]>(
    `${BASE}/genres/anime`,
    { next: { revalidate: 86400 } },
  )
}
