<script setup lang="ts">
import { GENERAL_KNOWLEDGE_CATEGORIES } from '~/utils/learning-catalog'

useHead({
  title: 'Bimbiu - Kuis Pengetahuan Umum Anak',
})

const learningSteps = [
  { num: '01', icon: 'step-01' as const, title: 'Pilih Topik', desc: 'Mulai dari kategori yang kamu minati dan buka unit belajar.' },
  { num: '02', icon: 'step-02' as const, title: 'Jawab Kuis', desc: 'Kerjakan soal pilihan ganda, benar/salah, atau isian singkat.' },
  { num: '03', icon: 'step-03' as const, title: 'Baca Penjelasan', desc: 'Setiap jawaban langsung menampilkan penjelasan agar makin paham.' },
  { num: '04', icon: 'step-04' as const, title: 'Raih XP & Badge', desc: 'Kumpulkan XP, naikkan level, dan buka lencana pencapaianmu.' },
]
</script>

<template>
  <div class="landing">
    <section class="landing-hero">
      <div class="landing-hero__copy">
        <h1 class="landing-hero__title">
          Kuis Pengetahuan Umum untuk Anak-anak
        </h1>
        <p class="landing-hero__subtitle">
          Belajar sains, geografi, sejarah, logika, bahasa, dan pengetahuan sehari-hari lewat kuis singkat dengan penjelasan di setiap soal.
        </p>
        <div class="landing-hero__actions">
          <AppButton variant="primary" size="lg" to="/auth/login">
            Daftar Gratis
          </AppButton>
          <AppButton variant="secondary" size="lg" to="/auth/login">
            Masuk
          </AppButton>
        </div>
      </div>

      <div class="landing-hero__preview">
        <QuizPreviewCard />
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-section__header">
        <h2 class="landing-section__title">
          Enam Bidang Pengetahuan Umum
        </h2>
        <p class="landing-section__subtitle">
          Pilih topik sesuai rasa ingin tahumu. Tidak harus dikerjakan berurutan.
        </p>
      </div>
      <div class="landing-categories">
        <CategoryCard
          v-for="cat in GENERAL_KNOWLEDGE_CATEGORIES"
          :key="cat.id"
          :category-id="cat.id"
          :title="cat.title"
          :description="cat.description"
          :meta="cat.publicMeta"
        />
      </div>
    </section>

    <section class="landing-flow">
      <div class="landing-flow__inner">
        <h2 class="landing-section__title">
          Cara Belajar di Bimbiu
        </h2>
        <div class="landing-flow__grid">
          <article v-for="step in learningSteps" :key="step.num" class="landing-step">
            <BimbiuIllustration :name="step.icon" :size="36" />
            <span class="landing-step__num">{{ step.num }}</span>
            <h3 class="landing-step__title">
              {{ step.title }}
            </h3>
            <p class="landing-step__desc">
              {{ step.desc }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="landing-cta">
      <AppCard variant="tint" padding="lg" class="landing-cta__card">
        <div class="landing-cta__copy">
          <h2 class="landing-section__title">
            Siap Mulai Kuis Pertamamu?
          </h2>
          <p class="landing-section__subtitle">
            Masuk ke akun learner untuk menyimpan progres, skor terbaik, XP, dan badge milikmu sendiri.
          </p>
        </div>
        <div class="landing-cta__actions">
          <AppButton variant="accent" size="lg" to="/auth/login">
            Buat Akun Learner
          </AppButton>
          <AppButton variant="secondary" size="lg" to="/auth/login">
            Masuk ke Akun
          </AppButton>
        </div>
      </AppCard>
    </section>

    <footer class="landing-footer">
      <div class="landing-footer__inner">
        <p class="landing-footer__copy">
          Bimbiu - Aplikasi Kuis Pengetahuan Umum (Usia 10-12 Tahun)
        </p>
        <div class="landing-footer__links">
          <NuxtLink to="/auth/login" class="landing-footer__link">
            Masuk
          </NuxtLink>
          <NuxtLink to="/auth/login" class="landing-footer__link">
            Buat Akun
          </NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.landing-hero {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  align-items: center;
}

.landing-hero__copy {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.landing-hero__title {
  font-size: var(--text-display);
  line-height: 1.18;
}

.landing-hero__subtitle {
  color: var(--text-secondary);
  max-width: 58ch;
}

.landing-hero__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.landing-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.landing-section__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.landing-section__title {
  font-size: var(--text-h2);
  line-height: 1.3;
}

.landing-section__subtitle {
  color: var(--text-secondary);
}

.landing-categories {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

.landing-flow {
  background-color: var(--bg-surface-subtle);
}

.landing-flow__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.landing-flow__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

.landing-step {
  padding: var(--space-4);
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.landing-step__num {
  font-size: var(--text-caption);
  font-weight: 600;
  color: var(--action-primary);
}

.landing-step__title {
  font-size: var(--text-h3);
}

.landing-step__desc {
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

.landing-cta {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}

.landing-cta__card {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  box-shadow: none;
}

.landing-cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  flex-shrink: 0;
}

.landing-cta__copy {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.landing-footer {
  background-color: var(--bg-surface);
  border-top: 1px solid var(--border-subtle);
}

.landing-footer__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-5) var(--space-4) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.landing-footer__copy {
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

.landing-footer__links {
  display: flex;
  gap: var(--space-6);
}

.landing-footer__link {
  font-size: var(--text-ui);
  font-weight: 600;
  color: var(--action-primary);
  text-decoration: none;
}

@media (min-width: 640px) {
  .landing-hero__actions {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .landing-categories,
  .landing-flow__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .landing-footer__inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

@media (min-width: 1024px) {
  .landing-hero {
    padding: 56px 80px;
    grid-template-columns: 1.05fr 0.95fr;
    gap: var(--space-12);
  }

  .landing-section,
  .landing-flow__inner,
  .landing-cta {
    padding: var(--space-12) 80px;
  }

  .landing-categories {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
  }

  .landing-flow__grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .landing-cta__card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-8);
  }

  .landing-footer__inner {
    padding: 20px 80px 24px;
  }
}
</style>
