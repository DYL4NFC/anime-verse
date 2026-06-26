import Image from 'next/image'
import Link from 'next/link'
import { Anime } from '@/types/anime'
import { Star } from 'lucide-react'

interface AnimeCardProps {
  anime: Anime
}

export function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Link href={`/anime/${anime.mal_id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg hover:scale-[1.02]">
        <div className="aspect-[3/4] relative">
          <Image
            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
            alt={anime.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
          {anime.score && (
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-sm text-white">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{anime.score.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold line-clamp-1 text-sm group-hover:text-primary transition-colors">
            {anime.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            {anime.type && <span>{anime.type}</span>}
            {anime.episodes && <span>• {anime.episodes} eps</span>}
            {anime.year && <span>• {anime.year}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
