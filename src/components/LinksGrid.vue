<script setup lang="ts">
import { computed } from 'vue'
import type { SiteConfig } from '@/types/config'
import NavIcon from '@/components/NavIcon.vue'

const props = defineProps<{
  config: SiteConfig
}>()

type HoverEffect = 'up' | 'scale' | 'glow' | 'rotate' | 'shine' | 'lift' | 'pulse' | 'random'

const ALL_EFFECTS: HoverEffect[] = ['up', 'scale', 'glow', 'rotate', 'shine', 'lift', 'pulse']

const hoverEffect = computed(() => {
  const raw = props.config?.theme?.hover_effect || 'up'
  if (raw === 'random') {
    return ALL_EFFECTS[Math.floor(Math.random() * ALL_EFFECTS.length)]
  }
  return raw
})

const gridCols = computed(() => props.config?.theme?.grid_columns || 5)
const navBg = computed(() => props.config?.theme?.nav_bg === true)

const links = computed(() => props.config?.links || [])

const resolvedIcons = computed(() => {
  return links.value.map(link => resolveIcon(link.icon))
})

function resolveIcon(icon: string | undefined): { slug: string; source: 'simple' | 'lucide' } {
  if (icon && (icon.startsWith('simple:') || icon.startsWith('lucide:'))) {
    const parts = icon.split(':')
    return { slug: parts[1] || '', source: parts[0] as 'simple' | 'lucide' }
  }
  return { slug: 'link', source: 'lucide' }
}
</script>

<template>
  <div class="links-container">
    <div
      class="links-grid"
      :style="{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }"
    >
      <a
        v-for="(link, i) in links"
        :key="i"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="nav-cube"
        :class="[`effect-${hoverEffect}`, { 'no-bg': !navBg }, 'cube-enter']"
        :style="{ '--i': i }"
      >
        <div class="cube-icon">
          <NavIcon :slug="resolvedIcons[i].slug" :source="resolvedIcons[i].source" :size="22" />
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
.nav-cube:active {
  transform: scale(0.96);
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

/* ---- no background ---- */
.no-bg {
  background: transparent !important;
  border-color: transparent !important;
}

/* ---- 鼠标悬停效果（仅支持 hover 的设备，自动排除触屏） ---- */
@media (hover: hover) {
  .nav-cube:hover {
    background: var(--nav-hover-bg);
    border-color: var(--nav-hover-border);
  }

  /* 1. up */
  .effect-up:hover {
    transform: translateY(-8px);
  }

  /* 2. scale */
  .effect-scale:hover {
    transform: scale(1.12);
  }

  /* 3. glow */
  .effect-glow::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.35s;
  }
  .effect-glow:hover::before {
    opacity: 1;
    animation: glow-cycle 3s ease-in-out infinite alternate;
  }
  .effect-glow:hover {
    transform: translateY(-2px);
  }

  /* 4. rotate */
  .effect-rotate {
    perspective: 500px;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.35s ease,
                background 0.35s cubic-bezier(0.19, 1, 0.22, 1),
                border-color 0.35s cubic-bezier(0.19, 1, 0.22, 1);
  }
  .effect-rotate:hover {
    transform: rotateX(-12deg) rotateY(18deg) translateY(-8px) scale(1.05);
    box-shadow: 0 20px 48px rgba(0,0,0,0.4);
  }

  /* 5. shine */
  .effect-shine {
    overflow: hidden;
    position: relative;
  }
  .effect-shine::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -80%;
    width: 45%;
    height: 200%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), rgba(255,255,255,0.07), transparent);
    transform: skewX(-25deg);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .effect-shine:hover::after {
    opacity: 1;
    animation: shine-sweep 0.55s ease-out forwards;
  }

  /* 6. lift */
  .effect-lift:hover {
    transform: translateY(-14px);
    box-shadow:
      0 24px 48px rgba(0,0,0,0.35),
      0 10px 20px rgba(0,0,0,0.2);
  }

  /* 7. pulse */
  .effect-pulse {
    position: relative;
  }
  .effect-pulse::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
  }
  .effect-pulse:hover::after {
    animation: pulse-ring 1.4s ease-out infinite;
  }
}

@keyframes glow-cycle {
  0% {
    box-shadow:
      0 0 20px rgba(99,102,241,0.7),
      0 0 40px rgba(99,102,241,0.35),
      0 0 60px rgba(99,102,241,0.12),
      0 0 80px rgba(99,102,241,0.04);
  }
  20% {
    box-shadow:
      0 0 20px rgba(59,130,246,0.7),
      0 0 40px rgba(59,130,246,0.35),
      0 0 60px rgba(59,130,246,0.12),
      0 0 80px rgba(59,130,246,0.04);
  }
  40% {
    box-shadow:
      0 0 20px rgba(244,114,182,0.7),
      0 0 40px rgba(244,114,182,0.35),
      0 0 60px rgba(244,114,182,0.12),
      0 0 80px rgba(244,114,182,0.04);
  }
  60% {
    box-shadow:
      0 0 20px rgba(34,211,238,0.7),
      0 0 40px rgba(34,211,238,0.35),
      0 0 60px rgba(34,211,238,0.12),
      0 0 80px rgba(34,211,238,0.04);
  }
  80% {
    box-shadow:
      0 0 20px rgba(251,146,60,0.7),
      0 0 40px rgba(251,146,60,0.35),
      0 0 60px rgba(251,146,60,0.12),
      0 0 80px rgba(251,146,60,0.04);
  }
  100% {
    box-shadow:
      0 0 20px rgba(52,211,153,0.7),
      0 0 40px rgba(52,211,153,0.35),
      0 0 60px rgba(52,211,153,0.12),
      0 0 80px rgba(52,211,153,0.04);
  }
}

@keyframes shine-sweep {
  0% { left: -80%; }
  100% { left: 130%; }
}

@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.3); }
  50% { box-shadow: 0 0 0 14px rgba(255,255,255,0.06); }
  100% { box-shadow: 0 0 0 24px rgba(255,255,255,0); }
}

/* ---- entrance animation ---- */
.cube-enter {
  animation: cube-fade-up 0.4s ease-out backwards;
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
}
</style>
