export function useSmartHeader(threshold = 72) {
  const isHidden = ref(false)
  let lastScrollY = 0

  function onScroll() {
    const currentY = window.scrollY
    if (currentY <= 16) {
      isHidden.value = false
    } else if (currentY > lastScrollY && currentY > threshold) {
      isHidden.value = true
    } else if (currentY < lastScrollY) {
      isHidden.value = false
    }
    lastScrollY = currentY
  }

  onMounted(() => {
    lastScrollY = window.scrollY
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { isHidden }
}
