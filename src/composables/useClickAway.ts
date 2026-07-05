import { onMounted, onUnmounted, type Ref } from 'vue'

export function useClickAway(
  elRef: Ref<HTMLElement | null>,
  handler: () => void,
) {
  function onClick(e: MouseEvent) {
    const target = e.target as Node
    if (!elRef.value) return
    if (elRef.value.contains(target)) return
    handler()
  }

  onMounted(() => document.addEventListener('click', onClick, true))
  onUnmounted(() => document.removeEventListener('click', onClick, true))
}
