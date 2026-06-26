import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AnimeNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <h2 className="text-2xl font-bold">Anime no encontrado</h2>
      <p className="text-muted-foreground">El anime que buscas no existe o fue eliminado.</p>
      <Link href="/">
        <Button>Volver al inicio</Button>
      </Link>
    </div>
  )
}
