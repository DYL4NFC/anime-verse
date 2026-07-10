import { fetchAnimeById } from '@/lib/jikanApi'
import { getAnilistId } from '@/lib/anilistApi'
import { getEpisodeSources, type EpisodeSourcesResult } from '@/lib/videoApi'
import { notFound } from 'next/navigation'
import { VideoPlayer } from '@/components/VideoPlayer'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface WatchPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ ep?: string; lang?: string }>
}

export async function generateMetadata({ params, searchParams }: WatchPageProps): Promise<Metadata> {
  const { id } = await params
  const { ep } = await searchParams
  const epNum = parseInt(ep || '1', 10)
  try {
    const data = await fetchAnimeById(id)
    if (!data) return { title: 'Reproductor - AnimeVerse' }
    const anime = data.data
    return {
      title: `${anime.title} - Episodio ${epNum} - AnimeVerse`,
      description: `Viendo ${anime.title} episodio ${epNum} en AnimeVerse`,
    }
  } catch {
    return { title: 'Reproductor - AnimeVerse' }
  }
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const { id } = await params
  const { ep, lang } = await searchParams
  const epNum = parseInt(ep || '1', 10)
  const defaultLang = lang === 'dub' ? 'dub' : 'sub'

  const animeData = await fetchAnimeById(id)
  if (!animeData) notFound()

  const anime = animeData.data
  const trailerUrl = anime.trailer?.embed_url || null

  const anilistId = await getAnilistId(anime.title)

  let sources: EpisodeSourcesResult = { sub: [], dub: [] }
  try {
    sources = await getEpisodeSources({
      malId: String(anime.mal_id),
      title: anime.title,
      episode: epNum,
      anilistId,
    })
  } catch {
    sources = { sub: [], dub: [] }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/anime/${id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a la ficha
          </Button>
        </Link>
        <h1 className="text-xl font-bold truncate">
          {anime.title} — Episodio {epNum}
        </h1>
      </div>

      <VideoPlayer
        trailerUrl={trailerUrl}
        subSources={sources.sub}
        dubSources={sources.dub}
        title={`${anime.title} Ep ${epNum}`}
        defaultLang={defaultLang}
      />
    </div>
  )
}
