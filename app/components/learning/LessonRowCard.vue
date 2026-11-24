<script setup lang="ts">
interface Props {
  lessonNumber: string
  title: string
  description: string
  meta: string
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered' | 'locked'
  to?: string
}

const props = defineProps<Props>()

const isLocked = computed(() => props.status === 'locked')

const ctaLabel = computed(() => {
  if (props.status === 'in_progress') return 'Lanjutkan Kuis'
  if (props.status === 'completed' || props.status === 'mastered') return 'Ulangi Kuis'
  return 'Mulai Kuis'
})
</script>

<template>
  <article
    class="lesson-row"
    :class="{
      'lesson-row--locked': isLocked,
      'lesson-row--active': status === 'in_progress',
    }"
  >
    <div class="lesson-row__info">
      <div class="lesson-row__badges">
        <span class="lesson-row__num">{{ lessonNumber }}</span>
        <StatusBadge v-if="status === 'mastered'" label="Mastered" tone="accent" />
        <StatusBadge v-else-if="status === 'in_progress'" label="Sedang Dikerjakan" tone="accent" />
        <StatusBadge v-else-if="status === 'completed'" label="Selesai" tone="accent" />
        <span v-else-if="status === 'locked'" class="lesson-row__lock-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" stroke-width="2" />
          </svg>
          <span>Terkunci</span>
        </span>
      </div>

      <h3 class="lesson-row__title">
        {{ title }}
      </h3>
      <p class="lesson-row__desc">
        {{ description }}
      </p>
      <p class="lesson-row__meta" :class="{ 'lesson-row__meta--correct': status === 'mastered' }">
        {{ meta }}
      </p>
    </div>

    <div v-if="!isLocked && to" class="lesson-row__action">
      <AppButton
        :variant="status === 'in_progress' ? 'primary' : 'secondary'"
        :to="to"
      >
        {{ ctaLabel }}
      </AppButton>
    </div>
  </article>
</template>

<style scoped>
.lesson-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-5);
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-subtle);
  border-radius: var(--radius-lg);
}

.lesson-row--active {
  border: 2px solid var(--action-primary);
}

.lesson-row--locked {
  background-color: var(--bg-surface-subtle);
}

.lesson-row__info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}

.lesson-row__badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.lesson-row__num {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  background-color: var(--action-primary);
  color: var(--text-on-brand);
  border: 2px solid var(--action-primary-active);
  border-radius: 10px;
  box-shadow: 0 3px 0 var(--action-primary-active);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
}

.lesson-row--locked .lesson-row__num {
  background-color: var(--bg-surface-subtle);
  color: var(--text-primary);
  border-color: var(--border-control);
  box-shadow: 0 3px 0 var(--border-control);
}

.lesson-row__lock-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-pill);
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

.lesson-row__title {
  font-size: var(--text-h3);
}

.lesson-row__desc {
  color: var(--text-secondary);
}

.lesson-row__meta {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--action-primary);
}

.lesson-row__meta--correct {
  color: var(--feedback-correct-fg);
}

@media (min-width: 768px) {
  .lesson-row {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
