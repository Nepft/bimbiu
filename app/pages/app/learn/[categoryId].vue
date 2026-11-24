<script setup lang="ts">
import { GENERAL_KNOWLEDGE_CATEGORIES } from '~/utils/learning-catalog'

definePageMeta({ layout: 'learner' })

const route = useRoute()
const categoryId = computed(() => String(route.params.categoryId || 'science-nature'))

const currentCategory = computed(() => {
  return GENERAL_KNOWLEDGE_CATEGORIES.find(c => c.id === categoryId.value) ?? GENERAL_KNOWLEDGE_CATEGORIES[0]!
})

useHead({
  title: () => `${currentCategory.value.title} - Bimbiu`,
})

const lessons = [
  {
    id: 'science-planets-01',
    num: 'Pelajaran 1',
    title: 'Mengenal Planet',
    description: 'Kenali urutan planet, ukuran, dan ciri khasnya di tata surya.',
    meta: '~5 menit · +20 XP · Skor terbaik: 90',
    status: 'mastered' as const,
  },
  {
    id: 'science-moon-02',
    num: 'Pelajaran 2',
    title: 'Bulan dan Satelit',
    description: 'Pelajari fase bulan serta fungsi satelit alami dan buatan.',
    meta: '~5 menit · +20 XP · 3 dari 6 soal terjawab',
    status: 'in_progress' as const,
  },
  {
    id: 'science-stars-03',
    num: 'Pelajaran 3',
    title: 'Bintang dan Galaksi',
    description: 'Selesaikan "Bulan dan Satelit" terlebih dahulu untuk membuka pelajaran ini.',
    meta: '~6 menit · +20 XP',
    status: 'locked' as const,
  },
]
</script>

<template>
  <div class="category-detail">
    <NuxtLink to="/app/learn" class="category-detail__back">
      <AppIcon name="arrow-left" :size="18" />
      <span>Kembali ke Kategori</span>
    </NuxtLink>

    <header class="category-detail__header">
      <BimbiuIllustration name="solar-banner" />
      <div class="category-detail__header-copy">
        <h1 class="category-detail__title">
          {{ currentCategory.title }}
        </h1>
        <p class="category-detail__subtitle">
          {{ currentCategory.description }}
        </p>
      </div>
    </header>

    <section class="category-detail__unit">
      <h2 class="category-detail__unit-title">
        Unit 1: Tata Surya
      </h2>
      <div class="category-detail__lessons">
        <LessonRowCard
          v-for="ls in lessons"
          :key="ls.id"
          :lesson-number="ls.num"
          :title="ls.title"
          :description="ls.description"
          :meta="ls.meta"
          :status="ls.status"
          :to="ls.status === 'locked' ? undefined : `/app/lesson/${ls.id}`"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.category-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.category-detail__back {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-ui);
  font-weight: 600;
  color: var(--action-primary);
  text-decoration: none;
}

.category-detail__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.category-detail__header-copy {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

@media (min-width: 640px) {
  .category-detail__header {
    flex-direction: row;
    align-items: center;
    gap: var(--space-5);
  }
}

.category-detail__title {
  font-size: var(--text-h1);
}

.category-detail__subtitle {
  color: var(--text-secondary);
}

.category-detail__unit {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.category-detail__unit-title {
  font-size: var(--text-h2);
}

.category-detail__lessons {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
</style>
