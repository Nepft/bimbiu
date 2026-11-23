<script setup lang="ts">
interface Props {
  label?: string
  lines?: number
}

withDefaults(defineProps<Props>(), {
  label: 'Memuat materi belajarmu...',
  lines: 3,
})
</script>

<template>
  <div class="loading-skeleton" aria-busy="true" aria-live="polite">
    <p class="loading-skeleton__label">
      {{ label }}
    </p>
    <div
      v-for="n in lines"
      :key="n"
      class="loading-skeleton__bar"
      :class="{ 'loading-skeleton__bar--short': n === 1 }"
    />
  </div>
</template>

<style scoped>
.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-6);
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-subtle);
  border-radius: var(--radius-xl);
}

.loading-skeleton__label {
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

.loading-skeleton__bar {
  width: 100%;
  height: 44px;
  background-color: var(--bg-disabled);
  border-radius: var(--radius-md);
}

.loading-skeleton__bar--short {
  width: 45%;
  height: 24px;
}
</style>
