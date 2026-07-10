import { fetchUpcomingAnime } from '@/lib/jikanApi'
import { AnimeCard } from '@/components/AnimeCard'
import type { Metadata } from 'next'
import type { Anime } from '@/types/anime'

export const metadata: Metadata = {
  title: 'Próximos estrenos - AnimeVerse',
  description: 'Descubre los animes que se estrenarán pronto. Mantente al día con las nuevas series.',
}

export default async function UpcomingPage() {
  const data = await fetchUpcomingAnime()
  const animes = data.data || []

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Próximos estrenos</h1>
      <p className="text-muted-foreground mb-6">Animes que llegarán pronto a la pantalla.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {animes.map((anime: Anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
    </div>
  )
}
