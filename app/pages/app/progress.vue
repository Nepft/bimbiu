<script setup lang="ts">
import type { IllustrationName } from '~/components/ui/BimbiuIllustration.vue'

definePageMeta({ layout: 'learner' })
useHead({ title: 'Progres Belajar - Bimbiu' })

interface ProgressResponse {
  completedLessonsCount: number
  masteredLessonsCount: number
  inProgressCount: number
  notStartedCount: number
  totalLessonsCount: number
  averageScore: number
  lessonProgress: Array<{
    id: string
    icon: string
    title: string
    categoryTitle: string
    attemptsCount: number
    statusLabel: string
    scoreLabel: string
    active: boolean
  }>
  recentHistory: Array<{
    attemptId: string
    lessonId: string
    lessonTitle: string
    score: number
    statusLabel: string
    xpAwarded: number
    completedAt: string | null
  }>
}

const { data: progress } = await useFetch<ProgressResponse>('/api/progress')

const hasProgress = computed(
  () =>
    (progress.value?.lessonProgress.length ?? 0) > 0
    || (progress.value?.recentHistory.length ?? 0) > 0,
)

const stats = computed(() => {
  const done = progress.value?.completedLessonsCount ?? 0
  const mastered = progress.value?.masteredLessonsCount ?? 0
  const inProg = progress.value?.inProgressCount ?? 0
  const total = progress.value?.totalLessonsCount ?? 12
  const remaining = progress.value?.notStartedCount ?? total

  const donePct = Math.min(100, Math.max(done > 0 ? 8 : 0, Math.round((done / Math.max(1, total)) * 100)))
  const inProgPct = Math.min(100, Math.max(inProg > 0 ? 12 : 0, Math.round((inProg / Math.max(1, total)) * 100)))
  const remPct = Math.min(100, Math.max(remaining > 0 ? 8 : 0, Math.round((remaining / Math.max(1, total)) * 100)))

  return [
    {
      label: 'Pelajaran Selesai',
      icon: 'done' as const,
      val: `${done} Pelajaran`,
      pill: `${mastered} Mastered`,
      tone: 'teal' as const,
      barColor: '#0F6A5B',
      progress: donePct,
      note: `${mastered} sudah Mastered (>=80%)`,
    },
    {
      label: 'Sedang Dikerjakan',
      icon: 'clock' as const,
      val: `${inProg} Pelajaran`,
      pill: 'Aktif',
      tone: 'gold' as const,
      barColor: '#D97706',
      progress: inProgPct,
      note: 'Bisa dilanjutkan kapan saja',
    },
    {
      label: 'Belum Dimulai',
      icon: 'book' as const,
      val: `${remaining} Pelajaran`,
      pill: 'Siap Dicoba',
      tone: 'blue' as const,
      barColor: '#1E40AF',
      progress: remPct,
      note: 'Tersedia di katalog Belajar',
    },
  ]
})

