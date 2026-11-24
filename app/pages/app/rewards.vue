<script setup lang="ts">
import type { IllustrationName } from '~/components/ui/BimbiuIllustration.vue'

definePageMeta({ layout: 'learner' })
useHead({ title: 'Hadiah & Pencapaian - Bimbiu' })

interface RewardsResponse {
  totalXp: number
  level: number
  currentLevelXp: number
  nextLevelXp: number
  xpToNextLevel: number
  badges: Array<{
    id: string
    name: string
    description: string
    icon: string
    earned: boolean
    awardedAt: string | null
  }>
}

const { data: rewards } = await useFetch<RewardsResponse>('/api/rewards')

const level = computed(() => rewards.value?.level ?? 1)
const totalXp = computed(() => rewards.value?.totalXp ?? 0)
const nextLevelXp = computed(() => rewards.value?.nextLevelXp ?? 100)
const xpToNextLevel = computed(() => rewards.value?.xpToNextLevel ?? 100)

const coreBadges = computed(() => (rewards.value?.badges ?? []).slice(0, 4))
const newBadges = computed(() => (rewards.value?.badges ?? []).slice(4))

function formatBadgeStatus(b: RewardsResponse['badges'][number]): string {
  if (!b.earned) return 'Belum terbuka'
  if (!b.awardedAt) return 'Diperoleh'
  const dateStr = new Date(b.awardedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return `Diperoleh ${dateStr}`
}
</script>

<template>
  <div class="rewards-page">
    <header class="rewards-page__header">
      <h1 class="rewards-page__title">
        Hadiah &amp; Pencapaian
      </h1>
      <p class="rewards-page__subtitle">
        XP dan badge mengapresiasi usahamu belajar tanpa mengurangi poin saat jawaban belum tepat.
      </p>
    </header>

    <section class="xp-card">
      <div class="xp-card__top">
        <div class="xp-card__level-wrap">
          <BimbiuIllustration name="level-crest" :size="40" />
          <h2 class="xp-card__level tabular-nums">
            Level {{ level }} · {{ totalXp }} XP
          </h2>
        </div>
        <span class="xp-card__next tabular-nums">
          {{ xpToNextLevel }} XP lagi menuju Level {{ level + 1 }} ({{ totalXp }} / {{ nextLevelXp }} XP)
        </span>
      </div>
      <ProgressBar :value="totalXp % 100" :max="100" tone="accent" :label="`Progres XP menuju Level ${level + 1}`" />
      <p class="xp-card__note">
        <AppIcon name="sparkle" :size="16" />
        <span>Kamu mendapat +20 XP saat pertama kali menyelesaikan sebuah pelajaran.</span>
      </p>
    </section>

    <section class="badges-section">
      <h2 class="badges-section__title">
        Koleksi Badge
      </h2>
      <div class="badges-grid">
        <article
          v-for="b in coreBadges"
          :key="b.id"
          class="badge-card"
          :class="{ 'badge-card--earned': b.earned }"
        >
          <div class="badge-card__top">
            <BimbiuIllustration :name="(b.icon as IllustrationName)" :size="44" />
            <StatusBadge v-if="b.earned" label="Diraih" tone="accent" />
          </div>
          <h3 class="badge-card__title">
            {{ b.name }}
          </h3>
          <p class="badge-card__desc">
            {{ b.description }}
          </p>
          <p class="badge-card__status" :class="{ 'badge-card__status--earned': b.earned }">
            {{ formatBadgeStatus(b) }}
          </p>
        </article>
      </div>
    </section>

    <section v-if="newBadges.length" class="badges-section">
      <h2 class="badges-section__title">
        Koleksi Badge Baru
      </h2>
      <div class="badges-grid badges-grid--3col">
        <article
          v-for="b in newBadges"
          :key="b.id"
          class="badge-card"
          :class="{ 'badge-card--earned': b.earned }"
        >
          <div class="badge-card__top">
            <BimbiuIllustration :name="(b.icon as IllustrationName)" :size="44" />
            <StatusBadge v-if="b.earned" label="Diraih" tone="accent" />
          </div>
          <h3 class="badge-card__title">
            {{ b.name }}
          </h3>
          <p class="badge-card__desc">
            {{ b.description }}
          </p>
          <p class="badge-card__status" :class="{ 'badge-card__status--earned': b.earned }">
            {{ formatBadgeStatus(b) }}
          </p>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.rewards-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.rewards-page__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.rewards-page__title {
  font-size: var(--text-h1);
}

.rewards-page__subtitle {
  color: var(--text-secondary);
}

.xp-card {
  padding: var(--space-6);
  background-color: var(--feedback-hint-bg);
  border: 2px solid var(--action-accent-border);
  border-radius: var(--radius-xl);
  box-shadow: 0 3px 0 var(--action-accent-border);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.xp-card__top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.xp-card__level-wrap {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
}

.xp-card__level {
  font-size: var(--text-h2);
}

.xp-card__next {
  font-size: var(--text-caption);
  font-weight: 600;
  color: var(--feedback-hint-fg);
}

.xp-card__note {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

.badges-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.badges-section__title {
  font-size: var(--text-h2);
}

.badges-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

.badge-card {
  padding: var(--space-5);
  background-color: var(--bg-surface-subtle);
  border: 1.5px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.badge-card--earned {
  background-color: var(--bg-surface);
  border: 2px solid var(--action-accent-border);
}

.badge-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.badge-card__medal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
}

.badge-card__medal--earned {
  background-color: var(--feedback-hint-bg);
  border-color: var(--action-accent-border);
  color: var(--feedback-hint-fg);
}

.badge-card__title {
  font-size: var(--text-h3);
}

.badge-card__desc {
  color: var(--text-secondary);
  flex: 1;
}

.badge-card__status {
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

.badge-card__status--earned {
  color: var(--feedback-hint-fg);
  font-weight: 600;
}

@media (min-width: 640px) {
  .badges-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .badges-grid--3col {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
