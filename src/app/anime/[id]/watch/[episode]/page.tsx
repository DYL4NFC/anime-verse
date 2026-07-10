import { notFound } from 'next/navigation'
import { getAnilistId } from '@/lib/anilistApi'
import { getEpisodeSources, type EpisodeSourcesResult } from '@/lib/videoApi'
import { fetchAnimeById } from '@/lib/jikanApi'
import Link from 'next/link'
import type { Metadata } from 'next'
import { VideoPlayer } from '@/components/VideoPlayer'

export const dynamic = 'force-dynamic'

interface WatchPageProps {
  params: Promise<{ id: string; episode: string }>
  searchParams: Promise<{ lang?: string }>
}

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const { id, episode } = await params
  try {
    const data = await fetchAnimeById(id)
    if (!data) return { title: `Episodio ${episode} | AnimeVerse` }
    const title = data.data?.title || 'Anime'
    return {
      title: `Episodio ${episode} - ${title} | AnimeVerse`,
      description: `Ver episodio ${episode} de ${title} en AnimeVerse.`,
    }
  } catch {
    return { title: `Episodio ${episode} | AnimeVerse` }
  }
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const { id, episode } = await params
  const { lang } = await searchParams
  const episodeNum = parseInt(episode, 10)
  if (isNaN(episodeNum)) notFound()

  const defaultLang = lang === 'dub' ? 'dub' : 'sub'

  const data = await fetchAnimeById(id)
  if (!data?.data) notFound()

  const anime = data.data

  const anilistId = await getAnilistId(anime.title)

  let sources: EpisodeSourcesResult = { sub: [], dub: [] }
  try {
    sources = await getEpisodeSources({
      malId: String(anime.mal_id),
      title: anime.title,
      episode: episodeNum,
      anilistId,
    })
  } catch {
    sources = { sub: [], dub: [] }
  }

  const trailerEmbed = anime.trailer?.embed_url
    ? anime.trailer.embed_url.replace('autoplay=1', 'autoplay=0')
    : null

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold">{anime.title}</h1>
        <p className="text-muted-foreground text-sm">Episodio {episodeNum}</p>
      </div>

      <VideoPlayer
        trailerUrl={trailerEmbed}
        subSources={sources.sub}
        dubSources={sources.dub}
        title={`${anime.title} - Ep ${episodeNum}`}
        defaultLang={defaultLang}
      />

      <div className="flex justify-between items-center text-sm">
        <Link href={`/anime/${id}`} className="text-primary hover:underline">
          ← Volver a la ficha
        </Link>
        <div className="flex gap-3">
          {episodeNum > 1 && (
            <Link href={`/anime/${id}/watch/${episodeNum - 1}`} className="text-primary hover:underline">
              ← Ep {episodeNum - 1}
            </Link>
          )}
          {(!anime.episodes || episodeNum < anime.episodes) && (
            <Link href={`/anime/${id}/watch/${episodeNum + 1}`} className="text-primary hover:underline">
              Ep {episodeNum + 1} →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
