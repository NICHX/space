<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, ChevronDown } from 'lucide-vue-next'
import { useClickAway } from '@/composables/useClickAway'

const props = defineProps<{
  engines: Record<string, string>
  defaultEngine: string
  placeholder: string
}>()

const showDropdown = ref(false)
const currentEngine = ref(props.defaultEngine || 'google')
const query = ref('')
const searchRef = ref<HTMLElement | null>(null)

useClickAway(searchRef, () => { showDropdown.value = false })

const engineKeys = computed(() => Object.keys(props.engines || {}))
const engineLabels: Record<string, string> = {
  google: 'Google', bing: 'Bing', baidu: '百度', duckduckgo: 'DuckDuckGo',
}
const engineLabel = computed(() => engineLabels[currentEngine.value] || currentEngine.value)
function engineLabelOf(key: string): string {
  return engineLabels[key] || key
}

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

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') doSearch()
}
</script>

<template>
  <div ref="searchRef" class="search-wrapper">
    <div class="search-box">
      <div class="engine-selector" @click="showDropdown = !showDropdown">
        <span class="engine-label">{{ engineLabel }}</span>
        <ChevronDown :size="12" />
        <div v-if="showDropdown" class="engine-dropdown" @click.stop>
          <div
            v-for="key in engineKeys"
            :key="key"
            class="engine-option"
            :class="{ active: key === currentEngine }"
            @click="selectEngine(key)"
          >
            {{ engineLabelOf(key) }}
          </div>
        </div>
      </div>
      <div class="search-divider" />
      <input
        v-model="query"
        class="search-input"
        :placeholder="placeholder"
        @keydown="handleKeydown"
      />
      <button class="search-btn" @click="doSearch">
        <Search :size="16" />
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
}
.search-box {
  display: flex;
  align-items: center;
  width: 600px;
  max-width: 100%;
  background: var(--search-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--search-border);
  border-radius: 28px;
  padding: 2px 4px 2px 18px;
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
  gap: 3px;
  cursor: pointer;
  color: var(--search-engine-label);
  font-size: 12.5px;
  white-space: nowrap;
  position: relative;
  user-select: none;
  flex-shrink: 0;
}
.engine-label {
  font-weight: 500;
}
.engine-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: var(--search-dropdown-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--search-dropdown-border);
  border-radius: 10px;
  padding: 4px;
  z-index: 9999;
  min-width: 120px;
}
.engine-option {
  padding: 7px 14px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--search-dropdown-text);
  font-size: 13px;
  transition: all 0.15s;
}
.engine-option:hover,
.engine-option.active {
  background: var(--search-dropdown-hover);
  color: var(--text-primary);
}
.search-divider {
  width: 1px;
  height: 18px;
  background: var(--search-divider);
  margin: 0 10px;
  flex-shrink: 0;
}
.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--search-text);
  font-size: 15px;
  padding: 7px 0;
  min-width: 0;
}
.search-input::placeholder {
  color: var(--search-placeholder);
}
.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: var(--search-btn-bg);
  color: var(--search-text);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.search-btn:hover {
  background: var(--search-btn-hover);
}

@media (max-width: 576px) {
  .search-wrapper {
    max-width: 100%;
    padding: 0 12px 18px;
  }
  .search-box {
    width: 100%;
  }
}
</style>
