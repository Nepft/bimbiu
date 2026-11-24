<script setup lang="ts">
definePageMeta({ layout: 'learner' })
useHead({ title: 'Hasil Kuis - Bimbiu' })

// TODO(Tahap 6): Ambil hasil nyata dari GET /api/quiz/attempts/:attemptId/result
const score = 83
const isMastered = score >= 80
const unlockedBadge = ref<string | null>(null)

const reviews = [
  {
    q: '1. Planet terbesar di tata surya adalah?',
    ok: true,
    exp: 'Jupiter merupakan planet terbesar di tata surya.',
  },
  {
    q: '6. Planet yang paling dekat dengan Matahari bernama ____.',
    ok: false,
    exp: 'Jawaban benar: Merkurius. Merkurius adalah planet pertama dari Matahari.',
  },
]
</script>

<template>
  <div class="result-page">
    <NuxtLink to="/app/learn/science-nature" class="result-page__back">
      <AppIcon name="arrow-left" :size="18" />
      <span>Kembali ke Kategori</span>
    </NuxtLink>

    <AppCard variant="tactile" padding="lg" class="result-card">
      <div class="result-card__meta">
        <span class="result-card__lesson">Science &amp; Nature · Mengenal Planet</span>
        <StatusBadge :label="isMastered ? 'Mastered' : 'Pelajaran Selesai'" tone="accent" />
      </div>

      <BimbiuIllustration name="trophy" :size="72" />

      <h1 class="result-card__score tabular-nums">
        Skor: {{ score }} (5 dari 6 Benar)
      </h1>

      <p class="result-card__msg">
        Bagus sekali! Kamu sudah menguasai materi ini (&gt;=80%) dan membuka pelajaran berikutnya.
      </p>

      <div class="result-xp">
        <BimbiuIllustration name="icon-xp" :size="24" />
        <p class="result-xp__text tabular-nums">
          +20 XP Diperoleh · Total sekarang 140 XP (Level 2)
        </p>
      </div>

      <div v-if="unlockedBadge" class="result-badge-unlock">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="9" r="6" stroke="currentColor" stroke-width="2" />
          <path d="M8.5 14.5L7 22l5-3 5 3-1.5-7.5" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
        </svg>
        <p class="result-badge-unlock__text">
          Badge Baru Terbuka: {{ unlockedBadge }}
        </p>
      </div>

      <div class="result-card__actions">
        <AppButton variant="primary" size="lg" to="/app/learn/science-nature">
          Lanjut Pelajaran Berikutnya
        </AppButton>
        <AppButton variant="secondary" size="lg" to="/app/lesson/science-planets-01">
          Ulangi Pelajaran
        </AppButton>
      </div>
    </AppCard>

    <section class="result-review">
      <h2 class="result-review__title">
        Ringkasan Review Jawaban
      </h2>
      <div class="result-review__list">
        <article
          v-for="item in reviews"
          :key="item.q"
          class="review-item"
          :class="item.ok ? 'review-item--correct' : 'review-item--review'"
        >
          <div class="review-item__head">
            <AppIcon :name="item.ok ? 'check-circle' : 'alert-circle'" :size="18" />
            <h3 class="review-item__q">
              {{ item.q }}
            </h3>
          </div>
          <p class="review-item__exp">
            {{ item.exp }}
          </p>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.result-page {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.result-page__back {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-ui);
  font-weight: 600;
  color: var(--action-primary);
  text-decoration: none;
}

.result-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.result-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.result-card__lesson {
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

.result-card__score {
  font-size: var(--text-display);
  line-height: 1.18;
}

.result-card__msg {
  color: var(--text-secondary);
}

.result-xp,
.result-badge-unlock {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background-color: var(--feedback-hint-bg);
  border: 1.5px solid var(--action-accent-border);
  border-radius: var(--radius-md);
  color: var(--feedback-hint-fg);
}

.result-badge-unlock {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border-width: 2px;
}

.result-xp__text,
.result-badge-unlock__text {
  font-size: var(--text-ui);
  font-weight: 600;
}

.result-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.result-review {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.result-review__title {
  font-size: var(--text-h2);
}

.result-review__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.review-item {
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-lg);
  border: 1.5px solid transparent;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.review-item--correct {
  background-color: var(--feedback-correct-bg);
  border-color: var(--feedback-correct-fg);
}

.review-item--review {
  background-color: var(--feedback-review-bg);
  border-color: var(--feedback-review-fg);
}

.review-item__head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.review-item__q {
  font-family: var(--font-sans);
  font-size: var(--text-ui);
  font-weight: 600;
}

.review-item--correct .review-item__head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.review-item__q {
  color: var(--feedback-correct-fg);
}

.review-item--review .review-item__head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.review-item__q {
  color: var(--feedback-review-fg);
}
</style>
