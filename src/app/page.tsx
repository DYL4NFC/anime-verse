import { fetchTopAnime } from '@/lib/jikanApi'
import { AnimeCard } from '@/components/AnimeCard'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HomePageProps {
  searchParams: Promise<{ page?: string }>
}

export const metadata: Metadata = {
  title: 'Inicio - AnimeVerse',
  description: 'Los animes más populares del momento. Descubre y ve tus series favoritas gratis.',
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const currentPage = parseInt(params.page || '1', 10)
  const data = await fetchTopAnime(currentPage)
  const animes = data.data || []
  const hasNextPage = data.pagination?.has_next_page || false

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Animes Populares</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {animes.map((anime: any) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        {currentPage > 1 ? (
          <Link href={`/?page=${currentPage - 1}`}>
            <Button variant="outline">
              <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
            </Button>
          </Link>
        ) : (
          <Button variant="outline" disabled>
            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
          </Button>
        )}
        <span className="text-sm text-muted-foreground">Página {currentPage}</span>
        {hasNextPage ? (
          <Link href={`/?page=${currentPage + 1}`}>
            <Button variant="outline">
              Siguiente <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        ) : (
          <Button variant="outline" disabled>
            Siguiente <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  )
}
