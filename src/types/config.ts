export interface NavLink {
  icon: string
  text: string
  url: string
}

export interface ThemeConfig {
  grid_columns: number
  hover_effect: 'up' | 'scale' | 'glow' | 'rotate' | 'shine' | 'lift' | 'pulse' | 'random'
  nav_bg: boolean
}

export interface BackgroundConfig {
  wallpaper_source?: 'picsum' | 'custom'
  custom_wallpaper_url?: string
}

export interface SearchConfig {
  default_engine: string
  engines: Record<string, string>
  engine_labels?: Record<string, string>
}

export interface SiteConfig {
  html_title: string
  logo: string
  motto: string
  copyright: string
  logo_gradient?: string
  theme?: ThemeConfig
  background?: BackgroundConfig
  search?: SearchConfig
  links?: NavLink[]
}
