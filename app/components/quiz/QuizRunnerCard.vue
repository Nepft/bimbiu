<script setup lang="ts">
export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_in_the_blank'
  | 'multiple_select'
  | 'image_quiz'

export interface QuizOption {
  id: string
  letter?: string
  text: string
}

export interface QuizQuestionView {
  id: string
  type: QuestionType
  prompt: string
  hint?: string
  mediaKey?: string
  mediaCaption?: string
  options?: QuizOption[]
}

export interface QuizFeedbackView {
  isCorrect: boolean
  title: string
  correctAnswerLabel?: string
  explanation: string
}

interface Props {
  question: QuizQuestionView
  isLastQuestion: boolean
  feedback?: QuizFeedbackView | null
  submitting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  feedback: null,
  submitting: false,
})

const emit = defineEmits<{
  submit: [payload: { optionId?: string; optionIds?: string[]; text?: string }]
  next: []
}>()

const showHint = ref(false)
const selectedOption = ref('')
const selectedOptions = ref<string[]>([])
const textAnswer = ref('')

watch(
  () => props.question.id,
  () => {
    showHint.value = false
    selectedOption.value = ''
    selectedOptions.value = []
    textAnswer.value = ''
  },
)

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: 'Pilihan Ganda',
  true_false: 'Benar / Salah',
  fill_in_the_blank: 'Isian Singkat',
  multiple_select: 'Pilih Semua Benar',
  image_quiz: 'Kuis Gambar',
}

const typeLabel = computed(() => QUESTION_TYPE_LABELS[props.question.type])

const canSubmit = computed(() => {
  if (props.feedback || props.submitting) return false
  if (props.question.type === 'fill_in_the_blank') {
    return textAnswer.value.trim().length > 0
  }
  if (props.question.type === 'multiple_select') {
    return selectedOptions.value.length > 0
  }
  return selectedOption.value.length > 0
})

function toggleMultiOption(id: string) {
  if (props.feedback) return
  if (selectedOptions.value.includes(id)) {
    selectedOptions.value = selectedOptions.value.filter(item => item !== id)
  } else {
    selectedOptions.value = [...selectedOptions.value, id]
  }
}

function handleSubmit() {
  if (!canSubmit.value) return
  if (props.question.type === 'fill_in_the_blank') {
    emit('submit', { text: textAnswer.value.trim() })
  } else if (props.question.type === 'multiple_select') {
    emit('submit', { optionIds: [...selectedOptions.value] })
  } else {
    emit('submit', { optionId: selectedOption.value })
  }
}
</script>

