import { fetchHD3Stream, fetchHD6Stream } from 'aniplay'

export async function getEpisodeSources(_malId: string, animeTitle: string, episode: number) {
  const safeTitle = animeTitle
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
  const candidates = await Promise.allSettled([
    fetchHD3Stream(safeTitle, episode).then((url: string) => ({ name: 'HD-1', url })),
    fetchHD6Stream(safeTitle, episode).then((url: string) => ({ name: 'HD-2', url })),
  ])
  return candidates
    .filter(r => r.status === 'fulfilled' && r.value.url)
    .map(r => (r as PromiseFulfilledResult<{ name: string; url: string }>).value)
}
