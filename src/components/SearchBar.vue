<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, ChevronDown, X } from 'lucide-vue-next'
import { useClickAway } from '@/composables/useClickAway'

const props = defineProps<{
  engines: Record<string, string>
  defaultEngine: string
  engineLabels?: Record<string, string>
}>()

const showDropdown = ref(false)
const currentEngine = ref(props.defaultEngine || 'google')
const query = ref('')
const searchRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

watch(() => props.defaultEngine, (val) => {
  currentEngine.value = val || 'google'
})

useClickAway(searchRef, () => { showDropdown.value = false })

const engineKeys = computed(() => Object.keys(props.engines || {}))

function engineLabel(key: string): string {
  if (props.engineLabels?.[key]) return props.engineLabels[key]
  const baseUrl = props.engines?.[key]
  if (!baseUrl) return key
  try {
    const host = new URL(baseUrl).hostname.replace(/^www\./, '')
    const parts = host.split('.')
    return parts.length >= 2 ? parts[0] : host
  } catch {
    return key
  }
}

const currentEngineLabel = computed(() => engineLabel(currentEngine.value))

function selectEngine(key: string) {
  currentEngine.value = key
  showDropdown.value = false
}

function doSearch() {
  if (!query.value?.trim()) return
  const baseUrl = props.engines?.[currentEngine.value]
  if (baseUrl) {
    window.open(baseUrl + encodeURIComponent(query.value.trim()), '_blank')
  }
}

function clearQuery() {
  query.value = ''
  inputRef.value?.focus()
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') doSearch()
  if (e.key === 'Escape') {
    e.preventDefault()
    inputRef.value?.blur()
  }
}
</script>

<template>
  <div ref="searchRef" class="search-wrapper">
    <div class="search-box">
      <div
        class="engine-selector"
        role="combobox"
        aria-haspopup="listbox"
        :aria-expanded="showDropdown"
        @click="showDropdown = !showDropdown"
      >
        <span class="engine-label">{{ currentEngineLabel }}</span>
        <ChevronDown :size="12" class="chevron" :class="{ open: showDropdown }" />
        <Transition name="drop">
          <div v-if="showDropdown" class="engine-dropdown" role="listbox" @click.stop>
            <div
              v-for="key in engineKeys"
              :key="key"
              role="option"
              class="engine-option"
              :class="{ active: key === currentEngine }"
              :aria-selected="key === currentEngine"
              @click="selectEngine(key)"
            >
              {{ engineLabel(key) }}
            </div>
          </div>
        </Transition>
      </div>
      <div class="search-divider" />
      <input
        ref="inputRef"
        v-model="query"
        class="search-input"
        placeholder="搜索..."
        aria-label="搜索"
        @keydown="handleKeydown"
      />
      <button
        v-if="query"
        class="clear-btn"
        aria-label="清除搜索内容"
        @click="clearQuery"
      >
        <X :size="14" />
      </button>
      <button class="search-btn" aria-label="搜索" @click="doSearch">
        <Search :size="14" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px 24px;
  position: relative;
  z-index: 1;
}
.search-box {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 640px;
  min-width: 0;
  background: var(--search-bg);
  border: 1px solid var(--search-border);
  border-radius: 28px;
  padding: 0 4px 0 16px;
  transition: all 0.3s;
}
.search-box:focus-within {
  background: var(--search-focus-bg);
  border-color: var(--search-focus-border);
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
}
.engine-selector {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: var(--search-engine-label);
  font-size: 12.5px;
  white-space: nowrap;
  position: relative;
  user-select: none;
  flex-shrink: 0;
}
.chevron {
  transition: transform 0.2s;
}
.chevron.open {
  transform: rotate(180deg);
}
.engine-label {
  font-weight: 500;
}
.engine-dropdown {
  position: absolute;
  top: 100%;
  left: -8px;
  margin-top: 6px;
  background: var(--search-dropdown-bg);
  border: 1px solid var(--search-dropdown-border);
  border-radius: 10px;
  padding: 6px;
  z-index: 9999;
  min-width: 130px;
}
.engine-option {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--search-dropdown-text);
  font-size: 13px;
  transition: background 0.15s;
}
.engine-option + .engine-option {
  margin-top: 2px;
}
.engine-option:hover,
.engine-option.active {
  background: var(--search-dropdown-hover);
  color: var(--text-primary);
}

/* drop transition */
.drop-enter-active {
  transition: opacity 0.15s, transform 0.15s;
}
.drop-leave-active {
  transition: opacity 0.1s;
}
.drop-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
.drop-leave-to {
  opacity: 0;
}
.search-divider {
  width: 1px;
  height: 20px;
  background: var(--search-divider);
  margin: 0 12px;
  flex-shrink: 0;
}
.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--search-text);
  font-size: 15px;
  padding: 10px 0;
  min-width: 0;
}
.search-input::placeholder {
  color: var(--search-placeholder);
}
.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background: none;
  color: var(--text-tertiary);
  cursor: pointer;
  flex-shrink: 0;
  margin-right: 2px;
  transition: all 0.2s;
}
.clear-btn:hover {
  color: var(--text-secondary);
  background: var(--hover-bg);
}
.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: var(--search-btn-bg);
  color: var(--search-text);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  margin-right: 3px;
}
.search-btn:hover {
  background: var(--search-btn-hover);
  transform: scale(1.08);
}
.search-btn:active {
  transform: scale(0.95);
}

@media (min-width: 1200px) {
  .search-box {
    max-width: 720px;
  }
}

@media (max-width: 576px) {
  .search-wrapper {
    max-width: 100%;
    padding: 0 12px 18px;
  }
  .search-box {
    max-width: 100%;
  }
}
</style>