function formatDate(iso: string | null): string {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="progress-page">
    <header class="progress-page__header">
      <h1 class="progress-page__title">
        Progres Belajarmu
      </h1>
      <p class="progress-page__subtitle">
        Pantau pelajaran yang sudah selesai, nilai terbaik, dan riwayat pengerjaanmu.
      </p>
    </header>

    <EmptyState
      v-if="!hasProgress"
      title="Belum Ada Progres Pelajaran"
      description="Kamu belum menyelesaikan pelajaran apa pun. Pilih satu kategori untuk mulai kuis pertamamu."
      action-label="Lihat Kategori Belajar"
      action-to="/app/learn"
    />

    <template v-else>
      <section class="progress-stats" aria-label="Ringkasan status belajar">
        <article v-for="s in stats" :key="s.label" class="progress-stats__card">
          <div class="progress-stats__top">
            <span class="progress-stats__icon-box" :class="`progress-stats__icon-box--${s.tone}`" aria-hidden="true">
              <svg v-if="s.icon === 'done'" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" fill="#0F6A5B" fill-opacity="0.14" stroke="#0F6A5B" stroke-width="2" />
                <path d="M8.5 12.2L10.8 14.5L15.5 9.8" stroke="#0F6A5B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg v-else-if="s.icon === 'clock'" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" fill="#F2B632" fill-opacity="0.22" stroke="#9A5B00" stroke-width="2" />
                <path d="M12 7.5V12L15 13.8" stroke="#9A5B00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M2 5.5C2 4.67 2.67 4 3.5 4H8.5C10.43 4 12 5.57 12 7.5V20C12 18.62 10.88 17.5 9.5 17.5H3.5C2.67 17.5 2 16.83 2 16V5.5Z" fill="#2563EB" fill-opacity="0.12" stroke="#1E40AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M22 5.5C22 4.67 21.33 4 20.5 4H15.5C13.57 4 12 5.57 12 7.5V20C12 18.62 13.12 17.5 14.5 17.5H20.5C21.33 17.5 22 16.83 22 16V5.5Z" fill="#2563EB" fill-opacity="0.12" stroke="#1E40AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span class="progress-stats__pill" :class="`progress-stats__pill--${s.tone}`">
              {{ s.pill }}
            </span>
          </div>
          <div class="progress-stats__metric">
            <p class="progress-stats__label">
              {{ s.label }}
            </p>
            <p class="progress-stats__val tabular-nums">
              {{ s.val }}
            </p>
          </div>
          <div class="progress-stats__footer">
            <div class="progress-stats__track" aria-hidden="true">
              <div class="progress-stats__fill" :style="{ width: `${s.progress}%`, backgroundColor: s.barColor }" />
            </div>
            <p class="progress-stats__note">
              {{ s.note }}
            </p>
          </div>
        </article>
      </section>

      <section class="progress-list">
        <h2 class="progress-page__section-title">
          Daftar Progres Pelajaran
        </h2>
        <div class="progress-list__rows">
          <AppCard v-for="row in progress?.lessonProgress ?? []" :key="row.id" padding="md" class="progress-row">
            <div class="progress-row__lead">
              <BimbiuIllustration :name="(row.icon as IllustrationName)" :size="44" />
              <div class="progress-row__left">
                <p class="progress-row__meta">
                  {{ row.categoryTitle }} · {{ row.attemptsCount }} attempt
                </p>
                <h3 class="progress-row__title">
                  {{ row.title }}
                </h3>
              </div>
            </div>
            <div class="progress-row__right">
              <div class="progress-row__badges">
                <StatusBadge :label="row.statusLabel" tone="accent" />
                <span class="progress-row__score tabular-nums">{{ row.scoreLabel }}</span>
              </div>
              <AppButton
                :variant="row.active ? 'primary' : 'secondary'"
                :to="`/app/lesson/${row.id}`"
                class="progress-row__btn-desktop"
              >
                {{ row.active ? 'Lanjutkan Kuis' : 'Ulangi Kuis' }}
              </AppButton>
              <NuxtLink
                :to="`/app/lesson/${row.id}`"
                class="progress-row__btn-mobile"
                :class="{ 'progress-row__btn-mobile--primary': row.active }"
                :aria-label="row.active ? `Lanjutkan ${row.title}` : `Ulangi ${row.title}`"
              >
                <AppIcon :name="row.active ? 'play' : 'refresh'" :size="18" />
              </NuxtLink>
            </div>
          </AppCard>
        </div>
      </section>

      <section v-if="progress?.recentHistory.length" class="progress-history">
        <div class="progress-history__header">
          <h2 class="progress-page__section-title">
            Riwayat Attempt Terbaru
          </h2>
          <span class="progress-history__count">
            {{ progress.recentHistory.length }} terbaru
          </span>
        </div>
        <div class="history-card">
          <div
            v-for="att in progress.recentHistory"
            :key="att.attemptId"
            class="history-item"
          >
            <div class="history-item__lead">
              <div class="history-item__identity">
                <span
                  class="history-item__score-box tabular-nums"
                  :class="att.score >= 80 ? 'history-item__score-box--mastered' : 'history-item__score-box--done'"
                >
                  {{ att.score }}
                </span>
                <div class="history-item__info">
                  <p class="history-item__title">
                    {{ att.lessonTitle }}
                  </p>
                  <p class="history-item__date">
                    {{ formatDate(att.completedAt) }}
                  </p>
                </div>
              </div>
              <span
                class="history-item__status history-item__status--mobile"
                :class="att.score >= 80 ? 'history-item__status--mastered' : 'history-item__status--done'"
              >
                {{ att.statusLabel }}
              </span>
            </div>

            <div class="history-item__actions">
              <span
                class="history-item__status history-item__status--desktop"
                :class="att.score >= 80 ? 'history-item__status--mastered' : 'history-item__status--done'"
              >
                {{ att.statusLabel }}
              </span>
              <NuxtLink :to="`/app/result/${att.attemptId}`" class="history-item__link">
                <span>Lihat Hasil</span>
                <AppIcon name="arrow-right" :size="14" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.progress-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.progress-page__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.progress-page__title {
  font-size: var(--text-h1);
}

.progress-page__subtitle {
  color: var(--text-secondary);
}

.progress-page__section-title {
  font-size: var(--text-h2);
}

.progress-stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

.progress-stats__card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 18px;
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-subtle);
  border-radius: 16px;
  box-shadow: 0 2px 0 var(--border-subtle);
}

