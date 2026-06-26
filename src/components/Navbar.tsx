import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Dices } from 'lucide-react'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold">
            AnimeVerse
          </Link>
          <Link href="/upcoming" className="hidden md:block text-sm text-muted-foreground hover:text-foreground transition-colors">
            Próximos
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <form action="/search" className="hidden md:flex items-center gap-2">
            <Input
              type="search"
              name="q"
              placeholder="Buscar anime..."
              className="w-[200px] lg:w-[300px]"
            />
            <Button type="submit" size="icon" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <Link href="/search" className="md:hidden">
            <Button size="icon" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/anime/random">
            <Button size="icon" variant="ghost" title="Anime aleatorio">
              <Dices className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="container md:hidden pb-3 px-4">
        <form action="/search" className="flex items-center gap-2">
          <Input
            type="search"
            name="q"
            placeholder="Buscar anime..."
            className="flex-1"
          />
          <Button type="submit" size="sm">Buscar</Button>
        </form>
      </div>
    </header>
  )
}
