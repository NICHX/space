<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  slug: string
  source: 'simple' | 'lucide'
  size?: number
}>()

const imgError = ref(false)

watch([() => props.slug, () => props.source], () => {
  imgError.value = false
})

const iconSrc = computed(() => {
  if (props.source === 'simple') {
    return `https://cdn.simpleicons.org/${props.slug}/fff`
  }
  if (props.source === 'lucide') {
    return `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/${props.slug}.svg`
  }
  return ''
})

const imgSize = computed(() => props.size || 22)

function onError() {
  imgError.value = true
}
</script>

<template>
  <img
    v-if="iconSrc && !imgError"
    :src="iconSrc"
    :width="imgSize"
    :height="imgSize"
    :alt="slug"
    class="nav-icon"
    :class="{ 'lucide-icon': source === 'lucide' }"
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
.lucide-icon {
  filter: brightness(0) invert(1);
}
.nav-icon-empty {
  width: 22px;
  height: 22px;
}
</style>
