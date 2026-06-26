const BASE = 'https://api.jikan.moe/v4'

function handleError(status: number): never {
  if (status === 404) throw new Error('NOT_FOUND')
  if (status === 429) throw new Error('RATE_LIMITED')
  throw new Error(`API_ERROR:${status}`)
}

export async function fetchTopAnime(page: number = 1) {
  const res = await fetch(`${BASE}/top/anime?limit=50&page=${page}`, {
    next: { revalidate: 86400 },
  })
  if (!res.ok) handleError(res.status)
  return res.json()
}

export async function fetchAnimeById(id: string) {
  const res = await fetch(`${BASE}/anime/${id}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) handleError(res.status)
  return res.json()
}

export async function fetchAnimeEpisodes(id: string) {
  const res = await fetch(`${BASE}/anime/${id}/episodes`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) handleError(res.status)
  return res.json()
}

export async function fetchUpcomingAnime() {
  const res = await fetch(`${BASE}/seasons/upcoming?limit=50`, {
    next: { revalidate: 86400 },
  })
  if (!res.ok) handleError(res.status)
  return res.json()
}

interface SearchFilters {
  genres?: string
  year?: number
  status?: 'airing' | 'complete' | 'upcoming'
}

export async function searchAnime(query: string, page: number = 1, filters: SearchFilters = {}) {
  let url = `${BASE}/anime?q=${encodeURIComponent(query)}&limit=20&page=${page}`
  if (filters.genres) url += `&genres=${filters.genres}`
  if (filters.year) url += `&start_date=${filters.year}-01-01&end_date=${filters.year}-12-31`
  if (filters.status) url += `&status=${filters.status}`
  const res = await fetch(url, { next: { revalidate: 300 } })
  if (!res.ok) handleError(res.status)
  return res.json()
}

export async function fetchGenres() {
  const res = await fetch(`${BASE}/genres/anime`, {
    next: { revalidate: 86400 },
  })
  if (!res.ok) handleError(res.status)
  return res.json()
}
