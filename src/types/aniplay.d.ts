declare module 'aniplay' {
  export function fetchHD1Stream(
    anilistId: string | number,
    episode: string | number,
    subOrDub: 'sub' | 'dub',
  ): Promise<string>

  export function fetchHD2Stream(
    anilistId: string | number,
    episode: string | number,
    subOrDub: 'sub' | 'dub',
  ): Promise<string>

  export function fetchHD3Stream(title: string, episode: number): Promise<string>

  export function fetchHD4Stream(episodeID: string, subOrDub: string): Promise<string>

  export function fetchHD5Stream(malID: string | number, episode: string | number): Promise<string>

  export function fetchHD6Stream(title: string, episode: number): Promise<string>
}
