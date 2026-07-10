import { fetchHD1Stream, fetchHD2Stream } from 'aniplay'

export type ProviderKind = 'iframe'
export type Lang = 'sub' | 'dub'

export interface ProviderContext {
  malId: string
  title: string
  safeTitle: string
  episode: number
  anilistId?: number | null
  lang: Lang
}

export interface ProviderDefinition {
  id: string
  label: string
  kind: ProviderKind
  supports: Lang[]
  requiresAnilistId?: boolean
  resolve: (ctx: ProviderContext) => Promise<string>
}

/**
 * HD-4 is served directly from megaplay.buzz's documented AniList/MAL
 * routes (https://megaplay.buzz/api) instead of aniplay's fetchHD4Stream,
 * which requires a HiAnime-specific episode id we don't have.
 */
async function resolveHD4(ctx: ProviderContext): Promise<string> {
  const base = 'https://megaplay.buzz/stream'
  if (ctx.anilistId) return `${base}/ani/${ctx.anilistId}/${ctx.episode}/${ctx.lang}`
  return `${base}/mal/${ctx.malId}/${ctx.episode}/${ctx.lang}`
}

// HD-3, HD-5 and HD-6 were dropped: load-test on 2026-07-10 showed 0% availability
// (dead domains / non-2xx on every probe) across 4 real anime/episode combinations.
export const PROVIDERS: ProviderDefinition[] = [
  {
    id: 'HD-1',
    label: 'HD-1',
    kind: 'iframe',
    supports: ['sub', 'dub'],
    requiresAnilistId: true,
    resolve: ctx => fetchHD1Stream(ctx.anilistId as number, ctx.episode, ctx.lang),
  },
  {
    id: 'HD-2',
    label: 'HD-2',
    kind: 'iframe',
    supports: ['sub', 'dub'],
    requiresAnilistId: true,
    resolve: ctx => fetchHD2Stream(ctx.anilistId as number, ctx.episode, ctx.lang),
  },
  {
    id: 'HD-4',
    label: 'HD-4',
    kind: 'iframe',
    supports: ['sub', 'dub'],
    resolve: resolveHD4,
  },
]

const ALL_IDS = PROVIDERS.map(p => p.id)
const DEFAULT_ORDER = ['HD-1', 'HD-2', 'HD-4']

/**
 * Failover order, overridable via PROVIDER_PRIORITY="HD-2,HD-1,HD-4" without
 * touching code. Unknown ids are dropped; omitted ids are appended at the end.
 */
export function resolveOrder(): string[] {
  const raw = process.env.PROVIDER_PRIORITY
  if (!raw) return DEFAULT_ORDER
  const requested = raw.split(',').map(s => s.trim()).filter(Boolean)
  const valid = requested.filter(id => ALL_IDS.includes(id))
  const missing = ALL_IDS.filter(id => !valid.includes(id))
  return [...valid, ...missing]
}
