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
          <BimbiuIllustration name="icon-xp" :size="24" />
          <p class="result-xp__text tabular-nums">
            +{{ result.attempt.xpAwarded }} XP Diperoleh · Total sekarang {{ result.rewards.totalXp }} XP (Level {{ result.rewards.level }})
          </p>
        </div>

        <div class="result-card__actions">
          <AppButton variant="primary" size="lg" :to="categoryPath">
            Lanjut Pelajaran Berikutnya
          </AppButton>
          <AppButton variant="secondary" size="lg" :to="`/app/lesson/${result.attempt.lessonId}`">
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
            v-for="(item, idx) in result.reviewItems"
            :key="item.questionId"
            class="review-item"
            :class="item.isCorrect ? 'review-item--correct' : 'review-item--review'"
          >
            <div class="review-item__head">
              <AppIcon :name="item.isCorrect ? 'check-circle' : 'alert-circle'" :size="18" />
              <h3 class="review-item__q">
                {{ idx + 1 }}. {{ item.prompt }}
              </h3>
            </div>
            <p class="review-item__exp">
              <template v-if="!item.isCorrect && item.correctAnswerLabel">
                Jawaban benar: {{ item.correctAnswerLabel }}.
              </template>
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
