<template>
  <AppCard variant="tactile" padding="lg" class="quiz-preview">
    <div class="quiz-preview__meta">
      <span class="quiz-preview__topic">Science &amp; Nature: Mengenal Planet</span>
      <StatusBadge label="Contoh Soal" tone="accent" />
    </div>

    <p class="quiz-preview__prompt">
      Planet terbesar di tata surya adalah?
    </p>

    <ul class="quiz-preview__options" aria-label="Contoh pilihan jawaban">
      <li class="quiz-preview__option">
        <span class="quiz-preview__letter">A</span>
        <span>Bumi</span>
      </li>
      <li class="quiz-preview__option quiz-preview__option--correct">
        <span class="quiz-preview__letter quiz-preview__letter--correct">B</span>
        <span>Jupiter</span>
      </li>
      <li class="quiz-preview__option">
        <span class="quiz-preview__letter">C</span>
        <span>Mars</span>
      </li>
    </ul>

    <div class="quiz-preview__explanation">
      <p class="quiz-preview__exp-title">
        Jawaban Tepat
      </p>
      <p class="quiz-preview__exp-body">
        Jupiter merupakan planet terbesar di tata surya.
      </p>
    </div>
  </AppCard>
</template>

<style scoped>
.quiz-preview {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.quiz-preview__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.quiz-preview__topic {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--text-secondary);
}

.quiz-preview__prompt {
  font-size: var(--text-quiz-prompt);
  font-weight: 600;
  line-height: 1.5;
}

.quiz-preview__options {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.quiz-preview__option {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: 48px;
  padding: 10px 14px;
  border: 1.5px solid var(--border-subtle);
  border-radius: var(--radius-md);
  font-size: var(--text-ui);
  font-weight: 600;
}

.quiz-preview__option--correct {
  background-color: var(--feedback-correct-bg);
  border: 2px solid var(--feedback-correct-fg);
  color: var(--feedback-correct-fg);
}

.quiz-preview__letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: var(--bg-surface-subtle);
  color: var(--text-primary);
  border-radius: var(--radius-sm);
  font-size: var(--text-caption);
}

.quiz-preview__letter--correct {
  background-color: var(--feedback-correct-fg);
  color: var(--text-on-brand);
}

.quiz-preview__explanation {
  padding: var(--space-3) var(--space-4);
  background-color: var(--feedback-correct-bg);
  border: 1.5px solid var(--feedback-correct-fg);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.quiz-preview__exp-title {
  font-size: var(--text-ui);
  font-weight: 600;
  color: var(--feedback-correct-fg);
}

.quiz-preview__exp-body {
  font-size: var(--text-caption);
  color: var(--text-primary);
}
</style>
