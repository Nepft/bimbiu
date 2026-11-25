<script setup lang="ts">
import type { IllustrationName } from '~/components/ui/BimbiuIllustration.vue'
import { GENERAL_KNOWLEDGE_CATEGORIES } from '~/utils/learning-catalog'

definePageMeta({ layout: 'learner' })

const route = useRoute()
const categoryId = computed(() => String(route.params.categoryId || 'science-nature'))

const CATEGORY_BANNER_MAP: Record<string, IllustrationName> = {
  'science-nature': 'solar-banner',
  'world-geography': 'banner-geography',
  'history-culture': 'banner-history',
  'logic-mathematics': 'banner-logic',
  'language-words': 'banner-language',
  'everyday-knowledge': 'banner-everyday',
}

const bannerName = computed<IllustrationName>(() => CATEGORY_BANNER_MAP[categoryId.value] ?? 'solar-banner')

interface CategoryDetailResponse {
  id: string
  title: string
  description: string
  units: Array<{
    id: string
    title: string
    order: number
    lessons: Array<{
      id: string
      title: string
      description: string
      estimatedMinutes: number
      order: number
      xpReward: number
      questionCount: number
      status: 'locked' | 'not_started' | 'completed' | 'mastered'
      bestScore: number
      attemptsCount: number
    }>
  }>
}

const { data: detail } = await useFetch<CategoryDetailResponse>(
  () => `/api/content/categories/${categoryId.value}`,
)

const currentCategory = computed(() => {
  if (detail.value) return detail.value
  return GENERAL_KNOWLEDGE_CATEGORIES.find(c => c.id === categoryId.value) ?? GENERAL_KNOWLEDGE_CATEGORIES[0]!
})

useHead({
  title: () => `${currentCategory.value.title} - Bimbiu`,
})
</script>

<template>
  <div class="category-detail">
    <NuxtLink to="/app/learn" class="category-detail__back">
      <AppIcon name="arrow-left" :size="18" />
      <span>Kembali ke Kategori</span>
    </NuxtLink>

    <header class="category-detail__header">
      <BimbiuIllustration :name="bannerName" />
      <div class="category-detail__header-copy">
        <h1 class="category-detail__title">
          {{ currentCategory.title }}
        </h1>
        <p class="category-detail__subtitle">
          {{ currentCategory.description }}
        </p>
      </div>
    </header>

    <section v-for="unit in detail?.units ?? []" :key="unit.id" class="category-detail__unit">
      <h2 class="category-detail__unit-title">
        Unit {{ unit.order }}: {{ unit.title }}
      </h2>
      <div class="category-detail__lessons">
        <LessonRowCard
          v-for="ls in unit.lessons"
          :key="ls.id"
          :lesson-number="`Pelajaran ${ls.order}`"
          :title="ls.title"
          :description="ls.description"
          :estimated-minutes="ls.estimatedMinutes"
          :xp-reward="ls.xpReward"
          :question-count="ls.questionCount"
          :best-score="ls.bestScore"
          :attempts-count="ls.attemptsCount"
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
  padding: 6px 12px;
  border-radius: var(--radius-md);
  font-size: var(--text-ui);
  font-weight: 600;
  color: var(--action-primary);
  text-decoration: none;
  transition: background-color var(--motion-fast), color var(--motion-fast);
}

.category-detail__back:hover {
  background-color: var(--action-primary-tint);
  color: var(--action-primary-hover);
  text-decoration: underline;
  text-underline-offset: 4px;
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