.progress-stats__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.progress-stats__icon-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 11px;
}

.progress-stats__icon-box--teal {
  background-color: #ecfdf5;
  border: 1px solid #bde7d5;
}

.progress-stats__icon-box--gold {
  background-color: #fef6e4;
  border: 1px solid #f3d89b;
}

.progress-stats__icon-box--blue {
  background-color: #eef4ff;
  border: 1px solid #c9dbfc;
}

.progress-stats__pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
  line-height: 1.2;
}

.progress-stats__pill--teal {
  background-color: #ecfdf5;
  border: 1px solid #bde7d5;
  color: #0f6a5b;
}

.progress-stats__pill--gold {
  background-color: #fef6e4;
  border: 1px solid #f3d89b;
  color: #824d00;
}

.progress-stats__pill--blue {
  background-color: #eef4ff;
  border: 1px solid #c9dbfc;
  color: #1e40af;
}

.progress-stats__metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.progress-stats__label {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-secondary);
}

.progress-stats__val {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
}

.progress-stats__footer {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: auto;
}

.progress-stats__track {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background-color: #ede6d8;
  overflow: hidden;
}

.progress-stats__fill {
  height: 100%;
  border-radius: 999px;
}

.progress-stats__note {
  font-size: 12px;
  font-weight: 600;
  color: var(--action-primary);
}

.progress-list,
.progress-history {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.progress-list__rows,
.progress-history__rows {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.progress-stats__icon {
  color: var(--action-primary);
}

.progress-row,
.history-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.progress-row__lead {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.progress-row__left {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.progress-row__meta {
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

.progress-row__title {
  font-size: var(--text-h3);
}

.progress-row__right,
.history-row__right {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.progress-row__badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.progress-row__btn-desktop {
  display: none;
}

.progress-row__btn-mobile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 10px;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  border: 2px solid var(--border-control);
  box-shadow: 0 2px 0 var(--border-control);
  text-decoration: none;
}

.progress-row__btn-mobile--primary {
  background-color: var(--action-primary);
  color: var(--text-on-brand);
  border-color: var(--action-primary-active);
  box-shadow: 0 2px 0 var(--action-primary-active);
}

.progress-row__score {
  font-size: var(--text-ui);
  font-weight: 600;
}

.progress-history__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.progress-history__count {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-subtle);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.history-card {
  display: flex;
  flex-direction: column;
  padding: 4px 16px;
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-subtle);
  border-radius: 16px;
}

.history-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 0;
}

.history-item + .history-item {
  border-top: 1px solid #ede6d8;
}

.history-item__lead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.history-item__identity {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.history-item__score-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 12px;
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
}

.history-item__score-box--mastered {
  background-color: #e7f7ef;
  border: 1.5px solid #a7dec1;
  color: #0f6a5b;
}

.history-item__score-box--done {
  background-color: #fef6e4;
  border: 1.5px solid #e7c87e;
  color: #824d00;
}

.history-item__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.history-item__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.history-item__date {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-secondary);
}

.history-item__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.history-item__status {
  display: inline-flex;
  align-items: center;
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
  flex-shrink: 0;
}

.history-item__status--mastered {
  background-color: #e7f7ef;
  border: 1px solid #0f6a5b;
  color: #0f6a5b;
}

.history-item__status--done {
  background-color: #fef6e4;
  border: 1px solid #824d00;
  color: #824d00;
}

.history-item__status--desktop {
  display: none;
}

.history-item__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px 7px 14px;
  border-radius: 10px;
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-control);
  box-shadow: 0 2px 0 var(--border-control);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  transition: background-color var(--motion-fast), transform var(--motion-fast);
}

.history-item__link:hover {
  background-color: var(--bg-surface-hover);
}

.history-item__link:active {
  transform: translateY(1px);
}

@media (min-width: 640px) {
  .progress-stats {
    grid-template-columns: repeat(3, 1fr);
  }

  .progress-row {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .progress-row__btn-desktop {
    display: inline-flex;
  }

  .progress-row__btn-mobile {
    display: none;
  }

  .history-card {
    padding: 4px 20px;
  }

  .history-item {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
  }

  .history-item__score-box {
    width: 42px;
    height: 42px;
    font-size: 15px;
  }

  .history-item__title {
    font-size: 15px;
  }

  .history-item__status--mobile {
    display: none;
  }

  .history-item__status--desktop {
    display: inline-flex;
  }
}
</style>
