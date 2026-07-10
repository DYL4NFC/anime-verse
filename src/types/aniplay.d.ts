declare module 'aniplay' {
  export function fetchHD3Stream(title: string, episode: number): Promise<string>
  export function fetchHD6Stream(title: string, episode: number): Promise<string>
}
