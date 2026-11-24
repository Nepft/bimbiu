<script setup lang="ts">
import { GENERAL_KNOWLEDGE_CATEGORIES } from '~/utils/learning-catalog'

definePageMeta({ layout: 'learner' })
useHead({ title: 'Beranda Learner - Bimbiu' })

// TODO(Tahap 5-6): Ambil data nyata dari /api/progress dan /api/rewards
const hasActiveAttempt = ref(true)

const summaryMetrics = [
  { label: 'Level & XP', icon: 'icon-level' as const, value: 'Level 2 · 120 XP', note: '80 XP lagi ke Level 3' },
  { label: 'Pelajaran Selesai', icon: 'icon-lesson' as const, value: '4 dari 12', note: 'Target awal MVP' },
  { label: 'Badge Diraih', icon: 'icon-badge' as const, value: '2 Badge', note: 'Lihat di halaman Hadiah' },
]
</script>

<template>
  <div class="beranda">
    <header class="beranda__header">
      <h1 class="beranda__title">
        Halo, Rafi
      </h1>
      <p class="beranda__subtitle">
        Lanjutkan kuis yang sedang kamu kerjakan atau pilih topik baru.
      </p>
    </header>

    <AppCard v-if="hasActiveAttempt" variant="tint" padding="lg" class="focus-card">
      <div class="focus-card__meta">
        <StatusBadge label="Sedang Dikerjakan" tone="accent" />
        <span class="focus-card__unit">Science &amp; Nature · Unit Tata Surya</span>
      </div>
      <h2 class="focus-card__title">
        Mengenal Planet
      </h2>
      <div class="focus-card__progress">
        <p class="focus-card__progress-label tabular-nums">
          3 dari 6 soal terjawab (50%)
        </p>
        <ProgressBar :value="3" :max="6" label="Progres pelajaran Mengenal Planet" />
      </div>
      <div class="focus-card__actions">
        <AppButton variant="primary" size="lg" to="/app/lesson/science-planets-01">
          Lanjutkan Kuis
        </AppButton>
        <span class="focus-card__hint">
          <AppIcon name="clock" :size="16" />
          <span>~5 menit · +20 XP saat selesai pertama</span>
        </span>
      </div>
    </AppCard>

    <EmptyState
      v-else
      title="Belum Ada Kuis yang Dimulai"
      description="Pilih salah satu dari enam kategori pengetahuan umum di bawah untuk mengerjakan pelajaran pertamamu."
      action-label="Pilih Kategori Pertama"
      action-to="/app/learn"
    />

    <section class="summary-strip" aria-label="Ringkasan progres">
      <AppCard v-for="m in summaryMetrics" :key="m.label" padding="sm" class="summary-strip__card">
        <BimbiuIllustration :name="m.icon" :size="28" />
        <p class="summary-strip__label">
          {{ m.label }}
        </p>
        <p class="summary-strip__value tabular-nums">
          {{ m.value }}
        </p>
        <p class="summary-strip__note">
          {{ m.note }}
        </p>
      </AppCard>
    </section>

    <section class="beranda__categories">
      <div class="beranda__section-header">
        <h2 class="beranda__section-title">
          Pilih Topik Belajar
        </h2>
        <NuxtLink to="/app/learn" class="beranda__see-all">
          Semua Kategori
        </NuxtLink>
      </div>
      <div class="beranda__grid">
        <CategoryCard
          v-for="cat in GENERAL_KNOWLEDGE_CATEGORIES"
          :key="cat.id"
          :category-id="cat.id"
          :title="cat.title"
          :description="cat.description"
          :meta="cat.learnerMeta"
          :to="`/app/learn/${cat.id}`"
          show-button
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.beranda {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.beranda__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.beranda__title {
  font-size: var(--text-h1);
}

.beranda__subtitle {
  color: var(--text-secondary);
}

.focus-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  background-color: var(--bg-surface);
  box-shadow: none;
}

.focus-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.focus-card__unit {
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

.focus-card__title {
  font-size: var(--text-h2);
}

.focus-card__progress {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.focus-card__progress-label {
  font-size: var(--text-caption);
  font-weight: 500;
}

.focus-card__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
}

.focus-card__hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

.summary-strip {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

.summary-strip__card {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.summary-strip__label {
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

.summary-strip__value {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 600;
}

.summary-strip__note {
  font-size: var(--text-caption);
  color: var(--action-primary);
}

.beranda__categories {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.beranda__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.beranda__section-title {
  font-size: var(--text-h2);
}

.beranda__see-all {
  font-size: var(--text-ui);
  font-weight: 600;
  color: var(--action-primary);
  text-decoration: none;
}

.beranda__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 640px) {
  .summary-strip {
    grid-template-columns: repeat(3, 1fr);
  }

  .beranda__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .beranda__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