<template>
  <AppCard variant="tactile" padding="lg" class="quiz-card">
    <div class="quiz-card__meta">
      <StatusBadge :label="typeLabel" tone="accent" />
      <button
        v-if="question.hint"
        type="button"
        class="quiz-card__hint-btn"
        :aria-expanded="showHint"
        :aria-label="showHint ? 'Tutup Petunjuk' : 'Lihat Petunjuk'"
        @click="showHint = !showHint"
      >
        <AppIcon name="lightbulb" :size="18" />
        <span class="quiz-card__hint-text-label">{{ showHint ? 'Tutup Petunjuk' : 'Lihat Petunjuk' }}</span>
      </button>
    </div>

    <div v-if="question.type === 'image_quiz'" class="quiz-card__media">
      <QuizMediaIllustration
        :media-key="question.mediaKey"
        :caption="question.mediaCaption"
      />
      <p v-if="question.mediaCaption" class="quiz-card__media-caption">
        {{ question.mediaCaption }}
      </p>
    </div>

    <h1 class="quiz-card__prompt">
      {{ question.prompt }}
    </h1>

    <p v-if="question.type === 'multiple_select'" class="quiz-card__instruction">
      Pilih semua jawaban yang benar (bisa lebih dari satu).
    </p>

    <div v-if="showHint && question.hint" class="quiz-card__hint-box">
      <p class="quiz-card__hint-title">
        Petunjuk
      </p>
      <p class="quiz-card__hint-text">
        {{ question.hint }}
      </p>
    </div>

    <!-- Multiple Choice & Image Quiz -->
    <div
      v-if="question.type === 'multiple_choice' || question.type === 'image_quiz'"
      class="quiz-card__options"
      role="radiogroup"
      aria-label="Pilihan jawaban"
    >
      <button
        v-for="opt in question.options"
        :key="opt.id"
        type="button"
        role="radio"
        :aria-checked="selectedOption === opt.id"
        :disabled="Boolean(feedback)"
        class="quiz-option"
        :class="{ 'quiz-option--selected': selectedOption === opt.id }"
        @click="selectedOption = opt.id"
      >
        <span class="quiz-option__letter">{{ opt.letter }}</span>
        <span class="quiz-option__text">{{ opt.text }}</span>
      </button>
    </div>

    <!-- True / False -->
    <div
      v-else-if="question.type === 'true_false'"
      class="quiz-card__tf"
      role="radiogroup"
      aria-label="Pilihan benar atau salah"
    >
      <button
        v-for="opt in question.options"
        :key="opt.id"
        type="button"
        role="radio"
        :aria-checked="selectedOption === opt.id"
        :disabled="Boolean(feedback)"
        class="quiz-tf-btn"
        :class="{ 'quiz-tf-btn--selected': selectedOption === opt.id }"
        @click="selectedOption = opt.id"
      >
        {{ opt.text }}
      </button>
    </div>

    <!-- Multiple Select -->
    <div
      v-else-if="question.type === 'multiple_select'"
      class="quiz-card__options"
      role="group"
      aria-label="Pilihan ganda banyak jawaban"
    >
      <button
        v-for="opt in question.options"
        :key="opt.id"
        type="button"
        role="checkbox"
        :aria-checked="selectedOptions.includes(opt.id)"
        :disabled="Boolean(feedback)"
        class="quiz-option"
        :class="{ 'quiz-option--selected': selectedOptions.includes(opt.id) }"
        @click="toggleMultiOption(opt.id)"
      >
        <span class="quiz-checkbox" :class="{ 'quiz-checkbox--checked': selectedOptions.includes(opt.id) }" aria-hidden="true">
          <svg v-if="selectedOptions.includes(opt.id)" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="quiz-option__text">{{ opt.text }}</span>
      </button>
    </div>

    <!-- Fill in the Blank -->
    <form v-else class="quiz-card__fib" @submit.prevent="handleSubmit">
      <AppInput
        :id="`fib-${question.id}`"
        v-model="textAnswer"
        label="Tulis jawabanmu"
        placeholder="Ketik jawaban singkat di sini"
        helper-text="Tulis jawaban singkat tanpa kalimat panjang."
        :disabled="Boolean(feedback)"
      />
    </form>

    <!-- Feedback Panel -->
    <div
      v-if="feedback"
      class="quiz-feedback"
      :class="feedback.isCorrect ? 'quiz-feedback--correct' : 'quiz-feedback--review'"
      aria-live="polite"
    >
      <div class="quiz-feedback__header">
        <svg v-if="feedback.isCorrect" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
          <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
          <path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <h2 class="quiz-feedback__title">
          {{ feedback.title }}
        </h2>
      </div>
      <p v-if="feedback.correctAnswerLabel" class="quiz-feedback__answer">
        {{ feedback.correctAnswerLabel }}
      </p>
      <p class="quiz-feedback__body">
        {{ feedback.explanation }}
      </p>
    </div>

    <div class="quiz-card__actions">
      <AppButton
        v-if="!feedback"
        variant="primary"
        size="lg"
        :disabled="!canSubmit"
        :loading="submitting"
        @click="handleSubmit"
      >
        Kirim Jawaban
      </AppButton>
      <AppButton
        v-else
        variant="primary"
        size="lg"
        @click="emit('next')"
      >
        {{ isLastQuestion ? 'Selesaikan Kuis' : 'Soal Berikutnya' }}
      </AppButton>
    </div>
  </AppCard>
</template>

<style scoped>
.quiz-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.quiz-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.quiz-card__hint-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 36px;
  min-height: 36px;
  padding: 6px 10px;
  background-color: var(--feedback-hint-bg);
  border: 1.5px solid var(--action-accent-border);
  border-radius: 10px;
  font-family: var(--font-sans);
  font-size: var(--text-caption);
  font-weight: 600;
  color: var(--feedback-hint-fg);
}

