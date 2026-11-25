<script setup lang="ts">
interface Props {
  lessonNumber: string
  title: string
  description: string
  meta?: string
  estimatedMinutes?: number
  xpReward?: number
  questionCount?: number
  bestScore?: number
  attemptsCount?: number
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered' | 'locked'
  to?: string
}

const props = defineProps<Props>()

const isLocked = computed(() => props.status === 'locked')

const hasStructuredMeta = computed(() =>
  typeof props.estimatedMinutes === 'number' || typeof props.xpReward === 'number',
)

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
      <div v-if="hasStructuredMeta" class="lesson-row__pills">
        <span v-if="typeof estimatedMinutes === 'number'" class="lesson-chip lesson-chip--neutral">
          <AppIcon name="clock" :size="13" />
          <span>{{ estimatedMinutes }} menit</span>
        </span>
        <span v-if="typeof xpReward === 'number'" class="lesson-chip lesson-chip--xp">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M13 2.5L4.5 13.5H11.5L10.5 21.5L19.5 10.5H12.5L13 2.5Z" fill="#F2B632" fill-opacity="0.35" stroke="#9A5B00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>+{{ xpReward }} XP</span>
        </span>
        <span v-if="(attemptsCount ?? 0) > 0 && typeof bestScore === 'number'" class="lesson-chip lesson-chip--score">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3L14.6 8.3L20.5 9.15L16.25 13.3L17.25 19.15L12 16.4L6.75 19.15L7.75 13.3L3.5 9.15L9.4 8.3L12 3Z" fill="#0F6A5B" fill-opacity="0.2" stroke="#0F6A5B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>Skor terbaik: {{ bestScore }}</span>
        </span>
        <span v-else-if="typeof questionCount === 'number'" class="lesson-chip lesson-chip--info">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="#2563EB" fill-opacity="0.14" stroke="#1E40AF" stroke-width="2" />
            <path d="M8.5 12.2L10.8 14.5L15.5 9.8" stroke="#1E40AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>{{ questionCount }} soal</span>
        </span>
      </div>
      <p v-else-if="meta" class="lesson-row__meta" :class="{ 'lesson-row__meta--correct': status === 'mastered' }">
        {{ meta }}
      </p>
    </div>

    <div v-if="!isLocked && to" class="lesson-row__action">
      <AppButton
        :variant="status === 'in_progress' ? 'primary' : 'secondary'"
        :to="to"
        class="lesson-row__btn"
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
  transition: transform var(--motion-fast), box-shadow var(--motion-fast), border-color var(--motion-fast);
}

.lesson-row:not(.lesson-row--locked):hover {
  transform: translateY(-2px);
  border-color: var(--border-control);
  box-shadow: 0 4px 0 var(--border-subtle);
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

.lesson-row__pills {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
}

.lesson-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 600;
  line-height: 1.2;
}

.lesson-chip--neutral {
  background-color: #f5f7f9;
  border: 1px solid #e2e8ee;
  color: #334155;
}

.lesson-chip--xp {
  background-color: #fef6e4;
  border: 1px solid #f3d89b;
  color: #824d00;
  font-weight: 700;
}

.lesson-chip--score {
  background-color: #ecfdf5;
  border: 1px solid #bde7d5;
  color: #0f6a5b;
}

.lesson-chip--info {
  background-color: #eef4ff;
  border: 1px solid #c9dbfc;
  color: #1e40af;
}

.lesson-row__meta {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--action-primary);
}

.lesson-row__meta--correct {
  color: var(--feedback-correct-fg);
}

.lesson-row__btn {
  width: 100%;
}

@media (min-width: 768px) {
  .lesson-row {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .lesson-row__btn {
    width: auto;
  }
}
</style>
