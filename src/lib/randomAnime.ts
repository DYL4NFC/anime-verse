import { fetchTopAnime } from './jikanApi'

export async function getRandomAnime() {
  const data = await fetchTopAnime()
  const animes = data.data || []
  if (animes.length === 0) return null
  const randomIndex = Math.floor(Math.random() * animes.length)
  return animes[randomIndex]
}
