'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Tv, PlayCircle } from 'lucide-react'

interface Source {
  name: string
  url: string
}

interface VideoPlayerProps {
  trailerUrl: string | null
  subSources: Source[]
  dubSources: Source[]
  title: string
  defaultLang?: 'sub' | 'dub'
  onLangChange?: (lang: 'sub' | 'dub') => void
}

export function VideoPlayer({
  trailerUrl,
  subSources,
  dubSources,
  title,
  defaultLang = 'sub',
  onLangChange,
}: VideoPlayerProps) {
  const [lang, setLang] = useState<'sub' | 'dub'>(() => {
    if (defaultLang === 'dub' && dubSources.length > 0) return 'dub'
    if (subSources.length > 0) return 'sub'
    if (dubSources.length > 0) return 'dub'
    return 'sub'
  })

  const [selectedServer, setSelectedServer] = useState<string | null>(null)
  const [showTrailer, setShowTrailer] = useState(false)

  const currentSources = lang === 'sub' ? subSources : dubSources

  // Effective pick: explicit user choice > last server that worked for this browser > first available.
  const effectiveServer = useMemo(() => {
    if (selectedServer && currentSources.some(s => s.name === selectedServer)) {
      return selectedServer
    }
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(`av:lastServer:${lang}`)
      if (saved && currentSources.some(s => s.name === saved)) return saved
    }
    return currentSources[0]?.name ?? null
  }, [selectedServer, currentSources, lang])

  const activeUrl = useMemo(() => {
    const found = currentSources.find(s => s.name === effectiveServer)
    return found?.url ?? currentSources[0]?.url ?? null
  }, [effectiveServer, currentSources])

  const handleLangChange = (newLang: 'sub' | 'dub') => {
    setLang(newLang)
    setSelectedServer(null)
    onLangChange?.(newLang)
  }

  const rememberServer = (name: string) => {
    if (!name) return
    window.localStorage.setItem(`av:lastServer:${lang}`, name)
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
        {activeUrl ? (
          <iframe
            src={activeUrl}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
            title={title}
            onLoad={() => rememberServer(effectiveServer || '')}
          />
        ) : showTrailer ? (
          <iframe
            src={trailerUrl || ''}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
            title={title}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-white px-4 text-center">
            <PlayCircle className="h-16 w-16 text-muted-foreground" />
            <p className="text-sm text-muted-foreground max-w-md">
              选择一个服务器观看，或点击下方切换语言
            </p>
            {trailerUrl && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowTrailer(true)}
              >
                <Tv className="h-4 w-4" />
                观看预告
              </Button>
            )}
          </div>
        )}
      </div>

      <LanguageSelector
        lang={lang}
        onLangChange={handleLangChange}
      />

      {currentSources.length > 0 && (
        <div className="rounded-lg border p-4 space-y-3">
          <p className="text-sm font-medium">选择服务器：</p>
          <div className="flex flex-wrap gap-2">
            {currentSources.map((src) => (
              <button
                key={src.name}
                onClick={() => {
                  setSelectedServer(src.name)
                  rememberServer(src.name)
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-1.5 ${
                  effectiveServer === src.name
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {src.name}
                {src.name === 'HD-1' && (
                  <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Recomendado
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentSources.length === 0 && !trailerUrl && (
        <p className="text-sm text-muted-foreground text-center py-4">
          暂无可用服务器，请稍后再试
        </p>
      )}
    </div>
  )
}

interface LanguageSelectorProps {
  lang: 'sub' | 'dub'
  onLangChange: (lang: 'sub' | 'dub') => void
}

function LanguageSelector({ lang, onLangChange }: LanguageSelectorProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onLangChange('sub')}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          lang === 'sub'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted hover:bg-muted/80'
        }`}
      >
        字幕版
      </button>
      <button
        onClick={() => onLangChange('dub')}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          lang === 'dub'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted hover:bg-muted/80'
        }`}
      >
        配音版
      </button>
    </div>
  )
}
