<script setup lang="ts">
import type { QuizFeedbackView, QuizQuestionView } from '~/components/quiz/QuizRunnerCard.vue'

definePageMeta({ layout: false })

const route = useRoute()
const router = useRouter()
const lessonId = computed(() => String(route.params.lessonId || ''))

interface StartAttemptResponse {
  attempt: {
    id: string
    lessonId: string
    status: string
    totalQuestions: number
    answeredQuestionIds: string[]
  }
  lesson: {
    id: string
    categoryId: string
    title: string
    questions: QuizQuestionView[]
  }
}

const attemptId = ref('')
const lessonTitle = ref('Memuat Kuis...')
const categoryId = ref('science-nature')
const questions = ref<QuizQuestionView[]>([])
const currentIndex = ref(0)
const feedback = ref<QuizFeedbackView | null>(null)
const showExitDialog = ref(false)
const submitting = ref(false)
const loadError = ref('')

const idempotencyKey = useState<string>(`quiz-idemp-${route.fullPath}`, () => crypto.randomUUID())

const { data: started, error: startError } = await useFetch<StartAttemptResponse>('/api/quiz/attempts', {
  method: 'POST',
  body: {
    lessonId: lessonId.value,
    idempotencyKey: idempotencyKey.value,
  },
})

if (startError.value) {
  loadError.value =
    (startError.value.data as { statusMessage?: string } | undefined)?.statusMessage
    || 'Pelajaran tidak dapat dimulai saat ini.'
} else if (started.value) {
  attemptId.value = started.value.attempt.id
  lessonTitle.value = started.value.lesson.title
  categoryId.value = started.value.lesson.categoryId
  questions.value = started.value.lesson.questions

  const answeredSet = new Set(started.value.attempt.answeredQuestionIds)
  const firstUnanswered = questions.value.findIndex(q => !answeredSet.has(q.id))
  currentIndex.value = firstUnanswered >= 0 ? firstUnanswered : 0
}

useHead({ title: () => `${lessonTitle.value} - Bimbiu` })

const currentQuestion = computed(() => questions.value[currentIndex.value] ?? null)
const isLastQuestion = computed(() => currentIndex.value >= questions.value.length - 1)

async function handleSubmitAnswer(payload: { optionId?: string; optionIds?: string[]; text?: string }) {
  if (!attemptId.value || !currentQuestion.value) return
  submitting.value = true
  try {
    const res = await $fetch<QuizFeedbackView>(
      `/api/quiz/attempts/${attemptId.value}/answers`,
      {
        method: 'POST',
        body: {
          questionId: currentQuestion.value.id,
          ...payload,
        },
      },
    )
    feedback.value = res
  } catch (err: unknown) {
    const fetchErr = err as { data?: { statusMessage?: string }; statusMessage?: string }
    feedback.value = {
      isCorrect: false,
      title: 'Terjadi Kendala',
      explanation: fetchErr?.data?.statusMessage || fetchErr?.statusMessage || 'Gagal mengirim jawaban.',
    }
  } finally {
    submitting.value = false
  }
}

async function handleNext() {
  feedback.value = null
  if (isLastQuestion.value) {
    if (!attemptId.value) return
    submitting.value = true
    try {
      await $fetch(`/api/quiz/attempts/${attemptId.value}/complete`, {
        method: 'POST',
      })
      await router.push(`/app/result/${attemptId.value}`)
    } finally {
      submitting.value = false
    }
    return
  }
  currentIndex.value += 1
}

function handleConfirmExit() {
  showExitDialog.value = false
  router.push(`/app/learn/${categoryId.value}`)
}
</script>

<template>
  <NuxtLayout name="quiz-focus">
    <template #header>
      <QuizHeader
        :lesson-title="lessonTitle"
        :current-question="Math.min(currentIndex + 1, Math.max(questions.length, 1))"
        :total-questions="Math.max(questions.length, 1)"
        @exit="showExitDialog = true"
      />
    </template>

    <ErrorState
      v-if="loadError"
      title="Pelajaran Belum Bisa Dibuka"
      :description="loadError"
      action-label="Kembali ke Belajar"
      action-to="/app/learn"
    />

    <QuizRunnerCard
      v-else-if="currentQuestion"
      :question="currentQuestion"
      :is-last-question="isLastQuestion"
      :feedback="feedback"
      :submitting="submitting"
      @submit="handleSubmitAnswer"
      @next="handleNext"
    />

    <AppDialog
      :open="showExitDialog"
      title="Keluar dari Kuis?"
      @close="showExitDialog = false"
    >
      <p>Jawaban yang sudah kamu kirim tetap tersimpan. Kamu bisa melanjutkan lesson ini kapan saja dari halaman Beranda atau Belajar.</p>
      <template #actions>
        <AppButton variant="primary" @click="showExitDialog = false">
          Lanjut Mengerjakan
        </AppButton>
        <AppButton variant="secondary" @click="handleConfirmExit">
          Keluar ke Kategori
        </AppButton>
      </template>
    </AppDialog>
  </NuxtLayout>
</template>
