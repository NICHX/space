export interface NavLink {
  icon: string
  text: string
  link: string
}

export interface ThemeConfig {
  mask_opacity: number
  grid_columns: number
  animation: boolean
  hover_effect: 'up' | 'scale' | 'glow' | 'rotate' | 'shine' | 'lift' | 'pulse' | 'random' | 'carousel'
  compact: boolean
  nav_bg: boolean
  icon_size: number
}

export interface BackgroundConfig {
  type: 'random' | 'solid'
  solid_color?: string
  wallpaper_source?: 'picsum' | 'bing' | 'custom'
  custom_wallpaper_url?: string
}

export interface SearchConfig {
  placeholder: string
  default_engine: string
  engines: Record<string, string>
}

export interface SiteConfig {
  html_title: string
  logo: string
  motto: string
  copyright: string
  random_cover?: boolean
  theme?: ThemeConfig
  background?: BackgroundConfig
  search?: SearchConfig
  links?: NavLink[]
}

export interface DeviceInfo {
  id: string
  name: string
  last_seen: string
  user_agent: string
}

export interface SyncData {
  config: SiteConfig
  devices: DeviceInfo[]
  updated_at: string
}
