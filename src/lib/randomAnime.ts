import { fetchTopAnime } from './jikanApi'
import type { Anime } from '@/types/anime'

const PAGES_TO_FETCH = 5
const ANIMES_PER_PAGE = 25

export async function getRandomAnime(): Promise<Anime | null> {
  const pages = Array.from({ length: PAGES_TO_FETCH }, (_, i) => fetchTopAnime(i + 1))

  const results = await Promise.allSettled(pages)
  const allAnimes = results
    .filter((r): r is PromiseFulfilledResult<{ data: Anime[] }> => r.status === 'fulfilled')
    .flatMap(r => r.value.data || [])

  if (allAnimes.length === 0) return null

  const randomIndex = Math.floor(Math.random() * Math.min(allAnimes.length, PAGES_TO_FETCH * ANIMES_PER_PAGE))
  return allAnimes[randomIndex]
}
