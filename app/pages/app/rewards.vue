<script setup lang="ts">
definePageMeta({ layout: 'learner' })
useHead({ title: 'Hadiah & Pencapaian - Bimbiu' })

// TODO(Tahap 6): Ambil data nyata dari GET /api/rewards dan GET /api/rewards/badges
const badges = [
  { name: 'Penjelajah Pertama', icon: 'avatar-r1' as const, desc: 'Selesaikan pelajaran pertamamu di Bimbiu.', status: 'Diperoleh 20 Nov 2026', earned: true },
  { name: 'Bintang Tata Surya', icon: 'cat-science' as const, desc: 'Raih skor minimal 80% pada pelajaran Mengenal Planet.', status: 'Diperoleh 22 Nov 2026', earned: true },
  { name: 'Penjelajah Dunia', icon: 'cat-geography' as const, desc: 'Selesaikan semua pelajaran di kategori World & Geography.', status: 'Belum terbuka', earned: false },
  { name: 'Tekun Belajar', icon: 'cat-language' as const, desc: 'Selesaikan 5 pelajaran dari kategori mana saja.', status: 'Belum terbuka (4/5)', earned: false },
]
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
            Level 2 · 120 XP
          </h2>
        </div>
        <span class="xp-card__next tabular-nums">
          80 XP lagi menuju Level 3 (120 / 200 XP)
        </span>
      </div>
      <ProgressBar :value="120" :max="200" tone="accent" label="Progres XP menuju Level 3" />
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
          v-for="b in badges"
          :key="b.name"
          class="badge-card"
          :class="{ 'badge-card--earned': b.earned }"
        >
          <div class="badge-card__top">
            <BimbiuIllustration :name="b.icon" :size="44" />
            <StatusBadge v-if="b.earned" label="Diraih" tone="accent" />
          </div>
          <h3 class="badge-card__title">
            {{ b.name }}
          </h3>
          <p class="badge-card__desc">
            {{ b.desc }}
          </p>
          <p class="badge-card__status" :class="{ 'badge-card__status--earned': b.earned }">
            {{ b.status }}
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
</style>
