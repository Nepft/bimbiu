<script setup lang="ts">
const route = useRoute()

const navItems = [
  { label: 'Beranda', icon: 'home' as const, to: '/app', match: (path: string) => path === '/app' },
  { label: 'Belajar', icon: 'book' as const, to: '/app/learn', match: (path: string) => path.startsWith('/app/learn') || path.startsWith('/app/result') },
  { label: 'Progres', icon: 'chart' as const, to: '/app/progress', match: (path: string) => path.startsWith('/app/progress') },
  { label: 'Hadiah', icon: 'award' as const, to: '/app/rewards', match: (path: string) => path.startsWith('/app/rewards') },
]
</script>

<template>
  <nav class="floating-nav-wrap" aria-label="Navigasi utama learner">
    <div class="floating-nav">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="floating-nav__item"
        :class="{ 'floating-nav__item--active': item.match(route.path) }"
        :aria-current="item.match(route.path) ? 'page' : undefined"
      >
        <AppIcon :name="item.icon" :size="20" />
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

.floating-nav__item {
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
  font-weight: 500;
  transition: background-color var(--motion-fast), color var(--motion-fast);
}

.floating-nav__item:hover {
  background-color: var(--bg-surface-hover);
  color: var(--text-primary);
}

.floating-nav__item--active {
  background-color: var(--action-primary-tint);
  border-color: var(--action-primary);
  color: var(--action-primary-hover);
  font-weight: 600;
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
