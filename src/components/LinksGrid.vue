<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SiteConfig } from '@/types/config'
import { migrateIcon, smartIcon } from '@/utils/icons'
import NavIcon from '@/components/NavIcon.vue'

const props = defineProps<{
  config: SiteConfig
}>()

type HoverEffect = 'up' | 'scale' | 'glow' | 'rotate' | 'shine' | 'lift' | 'pulse'

const ALL_EFFECTS: HoverEffect[] = ['up', 'scale', 'glow', 'rotate', 'shine', 'lift', 'pulse']

const isCarousel = computed(() => props.config?.theme?.hover_effect === 'carousel')

const hoverEffect = computed(() => {
  const raw = props.config?.theme?.hover_effect || 'up'
  if (raw === 'random') {
    return ALL_EFFECTS[Math.floor(Math.random() * ALL_EFFECTS.length)]
  }
  if (raw === 'carousel') {
    return ALL_EFFECTS[0]
  }
  return raw
})

const carouselIndexes = ref<Record<number, number>>({})
const carouselTimers = ref<Record<number, ReturnType<typeof setInterval>>>({})

function carouselEnter(i: number) {
  if (!isCarousel.value) return
  clearCarousel(i)
  carouselIndexes.value[i] = 0
  carouselTimers.value[i] = setInterval(() => {
    carouselIndexes.value[i] = ((carouselIndexes.value[i] ?? 0) + 1) % ALL_EFFECTS.length
  }, 1200)
}

function clearCarousel(i: number) {
  if (carouselTimers.value[i]) {
    clearInterval(carouselTimers.value[i])
    delete carouselTimers.value[i]
  }
}

function carouselLeave(i: number) {
  if (!isCarousel.value) return
  clearCarousel(i)
  delete carouselIndexes.value[i]
}

function cubeEffect(i: number): string {
  if (isCarousel.value && carouselIndexes.value[i] !== undefined) {
    return ALL_EFFECTS[carouselIndexes.value[i]]
  }
  return hoverEffect.value
}

const gridCols = computed(() => props.config?.theme?.grid_columns || 5)
const compact = computed(() => props.config?.theme?.compact !== false)
const navBg = computed(() => props.config?.theme?.nav_bg !== false)
const iconSize = computed(() => props.config?.theme?.icon_size || 22)
const animate = computed(() => props.config?.theme?.animation !== false)

const links = computed(() => props.config?.links || [])

const resolvedIcons = computed(() => {
  return links.value.map(link => resolveIcon(link.icon, link.link, link.text))
})

function resolveIcon(icon: string | undefined, link?: string, text?: string): { slug: string; source: 'simple' | 'lucide' } {
  if (icon) {
    if (icon.startsWith('simple:') || icon.startsWith('lucide:')) {
      const parts = icon.split(':')
      return { slug: parts[1] || '', source: parts[0] as 'simple' | 'lucide' }
    }
    const migrated = migrateIcon(icon)
    if (migrated) return migrated
  }
  if (link) return smartIcon(link, text)
  return { slug: 'link', source: 'lucide' }
}
</script>

<template>
  <div class="links-container" :class="{ compact }">
    <div
      class="links-grid"
      :style="{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }"
    >
      <a
        v-for="(link, i) in links"
        :key="i"
        :href="link.link"
        target="_blank"
        rel="noopener noreferrer"
        class="nav-cube"
        :class="[`effect-${cubeEffect(i)}`, { 'no-bg': !navBg, 'cube-enter': animate }]"
        :style="animate ? { '--i': i } : undefined"
        @mouseenter="carouselEnter(i)"
        @mouseleave="carouselLeave(i)"
      >
        <div class="cube-icon">
          <NavIcon :slug="resolvedIcons[i].slug" :source="resolvedIcons[i].source" :size="iconSize" />
        </div>
        <span class="cube-text">{{ link.text }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.links-container {
  padding: 0 20px 80px;
  margin: 0 auto;
  width: 100%;
}
.links-grid {
  display: grid;
  gap: 8px;
}
.nav-cube {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80px;
  border-radius: 12px;
  background: var(--nav-bg);
  border: 1px solid var(--nav-border);
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.35s cubic-bezier(0.19, 1, 0.22, 1);
  cursor: pointer;
  gap: 6px;
}
.nav-cube:hover {
  background: var(--nav-hover-bg);
  border-color: var(--nav-hover-border);
}
.cube-icon {
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cube-text {
  font-size: 13px;
  font-weight: 300;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
}

/* ---- compact mode ---- */
.compact .nav-cube {
  height: 68px;
  border-radius: 10px;
  gap: 4px;
  background: var(--nav-border);
  border-color: transparent;
}
.compact .nav-cube:hover {
  background: var(--nav-hover-bg);
}
.compact .cube-text {
  font-size: 12px;
}
.compact .links-grid {
  gap: 6px;
}

/* ---- no background ---- */
.no-bg {
  background: transparent !important;
  border-color: transparent !important;
}

.effect-up:hover { transform: translateY(-5px); }
.effect-scale:hover { transform: scale(1.08); }
.effect-glow:hover {
  box-shadow:
    0 0 16px rgba(255,255,255,0.12),
    0 0 32px rgba(255,255,255,0.08),
    0 0 48px rgba(255,255,255,0.04);
  transform: translateY(-3px);
}
.effect-rotate {
  perspective: 600px;
}
.effect-rotate:hover {
  transform: rotateX(-6deg) rotateY(8deg) translateY(-6px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0,0,0,0.35);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
}
.effect-shine {
  overflow: hidden;
  position: relative;
}
.effect-shine::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -60%;
  width: 40%;
  height: 200%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transform: skewX(-20deg);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}
.effect-shine:hover::after {
  opacity: 1;
  animation: shine-sweep 0.5s ease-out forwards;
}
@keyframes shine-sweep {
  0% { left: -60%; }
  100% { left: 120%; }
}
.effect-lift:hover {
  transform: translateY(-8px);
  box-shadow:
    0 12px 28px rgba(0,0,0,0.25),
    0 4px 10px rgba(0,0,0,0.1);
}
.effect-pulse {
  position: relative;
}
.effect-pulse:hover::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  animation: pulse-ring 1.2s ease-out infinite;
}
@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.2); }
  50% { box-shadow: 0 0 0 10px rgba(255,255,255,0.06); }
  100% { box-shadow: 0 0 0 16px rgba(255,255,255,0); }
}

/* ---- entrance animation ---- */
.cube-enter {
  animation: cube-fade-up 0.4s ease-out both;
  animation-delay: calc(var(--i) * 40ms);
}
@keyframes cube-fade-up {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 576px) {
  .links-grid { grid-template-columns: repeat(3, 1fr) !important; }
  .compact .nav-cube { height: 60px; }
}
</style>
