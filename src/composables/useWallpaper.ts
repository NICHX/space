import { ref } from 'vue'

export type WallpaperSource = 'picsum' | 'custom'

const requestLog = new Map<string, number[]>()
const PICSUM_CACHE: string[] = []
let picsumCounter = 0

function rateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now()
  const timestamps = requestLog.get(key) || []
  const windowStart = now - windowMs
  const recent = timestamps.filter(t => t > windowStart)
  if (recent.length >= maxRequests) return false
  recent.push(now)
  requestLog.set(key, recent)
  return true
}

function getPicsumUrl(): string {
  picsumCounter++
  return `https://picsum.photos/1920/1080?random&t=${Date.now()}_${picsumCounter}`
}

function picsumFallback(): string {
  if (PICSUM_CACHE.length > 0) {
    return PICSUM_CACHE[PICSUM_CACHE.length - 1]
  }
  return getPicsumUrl()
}

function resolveUrl(source: WallpaperSource, customUrl?: string): string {
  switch (source) {
    case 'picsum': {
      if (!rateLimit('picsum', 10, 60_000)) return picsumFallback()
      const url = getPicsumUrl()
      PICSUM_CACHE.push(url)
      if (PICSUM_CACHE.length > 20) PICSUM_CACHE.shift()
      return url
    }
    case 'custom':
      return customUrl || getPicsumUrl()
    default:
      return picsumFallback()
  }
}

export function useWallpaper() {
  const url = ref('')
  const loaded = ref(false)
  const error = ref(false)

  function load(source: WallpaperSource, customUrl?: string) {
    loaded.value = false
    error.value = false
    const wallpaperUrl = resolveUrl(source, customUrl)
    url.value = wallpaperUrl

    const img = new Image()
    img.onload = () => { loaded.value = true }
    img.onerror = () => { error.value = true; loaded.value = true }
    img.src = wallpaperUrl
  }

  return { url, loaded, error, load }
}
