import { ref } from 'vue'
import { load as yamlLoad } from 'js-yaml'
import type { SiteConfig } from '@/types/config'

const defaults: SiteConfig = {
  html_title: '导航页',
  logo: 'Hi!',
  motto: '',
  copyright: '©2025',
  theme: {
    grid_columns: 5,
    hover_effect: 'up',
    nav_bg: true,
  },
  background: {
    wallpaper_source: 'picsum',
    custom_wallpaper_url: '',
  },
  search: {
    default_engine: 'google',
    engines: {
      google: 'https://www.google.com/search?q=',
      bing: 'https://www.bing.com/search?q=',
      baidu: 'https://www.baidu.com/s?wd=',
      duckduckgo: 'https://duckduckgo.com/?q=',
    },
  },
  links: [],
}

function normalizeConfig(raw: any): SiteConfig {
  const result: any = { ...defaults, ...raw }
  if (!result.theme) result.theme = { ...defaults.theme }
  else result.theme = { ...defaults.theme, ...result.theme }
  if (!result.background) result.background = { ...defaults.background }
  else result.background = { ...defaults.background, ...result.background }
  if (!result.search) result.search = { ...defaults.search }
  else result.search = { ...defaults.search, ...result.search }
  if (result.search?.engines) {
    const clean: Record<string, string> = {}
    const allKeys = new Set([...Object.keys(defaults.search.engines), ...Object.keys(result.search.engines)])
    for (const key of allKeys) {
      clean[key] = result.search.engines[key] || defaults.search.engines[key]
    }
    result.search.engines = clean
  }
  if (!result.links) result.links = []
  return result as SiteConfig
}

export function useConfig() {
  const config = ref<SiteConfig | null>(null)
  const loading = ref(true)

  async function fetchConfig(): Promise<void> {
    loading.value = true
    let yamlConfig: any = {}
    try {
      const res = await fetch('./conf.yml')
      const text = await res.text()
      const parsed = yamlLoad(text)
      if (parsed && typeof parsed === 'object') yamlConfig = parsed
    } catch (e) {
      console.warn('[Config] Failed to load conf.yml, using defaults:', e)
    }
    config.value = normalizeConfig(yamlConfig)
    loading.value = false
  }

  return {
    config,
    loading,
    fetchConfig,
  }
}
