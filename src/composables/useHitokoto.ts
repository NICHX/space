import { ref } from 'vue'

const HITOKOTO_KEY = 'nav_hitokoto_cache'
const TTL_MS = 5 * 60 * 1000

interface HitokotoCache {
  text: string
  timestamp: number
}

export function useHitokoto() {
  const motto = ref('')

  async function fetchMotto(): Promise<void> {
    const cached = loadCache()
    if (cached) {
      motto.value = cached
      return
    }

    try {
      const resp = await fetch('https://v1.hitokoto.cn')
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const data = await resp.json()
      const text = data.hitokoto ? `「${data.hitokoto}」` : ''

      if (text) {
        saveCache(text)
        motto.value = text
      }
    } catch (e) {
      console.warn('[Hitokoto] fetch failed:', e)
    }
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
    } catch {
      // localStorage may be unavailable in private browsing
    }
    return null
  }

  function saveCache(text: string): void {
    try {
      const cache: HitokotoCache = { text, timestamp: Date.now() }
      localStorage.setItem(HITOKOTO_KEY, JSON.stringify(cache))
    } catch {
      // localStorage may be unavailable in private browsing
    }
  }

  return { motto, fetchMotto }
}
