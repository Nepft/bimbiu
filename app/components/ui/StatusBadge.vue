<script setup lang="ts">
interface Props {
  label: string
  tone?: 'accent' | 'primary' | 'correct' | 'review' | 'neutral'
}

withDefaults(defineProps<Props>(), {
  tone: 'accent',
})
</script>

<template>
  <span class="status-badge" :class="`status-badge--${tone}`">
    {{ label }}
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  border: 1.5px solid transparent;
  font-size: var(--text-caption);
  font-weight: 600;
  line-height: 1.3;
  white-space: nowrap;
}

.status-badge--accent {
  background-color: var(--feedback-hint-bg);
  color: var(--feedback-hint-fg);
  border-color: var(--action-accent-border);
}

.status-badge--primary {
  background-color: var(--action-primary-tint);
  color: var(--action-primary-hover);
  border-color: var(--action-primary);
}

.status-badge--correct {
  background-color: var(--feedback-correct-bg);
  color: var(--feedback-correct-fg);
  border-color: var(--feedback-correct-fg);
}

.status-badge--review {
  background-color: var(--feedback-review-bg);
  color: var(--feedback-review-fg);
  border-color: var(--feedback-review-fg);
}

.status-badge--neutral {
  background-color: var(--bg-surface);
  color: var(--text-secondary);
  border-color: var(--border-subtle);
}
</style>
