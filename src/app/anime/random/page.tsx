import { redirect } from 'next/navigation'
import { getRandomAnime } from '@/lib/randomAnime'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Anime aleatorio - AnimeVerse',
  description: 'Descubre un anime al azar en AnimeVerse.',
}

export default async function RandomAnimePage() {
  const anime = await getRandomAnime()
  if (!anime) redirect('/')
  redirect(`/anime/${anime.mal_id}`)
}
