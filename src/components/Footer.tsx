import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} AnimeVerse. Todos los derechos reservados.
        </p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">Inicio</Link>
          <Link href="/search" className="hover:underline">Buscar</Link>
        </div>
      </div>
    </footer>
  )
}
