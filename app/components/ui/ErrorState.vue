<script setup lang="ts">
interface Props {
  title: string
  description: string
  retryLabel?: string
}

withDefaults(defineProps<Props>(), {
  retryLabel: 'Coba Lagi',
})

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="error-state" role="alert">
    <div class="error-state__header">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
        <path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      <h2 class="error-state__title">
        {{ title }}
      </h2>
    </div>
    <p class="error-state__desc">
      {{ description }}
    </p>
    <div>
      <AppButton variant="secondary" @click="emit('retry')">
        {{ retryLabel }}
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background-color: var(--feedback-review-bg);
  border: 2px solid var(--feedback-review-fg);
  border-radius: var(--radius-lg);
}

.error-state__header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--feedback-review-fg);
}

.error-state__title {
  font-size: var(--text-h3);
  color: var(--feedback-review-fg);
}

.error-state__desc {
  color: var(--text-primary);
}
</style>
