<script setup lang="ts">
interface Props {
  lessonTitle: string
  currentQuestion: number
  totalQuestions: number
}

defineProps<Props>()

const emit = defineEmits<{
  exit: []
}>()
</script>

<template>
  <header class="quiz-header">
    <div class="quiz-header__inner">
      <div class="quiz-header__row">
        <AppButton variant="secondary" size="md" class="quiz-header__exit" @click="emit('exit')">
          Keluar
        </AppButton>
        <p class="quiz-header__title">
          {{ lessonTitle }}
        </p>
        <p class="quiz-header__counter tabular-nums">
          Soal {{ currentQuestion }} dari {{ totalQuestions }}
        </p>
      </div>
      <ProgressBar
        :value="currentQuestion"
        :max="totalQuestions"
        :label="`Progres soal ${currentQuestion} dari ${totalQuestions}`"
      />
    </div>
  </header>
</template>

<style scoped>
.quiz-header {
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-subtle);
}

.quiz-header__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 12px var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.quiz-header__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.quiz-header__title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
}

.quiz-header__counter {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
}

:deep(.quiz-header__exit:hover:not(:disabled)) {
  background-color: var(--feedback-review-bg);
  color: var(--feedback-review-fg);
  border-color: var(--feedback-review-fg);
  box-shadow: 0 3px 0 var(--feedback-review-fg);
}

@media (min-width: 1024px) {
  .quiz-header__inner {
    padding: 16px 80px;
  }
}
</style>
