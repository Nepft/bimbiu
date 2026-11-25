<script setup lang="ts">
import { GENERAL_KNOWLEDGE_CATEGORIES } from '~/utils/learning-catalog'

definePageMeta({ layout: 'learner' })
useHead({ title: 'Beranda Learner - Bimbiu' })

const { user } = useAuth()

interface CatalogResponse {
  categories: Array<{
    id: string
    title: string
    description: string
    unitCount: number
    lessonCount: number
    completedLessons: number
  }>
  recommendedLesson: {
    id: string
    title: string
    categoryId: string
    xpReward: number
    estimatedMinutes: number
  } | null
}

interface ProgressResponse {
  completedLessonsCount: number
  totalLessonsCount: number
  averageScore: number
}

interface RewardsResponse {
  totalXp: number
  level: number
  xpToNextLevel: number
  earnedBadgesCount: number
  totalBadgesCount: number
}

const [{ data: catalog }, { data: progress }, { data: rewards }] = await Promise.all([
  useFetch<CatalogResponse>('/api/content/catalog'),
  useFetch<ProgressResponse>('/api/progress'),
  useFetch<RewardsResponse>('/api/rewards'),
])

const recommended = computed(() => catalog.value?.recommendedLesson ?? null)

const recommendedCategoryLabel = computed(() => {
  if (!recommended.value) return ''
  return GENERAL_KNOWLEDGE_CATEGORIES.find(c => c.id === recommended.value?.categoryId)?.title ?? recommended.value.categoryId
})

const summaryMetrics = computed(() => {
  const lvl = rewards.value?.level ?? 1
  const xp = rewards.value?.totalXp ?? 0
  const toNext = rewards.value?.xpToNextLevel ?? 100
  const done = progress.value?.completedLessonsCount ?? 0
  const total = progress.value?.totalLessonsCount ?? 120
  const badges = rewards.value?.earnedBadgesCount ?? 0
  const totalBadges = rewards.value?.totalBadgesCount ?? 8

  const levelPct = Math.min(100, Math.max(8, Math.round((xp / Math.max(1, xp + toNext)) * 100)))
  const lessonPct = Math.min(100, Math.max(done > 0 ? 8 : 0, Math.round((done / Math.max(1, total)) * 100)))
  const badgePct = Math.min(100, Math.max(badges > 0 ? 12 : 0, Math.round((badges / Math.max(1, totalBadges)) * 100)))

  return [
    {
      label: 'Level & XP',
      icon: 'icon-level' as const,
      value: `Level ${lvl}`,
      pill: `${xp} XP`,
      pillTone: 'blue' as const,
      progress: levelPct,
      barColor: '#1E40AF',
      note: `${toNext} XP lagi ke Level ${lvl + 1}`,
      to: '/app/rewards',
    },
    {
      label: 'Pelajaran Selesai',
      icon: 'icon-lesson' as const,
      value: `${done} dari ${total}`,
      pill: `${Math.round((done / Math.max(1, total)) * 100)}%`,
      pillTone: 'teal' as const,
      progress: lessonPct,
      barColor: '#0F6A5B',
      note: 'Target belajar Bimbiu',
      to: '/app/progress',
    },
    {
      label: 'Badge Diraih',
      icon: 'icon-badge' as const,
      value: `${badges} Badge`,
      pill: 'Lihat →',
      pillTone: 'gold' as const,
      progress: badgePct,
      barColor: '#D97706',
      note: 'Lihat di halaman Hadiah',
      to: '/app/rewards',
    },
  ]
})

const categoryCards = computed(() => {
  const apiCats = catalog.value?.categories
  if (!apiCats) return GENERAL_KNOWLEDGE_CATEGORIES
  return GENERAL_KNOWLEDGE_CATEGORIES.map((uiCat) => {
    const match = apiCats.find(c => c.id === uiCat.id)
    if (!match) return uiCat
    return {
      ...uiCat,
      learnerMeta: `${match.completedLessons} / ${match.lessonCount} pelajaran selesai`,
    }
  })
})
</script>

