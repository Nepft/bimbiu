<script setup lang="ts">
interface Props {
  variant?: 'flat' | 'tactile' | 'subtle' | 'tint'
  padding?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  variant: 'flat',
  padding: 'md',
})
</script>

<template>
  <div class="app-card" :class="[`app-card--${variant}`, `app-card--pad-${padding}`]">
    <slot />
  </div>
</template>

<style scoped>
.app-card {
  border-radius: var(--radius-xl);
  border: 1.5px solid var(--border-subtle);
  background-color: var(--bg-surface);
}

.app-card--tactile {
  border: 2px solid var(--border-strong);
  box-shadow: 0 3px 0 var(--border-strong);
}

.app-card--subtle {
  background-color: var(--bg-surface-subtle);
}

.app-card--tint {
  background-color: var(--action-primary-tint);
  border: 2px solid var(--action-primary);
  box-shadow: 0 3px 0 var(--action-primary);
}

.app-card--pad-sm {
  padding: var(--space-4);
}

.app-card--pad-md {
  padding: var(--space-5);
}

.app-card--pad-lg {
  padding: var(--space-6);
}
</style>
