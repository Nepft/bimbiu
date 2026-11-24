<script setup lang="ts">
import type { QuizFeedbackView, QuizQuestionView } from '~/components/quiz/QuizRunnerCard.vue'

definePageMeta({ layout: false })
useHead({ title: 'Kuis Mengenal Planet - Bimbiu' })

const router = useRouter()

// UI-only preview questions covering all 5 MVP question types.
// TODO(Tahap 5): Ganti dengan data dari POST /api/quiz/attempts dan evaluasi server POST .../answers.
const questions: QuizQuestionView[] = [
  {
    id: 'q-mc',
    type: 'multiple_choice',
    prompt: 'Planet terbesar di tata surya adalah?',
    hint: 'Perhatikan planet raksasa gas yang ukurannya jauh lebih besar daripada Bumi.',
    options: [
      { id: 'a', letter: 'A', text: 'Bumi' },
      { id: 'b', letter: 'B', text: 'Jupiter' },
      { id: 'c', letter: 'C', text: 'Mars' },
      { id: 'd', letter: 'D', text: 'Venus' },
    ],
  },
  {
    id: 'q-tf',
    type: 'true_false',
    prompt: 'Saturnus adalah satu-satunya planet yang dikelilingi cincin es dan batuan yang sangat jelas.',
    hint: 'Ingat kembali posisi planet yang memiliki cincin es dan batuan paling jelas terlihat dari Bumi.',
    options: [
      { id: 'true', text: 'Benar' },
      { id: 'false', text: 'Salah' },
    ],
  },
  {
    id: 'q-fib',
    type: 'fill_in_the_blank',
    prompt: 'Planet yang paling dekat dengan Matahari bernama ____.',
    hint: 'Nama planetnya berawalan huruf M.',
  },
  {
    id: 'q-ms',
    type: 'multiple_select',
    prompt: 'Manakah dari berikut ini yang termasuk planet kebumian (berbatu) di tata surya?',
    hint: 'Planet kebumian terletak di bagian dalam tata surya sebelum sabuk asteroid.',
    options: [
      { id: 'm1', text: 'Merkurius' },
      { id: 'm2', text: 'Bumi' },
      { id: 'm3', text: 'Jupiter' },
      { id: 'm4', text: 'Mars' },
    ],
  },
  {
    id: 'q-img',
    type: 'image_quiz',
    prompt: 'Berdasarkan gambar di atas, nama planet yang ditunjukkan adalah?',
    mediaKey: 'quiz-planet',
    mediaCaption: 'Ilustrasi: Planet biru di tata surya dengan orbit dan satelit alaminya',
    hint: 'Planet ini berada di urutan kedelapan dari Matahari.',
    options: [
      { id: 'i1', letter: 'A', text: 'Uranus' },
      { id: 'i2', letter: 'B', text: 'Saturnus' },
      { id: 'i3', letter: 'C', text: 'Neptunus' },
      { id: 'i4', letter: 'D', text: 'Jupiter' },
    ],
  },
]

const currentIndex = ref(0)
const feedback = ref<QuizFeedbackView | null>(null)
const showExitDialog = ref(false)
const submitting = ref(false)

const currentQuestion = computed(() => questions[currentIndex.value] ?? questions[0]!)
const isLastQuestion = computed(() => currentIndex.value >= questions.length - 1)

function handleSubmitAnswer() {
  submitting.value = true
  // TODO(Tahap 5): Kirim jawaban ke server /api/quiz/attempts/:attemptId/answers
  feedback.value = {
    isCorrect: true,
    title: 'Jawaban Dicatat (Pratinjau UI)',
    explanation: 'Penilaian dan penjelasan resmi akan dikirim langsung oleh server Nitro setelah tahap backend terhubung.',
  }
  submitting.value = false
}

function handleNext() {
  feedback.value = null
  if (isLastQuestion.value) {
    router.push('/app/result/preview-attempt')
    return
  }
  currentIndex.value += 1
}

function handleConfirmExit() {
  showExitDialog.value = false
  router.push('/app/learn/science-nature')
}
</script>

<template>
  <NuxtLayout name="quiz-focus">
    <template #header>
      <QuizHeader
        lesson-title="Mengenal Planet"
        :current-question="currentIndex + 1"
        :total-questions="questions.length"
        @exit="showExitDialog = true"
      />
    </template>

    <QuizRunnerCard
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
