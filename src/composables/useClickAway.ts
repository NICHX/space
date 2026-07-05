import { onMounted, onUnmounted, type Ref } from 'vue'

export function useClickAway(
  elRef: Ref<HTMLElement | null>,
  handler: () => void,
  excludeRefs: Ref<HTMLElement | null>[] = [],
) {
  function onClick(e: MouseEvent) {
    const target = e.target as Node
    if (!elRef.value) return
    if (elRef.value.contains(target)) return
    for (const ref of excludeRefs) {
      if (ref.value && ref.value.contains(target)) return
    }
    handler()
  }

  onMounted(() => document.addEventListener('click', onClick, true))
  onUnmounted(() => document.removeEventListener('click', onClick, true))
}
