import { computed, type Ref } from 'vue'

export function useGreeting(username: Ref<string | undefined>) {
  const greeting = computed(() => {
    const name = username.value
    if (!name) return ''

    const hour = new Date().getHours()
    let phrase: string

    if (hour >= 5 && hour < 12) {
      phrase = '早上好'
    } else if (hour >= 12 && hour < 14) {
      phrase = '中午好'
    } else if (hour >= 14 && hour < 18) {
      phrase = '下午好'
    } else if (hour >= 18 && hour < 22) {
      phrase = '晚上好'
    } else {
      phrase = '夜深了'
    }

    return `${phrase}，${name}`
  })

  return { greeting }
}
