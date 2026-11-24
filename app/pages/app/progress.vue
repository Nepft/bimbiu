<script setup lang="ts">
import type { IllustrationName } from '~/components/ui/BimbiuIllustration.vue'

definePageMeta({ layout: 'learner' })
useHead({ title: 'Progres Belajar - Bimbiu' })

interface ProgressResponse {
  completedLessonsCount: number
  totalLessonsCount: number
  averageScore: number
  categories: Array<{
    id: string
    title: string
    icon: string
    totalLessons: number
    completedLessons: number
    progressPercent: number
  }>
  recentHistory: Array<{
    attemptId: string
    lessonId: string
    lessonTitle: string
    score: number
    xpAwarded: number
    completedAt: string | null
  }>
}

const { data: progress } = await useFetch<ProgressResponse>('/api/progress')

const hasProgress = computed(() => (progress.value?.completedLessonsCount ?? 0) > 0 || (progress.value?.recentHistory.length ?? 0) > 0)

const stats = computed(() => {
  const done = progress.value?.completedLessonsCount ?? 0
  const total = progress.value?.totalLessonsCount ?? 120
  const avg = progress.value?.averageScore ?? 0
  const remaining = Math.max(0, total - done)

  return [
    { label: 'Pelajaran Selesai', icon: 'check-circle' as const, val: `${done} Pelajaran`, note: `dari ${total} pelajaran tersedia` },
    { label: 'Rata-rata Skor', icon: 'clock' as const, val: `${avg}%`, note: 'Berdasarkan skor terbaik' },
    { label: 'Belum Dimulai', icon: 'book' as const, val: `${remaining} Pelajaran`, note: 'Tersedia di katalog Belajar' },
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
        Pantau lesson yang sudah selesai, nilai terbaik, dan riwayat pengerjaanmu.
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
      <section class="progress-stats">
        <AppCard v-for="s in stats" :key="s.label" padding="sm" class="progress-stats__card">
          <AppIcon :name="s.icon" :size="18" class="progress-stats__icon" />
          <p class="progress-stats__label">
            {{ s.label }}
          </p>
          <p class="progress-stats__val tabular-nums">
            {{ s.val }}
          </p>
          <p class="progress-stats__note">
            {{ s.note }}
          </p>
        </AppCard>
      </section>

      <section class="progress-list">
        <h2 class="progress-page__section-title">
          Progres per Kategori
        </h2>
        <div class="progress-list__rows">
          <AppCard v-for="cat in progress?.categories ?? []" :key="cat.id" padding="md" class="progress-row">
            <div class="progress-row__lead">
              <BimbiuIllustration :name="(cat.icon as IllustrationName)" :size="44" />
              <div class="progress-row__left">
                <p class="progress-row__meta">
                  {{ cat.completedLessons }} / {{ cat.totalLessons }} pelajaran selesai
                </p>
                <h3 class="progress-row__title">
                  {{ cat.title }}
                </h3>
              </div>
            </div>
            <div class="progress-row__right">
              <div class="progress-row__badges">
                <StatusBadge :label="`${cat.progressPercent}%`" tone="accent" />
              </div>
              <AppButton
                variant="secondary"
                :to="`/app/learn/${cat.id}`"
                class="progress-row__btn-desktop"
              >
                Lihat Kategori
              </AppButton>
            </div>
          </AppCard>
        </div>
      </section>

      <section v-if="progress?.recentHistory.length" class="progress-history">
        <h2 class="progress-page__section-title">
          Riwayat Attempt Terbaru
        </h2>
        <div class="progress-history__rows">
          <AppCard v-for="att in progress.recentHistory" :key="att.attemptId" variant="subtle" padding="sm" class="history-row">
            <p class="history-row__title">
              {{ formatDate(att.completedAt) }} · {{ att.lessonTitle }}
            </p>
            <div class="history-row__right">
              <span class="history-row__score tabular-nums">Skor: {{ att.score }} (+{{ att.xpAwarded }} XP)</span>
              <NuxtLink :to="`/app/result/${att.attemptId}`" class="history-row__link">
                Lihat Hasil
              </NuxtLink>
            </div>
          </AppCard>
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
  gap: var(--space-1);
}

.progress-stats__label {
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

.progress-stats__val {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 600;
}

.progress-stats__note {
  font-size: var(--text-caption);
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

.history-row__title {
  font-weight: 500;
}

.history-row__score {
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

.history-row__link {
  font-size: var(--text-ui);
  font-weight: 600;
  color: var(--action-primary);
  text-decoration: none;
}

@media (min-width: 640px) {
  .progress-stats {
    grid-template-columns: repeat(3, 1fr);
  }

  .progress-row,
  .history-row {
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
}
</style>