.quiz-card__hint-text-label {
  display: none;
}

@media (min-width: 640px) {
  .quiz-card__hint-btn {
    padding: 6px 12px;
  }

  .quiz-card__hint-text-label {
    display: inline;
  }
}

.quiz-card__media {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
  background-color: var(--bg-surface-subtle);
  border: 1.5px solid var(--border-subtle);
  border-radius: var(--radius-lg);
}

.quiz-card__svg {
  border-radius: var(--radius-md);
  height: auto;
}

.quiz-card__media-caption {
  font-size: var(--text-caption);
  color: var(--text-secondary);
  text-align: center;
}

.quiz-card__prompt {
  font-family: var(--font-sans);
  font-size: var(--text-quiz-prompt);
  font-weight: 600;
  line-height: 1.5;
}

.quiz-card__instruction {
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

.quiz-card__hint-box {
  padding: var(--space-3) var(--space-4);
  background-color: var(--feedback-hint-bg);
  border: 1.5px solid var(--action-accent-border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.quiz-card__hint-title {
  font-size: var(--text-ui);
  font-weight: 600;
  color: var(--feedback-hint-fg);
}

.quiz-card__hint-text {
  font-size: var(--text-caption);
  color: var(--text-primary);
}

.quiz-card__options {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.quiz-option {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  min-height: var(--quiz-option-min-height);
  padding: var(--space-3) var(--space-4);
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-control);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-ui);
  font-weight: 600;
  color: var(--text-primary);
  text-align: left;
  transition: background-color var(--motion-fast), border-color var(--motion-fast);
}

.quiz-option:hover:not(:disabled) {
  background-color: var(--bg-surface-hover);
}

.quiz-option--selected {
  background-color: var(--action-primary-tint);
  border: 2px solid var(--action-primary);
  color: var(--action-primary-hover);
}

.quiz-option__letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  background-color: var(--bg-surface-subtle);
  color: var(--text-primary);
  border-radius: var(--radius-sm);
  font-size: var(--text-caption);
}

.quiz-option--selected .quiz-option__letter {
  background-color: var(--action-primary);
  color: var(--text-on-brand);
}

.quiz-checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-control);
  border-radius: var(--radius-sm);
  background-color: var(--bg-surface);
  color: var(--text-on-brand);
}

.quiz-checkbox--checked {
  background-color: var(--action-primary);
  border-color: var(--action-primary);
}

.quiz-card__tf {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-3);
}

.quiz-tf-btn {
  min-height: 60px;
  padding: var(--space-3) var(--space-4);
  background-color: var(--bg-surface);
  border: 2px solid var(--border-control);
  border-radius: var(--radius-md);
  box-shadow: 0 3px 0 var(--border-control);
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 600;
  color: var(--text-primary);
}

.quiz-tf-btn--selected {
  background-color: var(--action-primary-tint);
  border-color: var(--action-primary);
  box-shadow: 0 3px 0 var(--action-primary);
  color: var(--action-primary-hover);
}

.quiz-feedback {
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-lg);
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.quiz-feedback--correct {
  background-color: var(--feedback-correct-bg);
  border-color: var(--feedback-correct-fg);
}

.quiz-feedback--review {
  background-color: var(--feedback-review-bg);
  border-color: var(--feedback-review-fg);
}

.quiz-feedback__header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.quiz-feedback--correct .quiz-feedback__header,
.quiz-feedback--correct .quiz-feedback__title {
  color: var(--feedback-correct-fg);
}

.quiz-feedback--review .quiz-feedback__header,
.quiz-feedback--review .quiz-feedback__title {
  color: var(--feedback-review-fg);
}

.quiz-feedback__title {
  font-size: var(--text-h3);
}

.quiz-feedback__answer {
  font-size: var(--text-ui);
  font-weight: 600;
}

.quiz-card__actions {
  padding-top: var(--space-1);
}

@media (min-width: 640px) {
  .quiz-card__tf {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
