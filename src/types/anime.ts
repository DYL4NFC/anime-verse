export interface AnimeImage {
  image_url: string
  large_image_url: string
}

export interface Genre {
  mal_id: number
  name: string
}

export interface Anime {
  mal_id: number
  title: string
  title_english: string | null
  synopsis: string | null
  images: { jpg: AnimeImage; webp: AnimeImage }
  score: number | null
  scored_by: number | null
  rank: number | null
  episodes: number | null
  status: 'Finished Airing' | 'Currently Airing' | 'Not yet aired' | string
  type: 'TV' | 'Movie' | 'OVA' | 'ONA' | 'Special' | string
  genres: Genre[]
  year: number | null
  season: 'spring' | 'summer' | 'fall' | 'winter' | null
  rating: string | null
  trailer: {
    youtube_id: string | null
    url: string | null
    embed_url: string | null
  }
}

export interface Episode {
  mal_id: number
  title: string | null
  title_romanji: string | null
  title_japanese: string | null
  aired: string | null
  filler: boolean
  recap: boolean
  videoEmbedUrl?: string
  thumbnail?: string
}

export interface VideoSource {
  provider: 'youtube' | 'dailymotion' | 'archive'
  id: string
  embedUrl: string
}
