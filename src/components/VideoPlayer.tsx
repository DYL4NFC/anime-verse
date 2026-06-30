'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ExternalLink, Tv, PlayCircle } from 'lucide-react'

interface Source {
  name: string
  url: string
}

interface VideoPlayerProps {
  trailerUrl: string | null
  externalSources: Source[]
  title: string
}

export function VideoPlayer({ trailerUrl, externalSources, title }: VideoPlayerProps) {
  const [showTrailer, setShowTrailer] = useState(false)

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
        {showTrailer && trailerUrl ? (
          <iframe
            src={trailerUrl}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
            title={title}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-white px-4 text-center">
            <PlayCircle className="h-16 w-16 text-muted-foreground" />
            <p className="text-sm text-muted-foreground max-w-md">
              Elige un servidor externo para ver el episodio, o mira el tráiler oficial.
            </p>
            {trailerUrl && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowTrailer(true)}
              >
                <Tv className="h-4 w-4" />
                Ver tráiler oficial
              </Button>
            )}
          </div>
        )}
      </div>

      {externalSources.length > 0 && (
        <div className="rounded-lg border p-4 space-y-3">
          <p className="text-sm font-medium">Ver episodio en servidor externo:</p>
          <div className="flex flex-wrap gap-2">
            {externalSources.map((src) => (
              <a
                key={src.name}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-3 w-3" />
                  {src.name}
                </Button>
              </a>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Los servidores externos abren en una nueva pestaña.
          </p>
        </div>
      )}

      {externalSources.length === 0 && !trailerUrl && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No hay fuentes disponibles para este episodio.
        </p>
      )}
    </div>
  )
}
