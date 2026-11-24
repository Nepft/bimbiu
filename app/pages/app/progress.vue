<script setup lang="ts">
definePageMeta({ layout: 'learner' })
useHead({ title: 'Progres Belajar - Bimbiu' })

// TODO(Tahap 6): Ambil data nyata dari GET /api/progress
const hasProgress = ref(true)

const stats = [
  { label: 'Pelajaran Selesai', icon: 'check-circle' as const, val: '4 Pelajaran', note: '2 sudah Mastered (>=80%)' },
  { label: 'Sedang Dikerjakan', icon: 'clock' as const, val: '1 Pelajaran', note: 'Bisa dilanjutkan kapan saja' },
  { label: 'Belum Dimulai', icon: 'book' as const, val: '7 Pelajaran', note: 'Tersedia di katalog Belajar' },
]

const lessonProgress = [
  { id: 'science-planets-01', icon: 'cat-science' as const, title: 'Mengenal Planet', cat: 'Science & Nature', attempts: '2 attempt', status: 'Mastered', tone: 'accent' as const, score: 'Skor terbaik: 90', active: false },
  { id: 'world-continents-01', icon: 'cat-geography' as const, title: 'Benua di Dunia', cat: 'World & Geography', attempts: '1 attempt', status: 'Mastered', tone: 'accent' as const, score: 'Skor terbaik: 100', active: false },
  { id: 'history-kingdoms-01', icon: 'cat-history' as const, title: 'Kerajaan Nusantara', cat: 'History & Culture', attempts: '1 attempt', status: 'Selesai', tone: 'accent' as const, score: 'Skor terbaik: 70', active: false },
  { id: 'science-moon-02', icon: 'cat-science' as const, title: 'Bulan dan Satelit', cat: 'Science & Nature', attempts: '1 attempt', status: 'Sedang Dikerjakan', tone: 'accent' as const, score: '3 dari 6 soal', active: true },
]

const recentAttempts = [
  { id: 'att-001', date: '22 Nov 2026', title: 'Mengenal Planet', score: 'Skor: 90 (Mastered)' },
  { id: 'att-002', date: '21 Nov 2026', title: 'Kerajaan Nusantara', score: 'Skor: 70 (Selesai)' },
  { id: 'att-003', date: '20 Nov 2026', title: 'Benua di Dunia', score: 'Skor: 100 (Mastered)' },
]
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
          Daftar Progres Pelajaran
        </h2>
        <div class="progress-list__rows">
          <AppCard v-for="row in lessonProgress" :key="row.title" padding="md" class="progress-row">
            <div class="progress-row__lead">
              <BimbiuIllustration :name="row.icon" :size="44" />
              <div class="progress-row__left">
                <p class="progress-row__meta">
                  {{ row.cat }} · {{ row.attempts }}
                </p>
                <h3 class="progress-row__title">
                  {{ row.title }}
                </h3>
              </div>
            </div>
            <div class="progress-row__right">
              <div class="progress-row__badges">
                <StatusBadge :label="row.status" :tone="row.tone" />
                <span class="progress-row__score tabular-nums">{{ row.score }}</span>
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

      <section class="progress-history">
        <h2 class="progress-page__section-title">
          Riwayat Attempt Terbaru
        </h2>
        <div class="progress-history__rows">
          <AppCard v-for="att in recentAttempts" :key="att.id" variant="subtle" padding="sm" class="history-row">
            <p class="history-row__title">
              {{ att.date }} · {{ att.title }}
            </p>
            <div class="history-row__right">
              <span class="history-row__score tabular-nums">{{ att.score }}</span>
              <NuxtLink :to="`/app/result/${att.id}`" class="history-row__link">
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
