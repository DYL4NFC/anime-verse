import { fetchAnimeById, fetchAnimeEpisodes } from '@/lib/jikanApi'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play, Star, Calendar, Clock, Film } from 'lucide-react'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const data = await fetchAnimeById(id)
    const anime = data.data
    return {
      title: `${anime.title} - AnimeVerse`,
      description: anime.synopsis?.slice(0, 160) || `Ver ${anime.title} en AnimeVerse`,
      openGraph: {
        title: anime.title,
        description: anime.synopsis?.slice(0, 160) || '',
        images: [anime.images.jpg.large_image_url || anime.images.jpg.image_url],
      },
    }
  } catch {
    return {
      title: 'Anime no encontrado - AnimeVerse',
      description: 'El anime que buscas no está disponible.',
    }
  }
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const { id } = await params
  let anime
  try {
    const data = await fetchAnimeById(id)
    anime = data.data
    if (!anime) notFound()
  } catch {
    notFound()
  }

  const episodesData = await fetchAnimeEpisodes(id).catch(() => null)
  const episodes = episodesData?.data?.length
    ? episodesData.data
    : Array.from({ length: anime.episodes || 12 }, (_, i) => ({
        mal_id: i + 1,
        title: `Episodio ${i + 1}`,
        aired: null,
        filler: false,
        recap: false,
      }))

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative w-full md:w-64 aspect-[3/4] shrink-0 rounded-lg overflow-hidden border">
          <Image
            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
            alt={anime.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 256px"
          />
        </div>
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold">{anime.title}</h1>
          {anime.title_english && (
            <p className="text-muted-foreground text-lg">{anime.title_english}</p>
          )}
          <div className="flex flex-wrap gap-3 text-sm">
            {anime.score && (
              <span className="flex items-center gap-1 bg-yellow-500/10 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                {anime.score.toFixed(1)} ({anime.scored_by?.toLocaleString() || 0} votos)
              </span>
            )}
            {anime.status && (
              <span className="flex items-center gap-1 bg-blue-500/10 px-3 py-1 rounded-full">
                <Clock className="h-4 w-4" />
                {anime.status}
              </span>
            )}
            {anime.year && (
              <span className="flex items-center gap-1 bg-green-500/10 px-3 py-1 rounded-full">
                <Calendar className="h-4 w-4" />
                {anime.year}
              </span>
            )}
            {anime.type && (
              <span className="flex items-center gap-1 bg-purple-500/10 px-3 py-1 rounded-full">
                <Film className="h-4 w-4" />
                {anime.type}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {(anime.genres || []).map((genre: any) => (
              <span key={genre.mal_id} className="text-xs bg-secondary px-2 py-1 rounded">
                {genre.name}
              </span>
            ))}
          </div>
          {anime.synopsis && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {anime.synopsis}
            </p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Episodios</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {episodes.map((ep: any) => (
            <Link
              key={ep.mal_id}
              href={`/anime/${id}/watch/${ep.mal_id}`}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary transition-colors group"
            >
              <span className="text-sm font-medium">Ep {ep.mal_id}</span>
              <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="h-4 w-4" />
              </Button>
            </Link>
          ))}
        </div>
        {(!anime.episodes || anime.episodes === 0) && (
          <p className="text-muted-foreground text-sm">No hay episodios disponibles.</p>
        )}
      </div>
    </div>
  )
}
