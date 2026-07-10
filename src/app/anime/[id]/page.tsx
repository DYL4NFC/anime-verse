import { fetchAnimeById, fetchAnimeEpisodes } from '@/lib/jikanApi'
import { AnimeDetail } from '@/components/AnimeDetail'
import { EpisodeList } from '@/components/EpisodeList'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface AnimePageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ ep?: string }>
}

export async function generateMetadata({ params }: AnimePageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const data = await fetchAnimeById(id)
    const anime = data.data
    return {
      title: `${anime.title} - AnimeVerse`,
      description: anime.synopsis?.slice(0, 160) ?? `${anime.title} - AnimeVerse`,
      openGraph: {
        title: anime.title,
        description: anime.synopsis?.slice(0, 160) ?? '',
        images: [{ url: anime.images.jpg.large_image_url }],
      },
    }
  } catch {
    return { title: 'Anime no encontrado - AnimeVerse' }
  }
}

export default async function AnimePage({ params, searchParams }: AnimePageProps) {
  const { id } = await params
  const { ep } = await searchParams

  let anime
  try {
    const data = await fetchAnimeById(id)
    anime = data.data
  } catch {
    notFound()
  }

  const epPage = parseInt(ep || '1', 10)

  let episodes: unknown[] = []
  let hasNextEpPage = false
  try {
    const epData = await fetchAnimeEpisodes(id, epPage)
    episodes = epData.data || []
    hasNextEpPage = epData.pagination?.has_next_page || false
  } catch {
    episodes = []
  }

  return (
    <div className="space-y-8">
      <AnimeDetail anime={anime} />
      <EpisodeList
        animeId={anime.mal_id}
        episodes={episodes}
        currentEpPage={epPage}
        hasNextEpPage={hasNextEpPage}
      />
    </div>
  )
}
