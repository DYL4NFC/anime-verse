import { searchAnime, fetchGenres } from '@/lib/jikanApi'
import { AnimeCard } from '@/components/AnimeCard'
import { SearchFilters } from '@/components/SearchFilters'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Anime } from '@/types/anime'

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string; genres?: string; year?: string; status?: string }>
}

export const metadata: Metadata = {
  title: 'Buscar anime - AnimeVerse',
  description: 'Encuentra tu anime favorito en AnimeVerse.',
}

function buildSearchUrl(base: { q: string; genres?: string; year?: string; status?: string }, page: number) {
  const p = new URLSearchParams()
  if (base.q) p.set('q', base.q)
  if (base.genres) p.set('genres', base.genres)
  if (base.year) p.set('year', base.year)
  if (base.status) p.set('status', base.status)
  p.set('page', String(page))
  return `/search?${p.toString()}`
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const currentPage = parseInt(params.page || '1', 10)
  const genres = params.genres
  const year = params.year ? parseInt(params.year, 10) : undefined
  const status = params.status as 'airing' | 'complete' | 'upcoming' | undefined

  let allGenres: { mal_id: number; name: string }[] = []
  try {
    const genresData = await fetchGenres()
    allGenres = genresData.data || []
  } catch {
    console.error('[SearchPage] Failed to fetch genres')
  }

  let results: Anime[] = []
  let error: string | null = null
  let hasNextPage = false

  if (query) {
    try {
      const data = await searchAnime(query, currentPage, { genres, year, status })
      results = data.data || []
      hasNextPage = data.pagination?.has_next_page || false
    } catch {
      error = 'No pudimos realizar la búsqueda. Intenta de nuevo.'
    }
  }

  const urlBase = { q: query, genres, year: params.year, status: params.status }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {query ? `Resultados para "${query}"` : 'Buscar anime'}
      </h1>

      <SearchFilters genres={allGenres} />

      {error && (
        <p className="text-red-500 text-center py-8">{error}</p>
      )}

      {query && !error && results.length === 0 && (
        <p className="text-muted-foreground text-center py-8">
          No se encontraron animes para &quot;{query}&quot; con estos filtros.
        </p>
      )}

      {results.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
            {results.map((anime: Anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            {currentPage > 1 ? (
              <Link href={buildSearchUrl(urlBase, currentPage - 1)}>
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
              <Link href={buildSearchUrl(urlBase, currentPage + 1)}>
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
        </>
      )}

      {!query && (
        <p className="text-muted-foreground text-center py-8">
          Escribe el nombre de un anime en el buscador para comenzar.
        </p>
      )}
    </div>
  )
}
