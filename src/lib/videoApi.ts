import { PROVIDERS, resolveOrder, type ProviderContext, type Lang } from './providers'
import { probeUrl, recordResult, isDegraded, getHealthSnapshot } from './providerHealth'

const PROVIDER_TIMEOUT = 5_000

export interface EpisodeSource {
  id: string
  name: string
  url: string
  kind: 'iframe'
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

/** Priority order with degraded (3+ consecutive failures) providers pushed to the back, self-healing on next success. */
function getAttemptOrder() {
  const order = resolveOrder()
  const sorted = [...PROVIDERS].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
  const healthy = sorted.filter(p => !isDegraded(p.id))
  const degraded = sorted.filter(p => isDegraded(p.id))
  return [...healthy, ...degraded]
}

async function resolveSource(
  provider: (typeof PROVIDERS)[number],
  ctx: ProviderContext,
): Promise<EpisodeSource | null> {
  try {
    const url = await provider.resolve(ctx)
    if (!url) return null

    const { status, latencyMs } = await probeUrl(url, PROVIDER_TIMEOUT)
    recordResult(provider.id, status, latencyMs)

    if (status === 'down' || status === 'error' || status === 'timeout') return null

    return { id: provider.id, name: provider.label, url, kind: provider.kind }
  } catch {
    recordResult(provider.id, 'error', 0)
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
  const attemptOrder = getAttemptOrder()

  function buildPromises(lang: Lang) {
    return attemptOrder
      .filter(p => p.supports.includes(lang))
      .filter(p => !p.requiresAnilistId || !!anilistId)
      .map(p => {
        const ctx: ProviderContext = { malId, title, safeTitle, episode, anilistId, lang }
        return resolveSource(p, ctx)
      })
  }

  const [subResults, dubResults] = await Promise.all([
    Promise.allSettled(buildPromises('sub')),
    Promise.allSettled(buildPromises('dub')),
  ])

  const extract = (results: PromiseSettledResult<EpisodeSource | null>[]) =>
    results
      .filter(
        (r): r is PromiseFulfilledResult<EpisodeSource> =>
          r.status === 'fulfilled' && r.value !== null && r.value.url.length > 0,
      )
      .map(r => r.value)

  return { sub: extract(subResults), dub: extract(dubResults) }
}

export { getHealthSnapshot }
