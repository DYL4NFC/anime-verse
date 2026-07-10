'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'
import { Genre } from '@/types/anime'

interface SearchFiltersProps {
  genres: Genre[]
}

export function SearchFilters({ genres }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    () => searchParams.get('genres')?.split(',').filter(Boolean) ?? []
  )
  const [selectedYear, setSelectedYear] = useState<string>(
    () => searchParams.get('year') ?? ''
  )
  const [selectedStatus, setSelectedStatus] = useState<string>(
    () => searchParams.get('status') ?? ''
  )
  const [showAllGenres, setShowAllGenres] = useState(false)

  const toggleGenre = (id: string) => {
    setSelectedGenres(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    const query = searchParams.get('q') || ''
    if (query) params.set('q', query)
    if (selectedGenres.length > 0) params.set('genres', selectedGenres.join(','))
    if (selectedYear) params.set('year', selectedYear)
    if (selectedStatus) params.set('status', selectedStatus)
    params.set('page', '1')
    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedGenres([])
    setSelectedYear('')
    setSelectedStatus('')
    const query = searchParams.get('q') || ''
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : '/search')
  }

  const visibleGenres = showAllGenres ? genres : genres.slice(0, 12)

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
      <div>
        <label className="text-sm font-medium mb-2 block">Géneros</label>
        <div className="flex flex-wrap gap-1.5">
          {visibleGenres.map((genre) => {
            const isSelected = selectedGenres.includes(String(genre.mal_id))
            return (
              <button
                key={genre.mal_id}
                onClick={() => toggleGenre(String(genre.mal_id))}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {genre.name}
              </button>
            )
          })}
        </div>
        {genres.length > 12 && (
          <button
            onClick={() => setShowAllGenres(!showAllGenres)}
            className="text-xs text-primary hover:underline mt-2"
          >
            {showAllGenres ? 'Ver menos' : `Ver todos (${genres.length})`}
          </button>
        )}
        {selectedGenres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedGenres.map(id => {
              const genre = genres.find(g => String(g.mal_id) === id)
              return genre ? (
                <span key={id} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-1">
                  {genre.name}
                  <button
                    onClick={() => toggleGenre(id)}
                    className="hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ) : null
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Año</label>
          <Select onValueChange={setSelectedYear} value={selectedYear || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Estado</label>
          <Select onValueChange={setSelectedStatus} value={selectedStatus || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="airing">En emisión</SelectItem>
              <SelectItem value="complete">Finalizado</SelectItem>
              <SelectItem value="upcoming">Próximo estreno</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button onClick={applyFilters}>Aplicar filtros</Button>
        <Button variant="outline" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" /> Limpiar
        </Button>
      </div>
    </div>
  )
}
