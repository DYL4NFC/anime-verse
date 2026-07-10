'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function WatchError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <h2 className="text-2xl font-bold">Error al cargar el episodio</h2>
      <p className="text-muted-foreground">
        No pudimos cargar el reproductor. Intenta de nuevo.
      </p>
      <Button onClick={unstable_retry}>Reintentar</Button>
    </div>
  )
}
