<script setup lang="ts">
definePageMeta({ layout: 'learner' })
useHead({ title: 'Hasil Kuis - Bimbiu' })

const route = useRoute()
const attemptId = computed(() => String(route.params.attemptId || ''))

interface AttemptResultResponse {
  attempt: {
    id: string
    lessonId: string
    lessonTitle: string
    categoryId: string
    totalQuestions: number
    correctAnswers: number
    score: number
    xpAwarded: number
  }
  rewards: {
    totalXp: number
    level: number
  }
  reviewItems: Array<{
    questionId: string
    prompt: string
    isCorrect: boolean
    explanation: string
    correctAnswerLabel: string
  }>
}

const { data: result, error: resultError } = await useFetch<AttemptResultResponse>(
  () => `/api/quiz/attempts/${attemptId.value}/result`,
)

const score = computed(() => result.value?.attempt.score ?? 0)
const isMastered = computed(() => score.value >= 80)
const correctCount = computed(() =>
  result.value?.reviewItems.filter(item => item.isCorrect).length ?? result.value?.attempt.correctAnswers ?? 0,
)
const reviewCount = computed(() =>
  result.value?.reviewItems.filter(item => !item.isCorrect).length ?? 0,
)
const categoryPath = computed(() =>
  result.value?.attempt.categoryId
    ? `/app/learn/${result.value.attempt.categoryId}`
    : '/app/learn',
)
</script>

<template>
  <div class="result-page">
    <NuxtLink :to="categoryPath" class="result-page__back">
      <AppIcon name="arrow-left" :size="18" />
      <span>Kembali ke Kategori</span>
    </NuxtLink>

    <ErrorState
      v-if="resultError || !result"
      title="Hasil Kuis Tidak Ditemukan"
      description="Pastikan kamu membuka hasil kuis yang sudah selesai dikerjakan."
      action-label="Kembali ke Beranda"
      action-to="/app"
    />

    <template v-else>
      <AppCard variant="tactile" padding="lg" class="result-card">
        <div class="result-card__meta">
          <span class="result-card__lesson">{{ result.attempt.lessonTitle }}</span>
          <StatusBadge :label="isMastered ? 'Mastered' : 'Pelajaran Selesai'" tone="accent" />
        </div>

        <BimbiuIllustration name="trophy" :size="72" />

        <h1 class="result-card__score tabular-nums">
          Skor: {{ score }} ({{ result.attempt.correctAnswers }} dari {{ result.attempt.totalQuestions }} Benar)
        </h1>

        <p class="result-card__msg">
          {{ isMastered
            ? 'Bagus sekali! Kamu sudah menguasai materi ini (>=80%) dan membuka pelajaran berikutnya.'
            : 'Pelajaran selesai! Kamu bisa mengulangi kuis ini kapan saja untuk meraih skor lebih tinggi.' }}
        </p>

        <div class="result-xp">
          <BimbiuIllustration name="icon-xp" :size="28" />
          <p class="result-xp__text tabular-nums">
            +{{ result.attempt.xpAwarded }} XP Diperoleh · Total sekarang {{ result.rewards.totalXp }} XP (Level {{ result.rewards.level }})
          </p>
        </div>

        <div class="result-card__actions">
          <AppButton variant="primary" size="lg" :to="categoryPath" class="result-card__btn">
            Lanjut Pelajaran Berikutnya
          </AppButton>
          <AppButton variant="secondary" size="lg" :to="`/app/lesson/${result.attempt.lessonId}`" class="result-card__btn">
            Ulangi Pelajaran
          </AppButton>
        </div>
      </AppCard>

      <section class="result-review">
        <div class="result-review__header">
          <h2 class="result-review__title">
            Ringkasan Review Jawaban
          </h2>
          <div class="result-review__summary">
            <span class="result-review__stat">
              <span class="result-review__dot result-review__dot--correct" aria-hidden="true" />
              <span>{{ correctCount }} Benar</span>
            </span>
            <span v-if="reviewCount > 0" class="result-review__stat">
              <span class="result-review__dot result-review__dot--review" aria-hidden="true" />
              <span>{{ reviewCount }} Perlu Review</span>
            </span>
          </div>
        </div>

        <div class="result-review__list">
          <article
            v-for="(item, idx) in result.reviewItems"
            :key="item.questionId"
            class="review-card"
          >
            <div class="review-card__top">
              <span class="review-card__num">Soal {{ idx + 1 }}</span>
              <span
                class="review-card__status"
                :class="item.isCorrect ? 'review-card__status--correct' : 'review-card__status--review'"
              >
                {{ item.isCorrect ? '✓ Benar' : '✕ Kurang Tepat' }}
              </span>
            </div>

            <h3 class="review-card__prompt">
              {{ item.prompt }}
            </h3>

            <p v-if="!item.isCorrect && item.correctAnswerLabel" class="review-card__answer">
              <span class="review-card__answer-label">Jawaban benar:</span>
              <span class="review-card__answer-val">{{ item.correctAnswerLabel }}</span>
            </p>

            <hr class="review-card__divider">

            <p class="review-card__exp">
              {{ item.explanation }}
            </p>
          </article>
        </div>
      </section>
    </template>
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
  padding: 6px 12px;
  border-radius: var(--radius-md);
  font-size: var(--text-ui);
  font-weight: 600;
  color: var(--action-primary);
  text-decoration: none;
  transition: background-color var(--motion-fast), color var(--motion-fast);
}

.result-page__back:hover {
  background-color: var(--action-primary-tint);
  color: var(--action-primary-hover);
  text-decoration: underline;
  text-underline-offset: 4px;
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
  flex-direction: column;
  gap: var(--space-3);
}

.result-card__btn {
  width: 100%;
}

.result-review {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.result-review__header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.result-review__title {
  font-size: 19px;
}

.result-review__summary {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  border-radius: 999px;
  background-color: var(--bg-surface);
  border: 1px solid #e4e9ee;
}

.result-review__stat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
}

.result-review__dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
}

.result-review__dot--correct {
  background-color: #146c43;
}

.result-review__dot--review {
  background-color: #b43625;
}

.result-review__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background-color: var(--bg-surface);
  border: 1px solid #e2e8ee;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(23, 35, 48, 0.04);
}

.review-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.review-card__num {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.review-card__status {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
}

.review-card__status--correct {
  background-color: #ecfdf5;
  color: #0f6a5b;
}

.review-card__status--review {
  background-color: #fef2f2;
  color: #b43625;
}

.review-card__prompt {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.45;
  color: var(--text-primary);
}

.review-card__answer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  font-size: 13px;
}

.review-card__answer-label {
  color: #64748b;
}

.review-card__answer-val {
  font-weight: 600;
  color: #0f6a5b;
}

.review-card__divider {
  border: 0;
  border-top: 1px solid #eef2f6;
  margin: 0;
}

.review-card__exp {
  font-size: 13px;
  line-height: 1.55;
  color: #475569;
}

@media (min-width: 640px) {
  .result-card__actions {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .result-card__btn {
    width: auto;
  }

  .result-review {
    gap: 16px;
  }

  .result-review__header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .result-review__title {
    font-size: 21px;
  }

  .review-card {
    padding: 18px 20px;
  }

  .review-card__prompt {
    font-size: 16px;
  }
}
</style>
