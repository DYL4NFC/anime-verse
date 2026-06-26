const aniplay = require('aniplay') as {
  fetchHD5Stream: (malId: string, episode: number) => Promise<string>
  fetchHD3Stream: (title: string, episode: number) => Promise<string>
  fetchHD6Stream: (title: string, episode: number) => Promise<string>
}

export async function getEpisodeSources(malId: string, animeTitle: string, episode: number) {
  const safeTitle = animeTitle.replace(/\s+/g, '-')
  return [
    { name: 'HD-1', url: await aniplay.fetchHD5Stream(malId, episode) },
    { name: 'HD-2', url: await aniplay.fetchHD3Stream(safeTitle, episode) },
    { name: 'HD-3', url: await aniplay.fetchHD6Stream(safeTitle, episode) },
  ]
}
