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
const coreEarnedCount = computed(() => coreBadges.value.filter(b => b.earned).length)
const newEarnedCount = computed(() => newBadges.value.filter(b => b.earned).length)

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
          <BimbiuIllustration name="level-crest" :size="44" />
          <div class="xp-card__level-copy">
            <h2 class="xp-card__level tabular-nums">
              Level {{ level }}
            </h2>
            <span class="xp-card__xp-pill tabular-nums">
              {{ totalXp }} XP Total
            </span>
          </div>
        </div>
        <span class="xp-card__next tabular-nums">
          {{ xpToNextLevel }} XP lagi ke Level {{ level + 1 }} ({{ totalXp }} / {{ nextLevelXp }})
        </span>
      </div>
      <ProgressBar :value="totalXp % 100" :max="100" tone="accent" :label="`Progres XP menuju Level ${level + 1}`" />
      <p class="xp-card__note">
        <AppIcon name="sparkle" :size="16" />
        <span>Kamu mendapat +20 XP saat pertama kali menyelesaikan sebuah pelajaran.</span>
      </p>
    </section>

    <section class="badges-section">
      <div class="badges-section__header">
        <h2 class="badges-section__title">
          Koleksi Badge
        </h2>
        <span class="badges-section__count tabular-nums">
          {{ coreEarnedCount }} / {{ coreBadges.length }} Diraih
        </span>
      </div>
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
            <span v-else class="badge-card__locked-pill">Terkunci</span>
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
      <div class="badges-section__header">
        <h2 class="badges-section__title">
          Badge Tantangan
        </h2>
        <span class="badges-section__count tabular-nums">
          {{ newEarnedCount }} / {{ newBadges.length }} Diraih
        </span>
      </div>
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
            <span v-else class="badge-card__locked-pill">Terkunci</span>
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
  padding: var(--space-4);
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

.xp-card__level-copy {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.xp-card__level {
  font-size: var(--text-h2);
}

.xp-card__xp-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background-color: var(--bg-surface);
  border: 1.5px solid var(--action-accent-border);
  font-size: 12px;
  font-weight: 700;
  color: var(--feedback-hint-fg);
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

.badges-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.badges-section__title {
  font-size: var(--text-h2);
}

.badges-section__count {
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

.badges-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

.badge-card {
  padding: var(--space-5);
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-subtle);
  border-radius: 16px;
  opacity: 0.7;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.badge-card--earned {
  opacity: 1;
  background-color: var(--bg-surface);
  border: 2px solid var(--action-accent-border);
  box-shadow: 0 2px 0 var(--action-accent-border);
}

.badge-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.badge-card__locked-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background-color: var(--bg-canvas);
  border: 1px solid var(--border-subtle);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text-secondary);
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
  .xp-card {
    padding: var(--space-6);
  }

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
