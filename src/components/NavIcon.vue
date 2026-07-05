<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const iconCache = new Map<string, string>()

const props = defineProps<{
  slug: string
  source: 'simple' | 'lucide'
  size?: number
}>()

const imgError = ref(false)
const svgContent = ref('')

watch([() => props.slug, () => props.source], () => {
  imgError.value = false
  loadSvg()
})

const cacheKey = computed(() => `${props.source}:${props.slug}`)

const iconSrc = computed(() => {
  if (props.source === 'simple') {
    return `https://cdn.simpleicons.org/${props.slug}/fff`
  }
  return `https://cdn.jsdelivr.net/npm/lucide-static@0.511.0/icons/${props.slug}.svg`
})

const isLucide = computed(() => props.source === 'lucide')

const imgSize = computed(() => props.size || 22)

function onError() {
  imgError.value = true
}

async function loadSvg() {
  if (!isLucide.value) return

  const key = cacheKey.value
  const cached = iconCache.get(key)
  if (cached) {
    svgContent.value = cached
    return
  }

  try {
    const res = await fetch(iconSrc.value)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    let svg = await res.text()
    svg = svg.replace(/width="[^"]*"/, '').replace(/height="[^"]*"/, '')
    iconCache.set(key, svg)
    svgContent.value = svg
  } catch {
    onError()
  }
}
</script>

<template>
  <span
    v-if="svgContent"
    class="nav-icon"
    :style="{ width: imgSize + 'px', height: imgSize + 'px' }"
    v-html="svgContent"
  />
  <img
    v-else-if="iconSrc && !imgError"
    :src="iconSrc"
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
