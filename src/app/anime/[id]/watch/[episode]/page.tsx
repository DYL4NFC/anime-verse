import { notFound } from 'next/navigation'
import { getEpisodeSources } from '@/lib/videoApi'
import { fetchAnimeById } from '@/lib/jikanApi'
import Link from 'next/link'
import type { Metadata } from 'next'
import { VideoPlayer } from '@/components/VideoPlayer'

interface WatchPageProps {
  params: Promise<{ id: string; episode: string }>
}

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const { id, episode } = await params
  try {
    const data = await fetchAnimeById(id)
    const title = data.data?.title || 'Anime'
    return {
      title: `Episodio ${episode} - ${title} | AnimeVerse`,
      description: `Ver episodio ${episode} de ${title} en AnimeVerse.`,
    }
  } catch {
    return { title: `Episodio ${episode} | AnimeVerse` }
  }
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { id, episode } = await params
  const episodeNum = parseInt(episode, 10)
  if (isNaN(episodeNum)) notFound()

  const data = await fetchAnimeById(id).catch(() => null)
  if (!data?.data) notFound()

  const anime = data.data
  const externalSources = await getEpisodeSources(String(anime.mal_id), anime.title, episodeNum)

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
        externalSources={externalSources}
        title={`${anime.title} - Ep ${episodeNum}`}
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
