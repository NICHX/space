import { ref } from 'vue'
import { load as yamlLoad } from 'js-yaml'
import type { SiteConfig, ThemeConfig, BackgroundConfig, SearchConfig, NavLink } from '@/types/config'

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

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}

function isString(val: unknown): val is string {
  return typeof val === 'string'
}

function isHoverEffect(val: unknown): val is ThemeConfig['hover_effect'] {
  const effects = ['up', 'scale', 'glow', 'rotate', 'shine', 'lift', 'pulse', 'random']
  return isString(val) && effects.includes(val)
}

function parseTheme(raw: unknown): ThemeConfig {
  if (!isRecord(raw)) return { ...defaults.theme! }
  return {
    grid_columns: typeof raw.grid_columns === 'number'
      ? Math.min(8, Math.max(2, Math.floor(raw.grid_columns)))
      : defaults.theme!.grid_columns,
    hover_effect: isHoverEffect(raw.hover_effect) ? raw.hover_effect : defaults.theme!.hover_effect,
    nav_bg: typeof raw.nav_bg === 'boolean' ? raw.nav_bg : defaults.theme!.nav_bg,
  }
}

function parseBackground(raw: unknown): BackgroundConfig {
  if (!isRecord(raw)) return { ...defaults.background! }
  return {
    wallpaper_source: raw.wallpaper_source === 'custom' ? 'custom' : 'picsum',
    custom_wallpaper_url: isString(raw.custom_wallpaper_url) ? raw.custom_wallpaper_url : defaults.background!.custom_wallpaper_url,
  }
}

function parseSearch(raw: unknown): SearchConfig {
  if (!isRecord(raw)) return { ...defaults.search! }
  const enginesRaw = raw.engines
  let engines: Record<string, string>

  if (isRecord(enginesRaw)) {
    const valid = Object.fromEntries(
      Object.entries(enginesRaw).filter(([, v]) => isString(v))
    ) as Record<string, string>
    engines = { ...defaults.search!.engines, ...valid }
  } else {
    engines = { ...defaults.search!.engines }
  }

  const rawDefault = isString(raw.default_engine) ? raw.default_engine : defaults.search!.default_engine
  const defaultEngine = rawDefault in engines ? rawDefault : Object.keys(engines)[0]

  return {
    default_engine: defaultEngine,
    engines,
    engine_labels: isRecord(raw.engine_labels) ? raw.engine_labels as Record<string, string> : undefined,
  }
}

function parseLinks(raw: unknown): NavLink[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((item): item is NavLink =>
    isRecord(item) && isString(item.text) && isString(item.url)
  )
}

function normalizeConfig(raw: unknown): SiteConfig {
  const input = isRecord(raw) ? raw : {}

  return {
    html_title: isString(input.html_title) ? input.html_title : defaults.html_title,
    logo: isString(input.logo) ? input.logo : defaults.logo,
    motto: isString(input.motto) ? input.motto : defaults.motto,
    copyright: isString(input.copyright) ? input.copyright : defaults.copyright,
    logo_gradient: isString(input.logo_gradient) ? input.logo_gradient : undefined,
    theme: parseTheme(input.theme),
    background: parseBackground(input.background),
    search: parseSearch(input.search),
    links: parseLinks(input.links),
  }
}

export function useConfig() {
  const config = ref<SiteConfig | null>(null)
  const loading = ref(true)

  async function fetchConfig(): Promise<void> {
    loading.value = true
    let yamlConfig: unknown = {}
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}conf.yml`)
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