<template>
  <div class="beranda">
    <header class="beranda__header">
      <h1 class="beranda__title">
        Halo, {{ user?.displayName || 'Petualang' }}
      </h1>
      <p class="beranda__subtitle">
        Lanjutkan kuis yang sedang kamu kerjakan atau pilih topik baru.
      </p>
    </header>

    <AppCard v-if="recommended" variant="tint" padding="lg" class="focus-card">
      <div class="focus-card__meta">
        <StatusBadge label="Rekomendasi Belajar" tone="accent" />
        <span class="focus-card__unit">{{ recommendedCategoryLabel }}</span>
      </div>
      <h2 class="focus-card__title">
        {{ recommended.title }}
      </h2>
      <div class="focus-card__actions">
        <AppButton variant="primary" size="lg" :to="`/app/lesson/${recommended.id}`">
          Mulai Kuis
        </AppButton>
        <div class="lesson-meta-pills">
          <span class="meta-chip meta-chip--neutral">
            <AppIcon name="clock" :size="13" />
            <span>~{{ recommended.estimatedMinutes }} menit</span>
          </span>
          <span class="meta-chip meta-chip--xp">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M13 2.5L4.5 13.5H11.5L10.5 21.5L19.5 10.5H12.5L13 2.5Z" fill="#F2B632" fill-opacity="0.35" stroke="#9A5B00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <strong>+{{ recommended.xpReward }} XP</strong>
            <span class="meta-chip__sub">saat selesai pertama</span>
          </span>
        </div>
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
      <NuxtLink
        v-for="m in summaryMetrics"
        :key="m.label"
        :to="m.to"
        class="summary-strip__card"
      >
        <div class="summary-strip__top">
          <BimbiuIllustration :name="m.icon" :size="38" />
          <span class="summary-strip__pill" :class="`summary-strip__pill--${m.pillTone}`">
            {{ m.pill }}
          </span>
        </div>
        <div class="summary-strip__metric">
          <p class="summary-strip__label">
            {{ m.label }}
          </p>
          <p class="summary-strip__value tabular-nums">
            {{ m.value }}
          </p>
        </div>
        <div class="summary-strip__footer">
          <div class="summary-strip__track" aria-hidden="true">
            <div
              class="summary-strip__fill"
              :style="{ width: `${m.progress}%`, backgroundColor: m.barColor }"
            />
          </div>
          <p class="summary-strip__note">
            {{ m.note }}
          </p>
        </div>
      </NuxtLink>
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
          v-for="cat in categoryCards"
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
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
}

.lesson-meta-pills {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 1.2;
}

.meta-chip--neutral {
  background-color: #f5f7f9;
  border: 1px solid #e2e8ee;
  color: #334155;
  font-weight: 600;
}

.meta-chip--xp {
  background-color: #fef6e4;
  border: 1px solid #f3d89b;
  color: #824d00;
}

.meta-chip__sub {
  font-weight: 500;
  color: #9a5b00;
}

.summary-strip {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

.summary-strip__card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 18px;
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-subtle);
  border-radius: 16px;
  box-shadow: 0 2px 0 var(--border-subtle);
  text-decoration: none;
  color: inherit;
  transition: transform var(--motion-fast), border-color var(--motion-fast);
}

.summary-strip__card:hover {
  border-color: var(--border-control);
  transform: translateY(-1px);
}

.summary-strip__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.summary-strip__pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
  line-height: 1.2;
}

.summary-strip__pill--blue {
  background-color: #eef4ff;
  border: 1px solid #c9dbfc;
  color: #1e40af;
}

.summary-strip__pill--teal {
  background-color: #ecfdf5;
  border: 1px solid #bde7d5;
  color: #0f6a5b;
}

.summary-strip__pill--gold {
  background-color: #fef6e4;
  border: 1px solid #f3d89b;
  color: #824d00;
}

.summary-strip__metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.summary-strip__label {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-secondary);
}

.summary-strip__value {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
}

.summary-strip__footer {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: auto;
}

.summary-strip__track {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background-color: #ede6d8;
  overflow: hidden;
}

.summary-strip__fill {
  height: 100%;
  border-radius: 999px;
}

.summary-strip__note {
  font-size: 12px;
  font-weight: 600;
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
  padding: 6px 12px;
  border-radius: var(--radius-md);
  font-size: var(--text-ui);
  font-weight: 600;
  color: var(--action-primary);
  text-decoration: none;
  transition: background-color var(--motion-fast), color var(--motion-fast);
}

.beranda__see-all:hover {
  background-color: var(--action-primary-tint);
  color: var(--action-primary-hover);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.beranda__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 640px) {
  .focus-card__actions {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-4);
  }

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
