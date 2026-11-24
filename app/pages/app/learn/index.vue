<script setup lang="ts">
import { GENERAL_KNOWLEDGE_CATEGORIES } from '~/utils/learning-catalog'

definePageMeta({ layout: 'learner' })
useHead({ title: 'Belajar - Bimbiu' })

interface CatalogResponse {
  categories: Array<{
    id: string
    unitCount: number
    lessonCount: number
    completedLessons: number
  }>
}

const { data: catalog } = await useFetch<CatalogResponse>('/api/content/catalog')

const categoryCards = computed(() => {
  const apiCats = catalog.value?.categories
  if (!apiCats) return GENERAL_KNOWLEDGE_CATEGORIES
  return GENERAL_KNOWLEDGE_CATEGORIES.map((uiCat) => {
    const match = apiCats.find(c => c.id === uiCat.id)
    if (!match) return uiCat
    return {
      ...uiCat,
      learnerMeta: `${match.unitCount} unit · ${match.completedLessons}/${match.lessonCount} selesai`,
    }
  })
})
</script>

<template>
  <div class="learn-page">
    <header class="learn-page__header">
      <h1 class="learn-page__title">
        Pilih Bidang Pengetahuan
      </h1>
      <p class="learn-page__subtitle">
        Enam kategori pengetahuan umum. Mulai dari topik mana saja yang paling ingin kamu pelajari.
      </p>
    </header>

    <div class="learn-page__grid">
      <CategoryCard
        v-for="cat in categoryCards"
        :key="cat.id"
        :category-id="cat.id"
        :title="cat.title"
        :description="cat.description"
        :meta="cat.learnerMeta"
        :to="`/app/learn/${cat.id}`"
        show-button
      />
    </div>
  </div>
</template>

<style scoped>
.learn-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.learn-page__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.learn-page__title {
  font-size: var(--text-h1);
}

.learn-page__subtitle {
  color: var(--text-secondary);
}

.learn-page__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 640px) {
  .learn-page__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .learn-page__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
