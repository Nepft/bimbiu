<script setup lang="ts">
interface Props {
  value: number
  max?: number
  label: string
  tone?: 'primary' | 'accent'
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  tone: 'primary',
})

const percentage = computed(() => {
  if (props.max <= 0) return 0
  return Math.min(100, Math.max(0, Math.round((props.value / props.max) * 100)))
})
</script>

<template>
  <div class="progress-track" role="progressbar" :aria-label="label" :aria-valuenow="value" aria-valuemin="0" :aria-valuemax="max">
    <div
      class="progress-fill"
      :class="`progress-fill--${tone}`"
      :style="{ width: `${percentage}%` }"
    />
  </div>
</template>

<style scoped>
.progress-track {
  width: 100%;
  height: 10px;
  background-color: var(--bg-surface-subtle);
  border-radius: var(--radius-pill);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: var(--radius-pill);
  transition: width var(--motion-progress);
}

.progress-fill--primary {
  background-color: var(--action-primary);
}

.progress-fill--accent {
  background-color: var(--action-accent);
}
</style>
