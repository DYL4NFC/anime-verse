import {
  fetchHD1Stream,
  fetchHD2Stream,
  fetchHD3Stream,
  fetchHD5Stream,
  fetchHD6Stream,
} from 'aniplay'

const PROVIDER_TIMEOUT = 5_000

export interface EpisodeSource {
  name: string
  url: string
}

export interface EpisodeSourcesResult {
  sub: EpisodeSource[]
  dub: EpisodeSource[]
}

function slugifyTitle(title: string): string {
  return title
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms),
    ),
  ])
}

async function tryProvider<T>(
  name: string,
  fn: () => Promise<T>,
): Promise<T | null> {
  try {
    return await withTimeout(fn(), PROVIDER_TIMEOUT)
  } catch {
    return null
  }
}

export async function getEpisodeSources(params: {
  malId: string
  title: string
  episode: number
  anilistId?: number | null
}): Promise<EpisodeSourcesResult> {
  const { malId, title, episode, anilistId } = params
  const safeTitle = slugifyTitle(title)

  const subPromises: Promise<EpisodeSource | null>[] = []
  const dubPromises: Promise<EpisodeSource | null>[] = []

  if (anilistId) {
    subPromises.push(
      tryProvider('HD-1 SUB', () =>
        fetchHD1Stream(anilistId, episode, 'sub').then(url => ({
          name: 'HD-1',
          url,
        })),
      ),
    )
    subPromises.push(
      tryProvider('HD-2 SUB', () =>
        fetchHD2Stream(anilistId, episode, 'sub').then(url => ({
          name: 'HD-2',
          url,
        })),
      ),
    )

    dubPromises.push(
      tryProvider('HD-1 DUB', () =>
        fetchHD1Stream(anilistId, episode, 'dub').then(url => ({
          name: 'HD-1',
          url,
        })),
      ),
    )
    dubPromises.push(
      tryProvider('HD-2 DUB', () =>
        fetchHD2Stream(anilistId, episode, 'dub').then(url => ({
          name: 'HD-2',
          url,
        })),
      ),
    )
  }

  subPromises.push(
    tryProvider('HD-3', () =>
      fetchHD3Stream(safeTitle, episode).then(url => ({
        name: 'HD-3',
        url,
      })),
    ),
  )
  subPromises.push(
    tryProvider('HD-5', () =>
      fetchHD5Stream(malId, episode).then(url => ({
        name: 'HD-5',
        url,
      })),
    ),
  )
  subPromises.push(
    tryProvider('HD-6', () =>
      fetchHD6Stream(safeTitle, episode).then(url => ({
        name: 'HD-6',
        url,
      })),
    ),
  )

  const allSubResults = await Promise.allSettled(subPromises)
  const allDubResults = await Promise.allSettled(dubPromises)

  const sub = allSubResults
    .filter(
      (r): r is PromiseFulfilledResult<EpisodeSource> =>
        r.status === 'fulfilled' && r.value !== null && r.value.url.length > 0,
    )
    .map(r => r.value)

  const dub = allDubResults
    .filter(
      (r): r is PromiseFulfilledResult<EpisodeSource> =>
        r.status === 'fulfilled' && r.value !== null && r.value.url.length > 0,
    )
    .map(r => r.value)

  return { sub, dub }
}
