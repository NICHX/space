import { ref, onMounted, onUnmounted } from 'vue'

export function useClock() {
  const time = ref('')
  const date = ref('')
  let timer: ReturnType<typeof setInterval> | null = null
  let lastDateStr = ''

  function formatDate(): string {
    return new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }

  function update() {
    const now = new Date()
    time.value = now.toLocaleTimeString('zh-CN', { hour12: false })
    const dateStr = formatDate()
    if (dateStr !== lastDateStr) {
      date.value = dateStr
      lastDateStr = dateStr
    }
  }

  function start() {
    date.value = formatDate()
    lastDateStr = date.value
    update()
    timer = setInterval(update, 1000)
  }

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  onMounted(start)
  onUnmounted(stop)

  return { time, date }
}
