import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-muted-foreground text-lg">Página no encontrada</p>
      <p className="text-sm text-muted-foreground">
        La página que buscas no existe o fue movida.
      </p>
      <Link href="/">
        <Button>Volver al inicio</Button>
      </Link>
    </div>
  )
}
