import Image from 'next/image'
import Link from 'next/link'
import { Star, Play, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Anime } from '@/types/anime'

interface AnimeDetailProps {
  anime: Anime
}

export function AnimeDetail({ anime }: AnimeDetailProps) {
  const title = anime.title_english || anime.title
  const trailerUrl = anime.trailer?.embed_url || null

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="relative w-full lg:w-72 shrink-0">
        <div className="aspect-[3/4] relative overflow-hidden rounded-lg border">
          <Image
            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
            alt={anime.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 288px"
            priority
          />
        </div>

        {trailerUrl && (
          <div className="mt-4">
            <div className="aspect-video relative overflow-hidden rounded-lg border">
              <iframe
                src={trailerUrl}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture"
                title={`Tráiler de ${anime.title}`}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-center">Tráiler oficial</p>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold leading-tight">{title}</h1>
        {anime.title_english && anime.title !== anime.title_english && (
          <p className="text-lg text-muted-foreground mt-1">{anime.title}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-4">
          {anime.score && (
            <div className="flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1.5 text-sm font-medium">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              {anime.score.toFixed(1)}
              <span className="text-muted-foreground">({anime.scored_by?.toLocaleString()})</span>
            </div>
          )}
          {anime.rank && (
            <span className="rounded-full bg-muted px-3 py-1.5 text-sm">
              #{anime.rank} ranking
            </span>
          )}
          <span className="rounded-full bg-muted px-3 py-1.5 text-sm">{anime.type}</span>
          {anime.episodes && (
            <span className="rounded-full bg-muted px-3 py-1.5 text-sm">{anime.episodes} episodios</span>
          )}
          <span className="rounded-full bg-muted px-3 py-1.5 text-sm">{anime.status}</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {anime.genres.map((genre) => (
            <Link
              key={genre.mal_id}
              href={`/search?genres=${genre.mal_id}`}
              className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary hover:bg-primary/20 transition-colors"
            >
              {genre.name}
            </Link>
          ))}
        </div>

        {(anime.year || anime.season) && (
          <p className="text-sm text-muted-foreground mt-3">
            {anime.season && anime.season.charAt(0).toUpperCase() + anime.season.slice(1)}{' '}
            {anime.year}
          </p>
        )}

        {anime.rating && (
          <p className="text-xs text-muted-foreground mt-1">{anime.rating}</p>
        )}

        {anime.synopsis && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Sinopsis</h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {anime.synopsis}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-6">
          <a href="#episodios">
            <Button>
              <Play className="h-4 w-4 mr-1.5" />
              Ver episodios
            </Button>
          </a>
          {trailerUrl && (
            <a href={trailerUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-1.5" />
                Tráiler en YouTube
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
