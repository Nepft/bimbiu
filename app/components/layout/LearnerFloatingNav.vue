<script setup lang="ts">
const route = useRoute()

const navItems = [
  { label: 'Beranda', icon: 'home' as const, to: '/app', match: (path: string) => path === '/app' },
  { label: 'Belajar', icon: 'book' as const, to: '/app/learn', match: (path: string) => path.startsWith('/app/learn') || path.startsWith('/app/result') },
  { label: 'Progres', icon: 'chart' as const, to: '/app/progress', match: (path: string) => path.startsWith('/app/progress') },
  { label: 'Hadiah', icon: 'award' as const, to: '/app/rewards', match: (path: string) => path.startsWith('/app/rewards') },
]

const navRef = ref<HTMLElement | null>(null)
const itemEls = ref<HTMLElement[]>([])
const animateIndicator = ref(false)
const indicator = ref({ x: 0, y: 0, width: 0, height: 0, visible: false })

const activeIndex = computed(() => navItems.findIndex(item => item.match(route.path)))

function setItemRef(el: Element | ComponentPublicInstance | null, idx: number) {
  const domEl = el && '$el' in el ? (el.$el as HTMLElement) : (el as HTMLElement | null)
  if (domEl) {
    itemEls.value[idx] = domEl
  }
}

function updateIndicator() {
  const idx = activeIndex.value
  const target = idx >= 0 ? itemEls.value[idx] : undefined
  if (!target || !navRef.value) {
    indicator.value = { ...indicator.value, visible: false }
    return
  }

  indicator.value = {
    x: target.offsetLeft,
    y: target.offsetTop,
    width: target.offsetWidth,
    height: target.offsetHeight,
    visible: true,
  }
}

const indicatorStyle = computed(() => ({
  transform: `translate3d(${indicator.value.x}px, ${indicator.value.y}px, 0)`,
  width: `${indicator.value.width}px`,
  height: `${indicator.value.height}px`,
  opacity: indicator.value.visible ? 1 : 0,
}))

onMounted(async () => {
  await nextTick()
  updateIndicator()
  requestAnimationFrame(() => {
    animateIndicator.value = true
  })
  window.addEventListener('resize', updateIndicator)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIndicator)
})

watch(() => route.path, async () => {
  await nextTick()
  updateIndicator()
})
</script>

<template>
  <nav class="floating-nav-wrap" aria-label="Navigasi utama learner">
    <div ref="navRef" class="floating-nav">
      <span
        class="floating-nav__indicator"
        :class="{ 'floating-nav__indicator--animated': animateIndicator }"
        :style="indicatorStyle"
        aria-hidden="true"
      />
      <NuxtLink
        v-for="(item, idx) in navItems"
        :key="item.to"
        :ref="el => setItemRef(el, idx)"
        :to="item.to"
        class="floating-nav__item"
        :class="{ 'floating-nav__item--active': activeIndex === idx }"
        :aria-current="activeIndex === idx ? 'page' : undefined"
      >
        <AppIcon :name="item.icon" :size="20" class="floating-nav__icon" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.floating-nav-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(var(--space-4) + env(safe-area-inset-bottom));
  z-index: 500;
  display: flex;
  justify-content: center;
  padding: 0 var(--space-4);
  pointer-events: none;
}

.floating-nav {
  position: relative;
  pointer-events: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-2);
  width: 100%;
  max-width: 343px;
  padding: 8px;
  background-color: var(--bg-surface);
  border: 2px solid var(--border-strong);
  border-radius: var(--radius-xl);
  box-shadow: 0 4px 0 var(--border-strong);
}

.floating-nav__indicator {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  border-radius: var(--radius-md);
  background-color: var(--action-primary-tint);
  border: 1.5px solid var(--action-primary);
  pointer-events: none;
  will-change: transform, width, height;
}

.floating-nav__indicator--animated {
  transition:
    transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
    width 240ms cubic-bezier(0.22, 1, 0.36, 1),
    height 240ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 160ms ease;
}

.floating-nav__item {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  min-height: 48px;
  padding: 6px 4px;
  border-radius: var(--radius-md);
  border: 1.5px solid transparent;
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  transition: color 180ms ease, background-color 180ms ease;
}

.floating-nav__item:hover:not(.floating-nav__item--active) {
  background-color: var(--bg-surface-hover);
  color: var(--text-primary);
}

.floating-nav__icon {
  flex-shrink: 0;
}

.floating-nav__item--active {
  color: var(--action-primary-hover);
}

@media (prefers-reduced-motion: reduce) {
  .floating-nav__indicator--animated,
  .floating-nav__icon,
  .floating-nav__item {
    transition: none;
  }
}

@media (min-width: 640px) {
  .floating-nav-wrap {
    bottom: var(--space-6);
  }

  .floating-nav {
    display: inline-flex;
    width: auto;
    max-width: none;
    gap: var(--space-3);
    padding: 8px 10px;
  }

  .floating-nav__item {
    flex-direction: row;
    min-height: var(--touch-target-min);
    padding: 0 16px;
    gap: var(--space-2);
    font-size: var(--text-ui);
  }
}
</style>
