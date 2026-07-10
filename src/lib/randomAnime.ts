import { fetchTopAnime, type JikanResponse } from './jikanApi'
import type { Anime } from '@/types/anime'

const PAGES_TO_FETCH = 5

export async function getRandomAnime(): Promise<Anime | null> {
  const pages = Array.from({ length: PAGES_TO_FETCH }, (_, i) => fetchTopAnime(i + 1))

  const results = await Promise.allSettled(pages)
  const allAnimes = results
    .filter((r): r is PromiseFulfilledResult<JikanResponse<Anime[]>> => r.status === 'fulfilled')
    .flatMap(r => r.value.data || [])

  if (allAnimes.length === 0) return null

  const randomIndex = Math.floor(Math.random() * allAnimes.length)
  return allAnimes[randomIndex]
}
