<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const CACHE_PREFIX = 'navicon_'
const CACHE_VERSION = 1
const memoryCache = new Map<string, string>()
const inflight = new Map<string, Promise<string>>()

function getCached(key: string): string | null {
  if (memoryCache.has(key)) return memoryCache.get(key)!
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (raw) {
      const entry = JSON.parse(raw)
      if (entry?.v === CACHE_VERSION && entry?.d) {
        memoryCache.set(key, entry.d)
        return entry.d
      }
    }
  } catch {}
  return null
}

function setCache(key: string, value: string) {
  memoryCache.set(key, value)
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ v: CACHE_VERSION, d: value }))
  } catch {}
}

const props = defineProps<{
  slug: string
  source: 'simple' | 'lucide'
  size?: number
}>()

const imgError = ref(false)
const svgContent = ref('')

const cacheKey = computed(() => `${props.source}:${props.slug}`)

const isLucide = computed(() => props.source === 'lucide')

const iconUrl = computed(() => {
  if (props.source === 'simple') {
    return `https://cdn.simpleicons.org/${props.slug}/fff`
  }
  return `https://cdn.jsdelivr.net/npm/lucide-static@0.511.0/icons/${props.slug}.svg`
})

const imgSize = computed(() => props.size || 22)

watch([() => props.slug, () => props.source], () => {
  imgError.value = false
  svgContent.value = ''
  loadIcon()
}, { immediate: true })

function onError() {
  imgError.value = true
}

async function loadIcon() {
  const key = cacheKey.value

  const cached = getCached(key)
  if (cached) {
    svgContent.value = cached
    return
  }

  let task = inflight.get(key)
  if (!task) {
    task = (async () => {
      try {
        const res = await fetch(iconUrl.value)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        let svg = await res.text()
        svg = svg.replace(/width="[^"]*"/, '').replace(/height="[^"]*"/, '')
        setCache(key, svg)
        return svg
      } finally {
        inflight.delete(key)
      }
    })()
    inflight.set(key, task)
  }

  try {
    svgContent.value = await task
  } catch {
    // fallback to <img> tag
  }
}
</script>

<template>
  <span
    v-if="svgContent"
    class="nav-icon"
    :class="{ 'lucide-inline': isLucide }"
    :style="{ width: imgSize + 'px', height: imgSize + 'px' }"
    v-html="svgContent"
  />
  <img
    v-else-if="!imgError"
    :src="iconUrl"
    :width="imgSize"
    :height="imgSize"
    :alt="slug"
    class="nav-icon"
    :class="{ 'lucide-icon': isLucide }"
    loading="lazy"
    @error="onError"
  />
  <span v-else class="nav-icon nav-icon-empty" />
</template>

<style scoped>
.nav-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.nav-icon :deep(svg) {
  width: 100%;
  height: 100%;
}
.nav-icon.lucide-inline :deep(svg) {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.lucide-icon {
  filter: brightness(0) invert(1);
}
.nav-icon-empty {
  width: 22px;
  height: 22px;
}
</style>
