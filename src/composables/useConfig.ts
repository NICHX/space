import { ref } from 'vue'
import { load as yamlLoad } from 'js-yaml'
import type { SiteConfig } from '@/types/config'
import { migrateIcon } from '@/utils/icons'

const defaults: SiteConfig = {
  html_title: '导航页',
  logo: 'Hi!',
  motto: '',
  copyright: '©2025',
  random_cover: true,
  theme: {
    mask_opacity: 0.7,
    grid_columns: 5,
    animation: true,
    hover_effect: 'up',
    compact: true,
    nav_bg: true,
    icon_size: 22,
  },
  background: {
    type: 'random',
    solid_color: '#1a1a2e',
    wallpaper_source: 'picsum',
    custom_wallpaper_url: '',
  },
  search: {
    placeholder: '搜索...',
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
    for (const key of Object.keys(defaults.search.engines)) {
      clean[key] = result.search.engines[key] || defaults.search.engines[key]
    }
    result.search.engines = clean
  }
  if (result.conf && (!result.links || result.links.length === 0)) {
    result.links = result.conf
  }
  if (!result.links) result.links = []
  result.links.forEach((l: any) => {
    if (l.icon && !l.icon.startsWith('simple:') && !l.icon.startsWith('lucide:')) {
      const migrated = migrateIcon(l.icon)
      if (migrated) l.icon = `${migrated.source}:${migrated.slug}`
    }
  })
  return result as SiteConfig
}

export function useConfig() {
  const config = ref<SiteConfig | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function fetchConfig(): Promise<void> {
    try {
      loading.value = true
      let yamlConfig: any = {}
      try {
        const res = await fetch('./conf.yml')
        const text = await res.text()
        const parsed = yamlLoad(text)
        if (parsed && typeof parsed === 'object') yamlConfig = parsed
      } catch {}
      config.value = normalizeConfig(yamlConfig)
      error.value = null
    } catch (e: any) {
      error.value = e.message
      config.value = normalizeConfig({})
    } finally {
      loading.value = false
    }
  }

  return {
    config,
    loading,
    error,
    fetchConfig,
  }
}
