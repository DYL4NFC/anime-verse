'use client'

import { Globe } from 'lucide-react'

type Language = 'sub' | 'dub'

interface LanguageSelectorProps {
  selected: Language
  onChange: (lang: Language) => void
  hasSub: boolean
  hasDub: boolean
}

export function LanguageSelector({
  selected,
  onChange,
  hasSub,
  hasDub,
}: LanguageSelectorProps) {
  if (!hasSub && !hasDub) return null

  return (
    <div className="flex items-center gap-3">
      <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex gap-1.5">
        <button
          onClick={() => onChange('sub')}
          disabled={!hasSub}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            selected === 'sub'
              ? 'bg-primary text-primary-foreground'
              : hasSub
                ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                : 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
          }`}
        >
          Subtitulado (JP)
        </button>
        <button
          onClick={() => onChange('dub')}
          disabled={!hasDub}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            selected === 'dub'
              ? 'bg-primary text-primary-foreground'
              : hasDub
                ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                : 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
          }`}
        >
          Español Latino
        </button>
      </div>
    </div>
  )
}
