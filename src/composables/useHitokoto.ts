import { ref } from 'vue'

const HITOKOTO_KEY = 'nav_hitokoto_cache'
const TTL_MS = 5 * 60 * 1000

interface HitokotoCache {
  text: string
  timestamp: number
}

export function useHitokoto() {
  const motto = ref('')

  async function fetchMotto(): Promise<string> {
    // try cache first
    const cached = loadCache()
    if (cached) return cached

    // rate limited fetch
    try {
      const resp = await fetch('https://v1.hitokoto.cn')
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const data = await resp.json()
      const text = data.hitokoto
        ? (data.hitokoto.length > 20
          ? `「${data.hitokoto.substring(0, 20)}...」`
          : `「${data.hitokoto}」`)
        : ''

      if (text) {
        saveCache(text)
        return text
      }
    } catch {}

    return ''
  }

  function loadCache(): string | null {
    try {
      const raw = localStorage.getItem(HITOKOTO_KEY)
      if (!raw) return null
      const cache: HitokotoCache = JSON.parse(raw)
      if (Date.now() - cache.timestamp < TTL_MS) {
        return cache.text
      }
      localStorage.removeItem(HITOKOTO_KEY)
    } catch {}
    return null
  }

  function saveCache(text: string): void {
    try {
      const cache: HitokotoCache = { text, timestamp: Date.now() }
      localStorage.setItem(HITOKOTO_KEY, JSON.stringify(cache))
    } catch {}
  }

  return { motto, fetchMotto }
}
