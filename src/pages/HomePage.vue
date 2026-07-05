<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useConfig } from '@/composables/useConfig'
import ClockDisplay from '@/components/ClockDisplay.vue'
import SearchBar from '@/components/SearchBar.vue'
import LinksGrid from '@/components/LinksGrid.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useHitokoto } from '@/composables/useHitokoto'
import { getWallpaperUrl } from '@/utils/wallpaper'
import type { WallpaperSource } from '@/utils/wallpaper'

const { config, loading, fetchConfig } = useConfig()
const { motto, fetchMotto } = useHitokoto()

const bgStyle = ref('')

const DEFAULT_BG = '#1a1a2e'
const FALLBACK_BG = DEFAULT_BG

async function setBgStyle() {
  if (!config.value) return
  if (config.value.random_cover || config.value.background?.type === 'random') {
    const source = (config.value.background?.wallpaper_source || 'picsum') as WallpaperSource
    const wallpaperUrl = await getWallpaperUrl(source, config.value.background?.custom_wallpaper_url)
    bgStyle.value = `background-image: url('${wallpaperUrl}'); background-color: ${DEFAULT_BG}`
  } else if (config.value.background?.type === 'solid' && config.value.background?.solid_color) {
    bgStyle.value = `background-color: ${config.value.background.solid_color}`
  } else {
    bgStyle.value = `background-color: ${DEFAULT_BG}`
  }
}

watch(() => config.value?.background, setBgStyle, { deep: true, immediate: true })

onMounted(async () => {
  await fetchConfig()
  if (config.value) {
    document.title = config.value.html_title

    if (!config.value.motto) {
      motto.value = await fetchMotto()
    } else {
      motto.value = config.value.motto
    }
  }
})
</script>

<template>
  <div v-if="!loading && config" class="page" :style="bgStyle">
    <div class="mask-layer" :style="{ opacity: config.theme?.mask_opacity ?? 0.7 }" />
    <div class="page-header">
      <div class="header-left">
        <ClockDisplay />
      </div>
    </div>

    <div class="hero">
      <div class="logo">
        <h1>{{ config.logo }}</h1>
      </div>
      <div v-if="motto" class="motto">{{ motto }}</div>
      <SearchBar
        v-if="config.search"
        :engines="config.search.engines"
        :default-engine="config.search.default_engine"
        :placeholder="config.search.placeholder"
      />
    </div>

    <div class="nav-area">
      <LinksGrid :config="config" />
    </div>

    <div class="copyright">{{ config.copyright }}</div>
  </div>
  <LoadingSpinner v-else-if="loading" :show="loading" />
</template>

<style scoped>
.page {
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}
.mask-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--mask-layer);
  pointer-events: none;
  z-index: 0;
}
.page-header {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px 0;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.header-left .clock { text-align: left; }
.header-left .clock-time { font-size: 28px; font-weight: 400; letter-spacing: 2px; line-height: 1.1; }
.header-left .clock-date { font-size: 13px; margin-top: 1px; font-weight: 300; opacity: 0.7; }
.hero {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px 30px;
}
.logo h1 {
  font-size: 96px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-shadow: 0 2px 20px rgba(0,0,0,0.3);
}
.motto {
  font-size: 15px;
  color: var(--text-on-light);
  margin: 10px 0 24px;
  text-align: center;
  max-width: 500px;
  line-height: 1.5;
  text-shadow: 0 1px 8px rgba(0,0,0,0.2);
}
.nav-area {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px 40px;
}
.copyright {
  position: fixed;
  bottom: 12px;
  right: 16px;
  z-index: 1;
  font-size: 11px;
  color: var(--text-on-light-dim);
}

@media (max-width: 576px) {
  .page-header {
    padding: 14px 16px 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .hero { padding: 40px 16px 24px; }
  .logo h1 { font-size: 36px; }
  .nav-area { padding: 0 12px 24px; }
}
</style>
