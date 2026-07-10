import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import type { Episode } from '@/types/anime'

interface EpisodeListProps {
  animeId: number
  episodes: unknown[]
  currentEpPage: number
  hasNextEpPage: boolean
}

function buildEpUrl(animeId: number, epPage: number) {
  const params = new URLSearchParams()
  if (epPage > 1) params.set('ep', String(epPage))
  const qs = params.toString()
  return `/anime/${animeId}${qs ? `?${qs}` : ''}`
}

export function EpisodeList({
  animeId,
  episodes,
  currentEpPage,
  hasNextEpPage,
}: EpisodeListProps) {
  const eps = episodes as Episode[]

  return (
    <div id="episodios" className="scroll-mt-24">
      <h2 className="text-2xl font-bold mb-4">Episodios</h2>

      {eps.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
          <AlertCircle className="h-8 w-8" />
          <p>No se encontraron episodios.</p>
        </div>
      )}

      {eps.length > 0 && (
        <div className="divide-y rounded-lg border">
          {eps.map((ep) => (
            <Link
              key={ep.mal_id}
              href={`/anime/${animeId}/watch?ep=${ep.mal_id}`}
              className="flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                {ep.mal_id}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {ep.title || `Episodio ${ep.mal_id}`}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {ep.aired && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(ep.aired).toLocaleDateString('es-ES')}
                    </span>
                  )}
                  {ep.filler && (
                    <span className="text-xs rounded-full bg-orange-500/10 text-orange-500 px-2 py-0.5">
                      Filler
                    </span>
                  )}
                  {ep.recap && (
                    <span className="text-xs rounded-full bg-blue-500/10 text-blue-500 px-2 py-0.5">
                      Recap
                    </span>
                  )}
                </div>
              </div>
              <Play className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      )}

      {(currentEpPage > 1 || hasNextEpPage) && (
        <div className="flex justify-center items-center gap-4 mt-6">
          {currentEpPage > 1 ? (
            <Link href={buildEpUrl(animeId, currentEpPage - 1)}>
              <Button variant="outline">
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
            </Link>
          ) : (
            <Button variant="outline" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
            </Button>
          )}
          <span className="text-sm text-muted-foreground">Página {currentEpPage}</span>
          {hasNextEpPage ? (
            <Link href={buildEpUrl(animeId, currentEpPage + 1)}>
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
      )}
    </div>
  )
}
