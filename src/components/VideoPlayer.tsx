'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Source {
  name: string
  url: string
}

interface VideoPlayerProps {
  sources: Source[]
  title: string
}

export function VideoPlayer({ sources, title }: VideoPlayerProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeUrl = sources[activeIndex]?.url

  return (
    <div className="space-y-2">
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        {activeUrl ? (
          <iframe
            key={activeUrl}
            src={activeUrl}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
            title={title}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            Sin fuente disponible
          </div>
        )}
      </div>
      {sources.length > 1 && (
        <div className="flex gap-2">
          <span className="text-sm text-muted-foreground self-center">Servidor:</span>
          {sources.map((src, i) => (
            <Button
              key={src.name}
              size="sm"
              variant={i === activeIndex ? 'default' : 'outline'}
              onClick={() => setActiveIndex(i)}
            >
              {src.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
