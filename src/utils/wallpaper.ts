export type WallpaperSource = 'picsum' | 'bing' | 'custom'

export const WALLPAPER_SOURCES = [
  { key: 'picsum' as WallpaperSource, label: 'Picsum', url: '' },
  { key: 'bing' as WallpaperSource, label: 'Bing 每日', url: '' },
  { key: 'custom' as WallpaperSource, label: '自定义', url: '' },
]

/* ---- rate limiter ---- */
const requestLog = new Map<string, number[]>()

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

/* ---- Picsum cache + rate limit ---- */
const PICSUM_CACHE: string[] = []
let picsumCounter = 0

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

/* ---- Bing ---- */
let bingCache: { url: string; expiry: number } | null = null

const BING_API = '/bing-api?format=js&idx=0&n=1'

const BING_FETCHERS = [
  async () => { const r = await fetch(BING_API, { signal: AbortSignal.timeout(4000) }); return r.ok ? r.json() : null },
  async () => { const r = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1')}`, { signal: AbortSignal.timeout(6000) }); return r.ok ? r.json() : null },
  async () => { const r = await fetch(`https://corsproxy.io/?url=${encodeURIComponent('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1')}`, { signal: AbortSignal.timeout(6000) }); return r.ok ? r.json() : null },
]

async function fetchBingWallpaper(): Promise<string> {
  if (bingCache && Date.now() < bingCache.expiry) {
    return bingCache.url
  }
  for (const fetcher of BING_FETCHERS) {
    try {
      const data = await fetcher()
      if (!data) continue
      const path = data?.images?.[0]?.url
      if (path) {
        const url = `https://www.bing.com${path}`
        bingCache = { url, expiry: Date.now() + 3600_000 }
        return url
      }
    } catch {}
  }
  return getPicsumUrl()
}

export async function getWallpaperUrl(source: WallpaperSource, customUrl?: string): Promise<string> {
  switch (source) {
    case 'picsum': {
      if (!rateLimit('picsum', 10, 60_000)) {
        return picsumFallback()
      }
      const url = getPicsumUrl()
      PICSUM_CACHE.push(url)
      if (PICSUM_CACHE.length > 20) {
        PICSUM_CACHE.shift()
      }
      return url
    }
    case 'bing':
      return await fetchBingWallpaper()
    case 'custom':
      return customUrl || getPicsumUrl()
    default:
      return getPicsumUrl()
  }
}
