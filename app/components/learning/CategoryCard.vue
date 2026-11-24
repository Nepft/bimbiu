<script setup lang="ts">
import type { IllustrationName } from '~/components/ui/BimbiuIllustration.vue'

interface Props {
  categoryId?: string
  title: string
  description: string
  meta: string
  to?: string
  showButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  categoryId: 'science-nature',
  to: undefined,
  showButton: false,
})

const CATEGORY_ICON_MAP: Record<string, IllustrationName> = {
  'science-nature': 'cat-science',
  'world-geography': 'cat-geography',
  'history-culture': 'cat-history',
  'logic-mathematics': 'cat-logic',
  'language-words': 'cat-language',
  'everyday-knowledge': 'cat-everyday',
}

const iconName = computed<IllustrationName>(() => CATEGORY_ICON_MAP[props.categoryId] ?? 'cat-science')
</script>

<template>
  <article class="category-card">
    <div class="category-card__icon" aria-hidden="true">
      <BimbiuIllustration :name="iconName" :size="44" />
    </div>
    <h3 class="category-card__title">
      {{ title }}
    </h3>
    <p class="category-card__desc">
      {{ description }}
    </p>
    <p class="category-card__meta">
      {{ meta }}
    </p>
    <div v-if="showButton && to" class="category-card__action">
      <AppButton variant="secondary" size="md" :to="to" block class="category-card__btn">
        Buka Kategori
      </AppButton>
    </div>
  </article>
</template>

<style scoped>
.category-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-6);
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  transition: transform var(--motion-fast), box-shadow var(--motion-fast), border-color var(--motion-fast);
}

.category-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-control);
  box-shadow: 0 4px 0 var(--border-subtle);
}

.category-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background-color: var(--action-primary-tint);
  color: var(--action-primary-hover);
  border-radius: var(--radius-sm);
}

.category-card__title {
  font-size: var(--text-h3);
  font-weight: 600;
}

.category-card__desc {
  flex: 1;
  color: var(--text-secondary);
  font-size: var(--text-body);
}

.category-card__meta {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--action-primary);
}

.category-card__action {
  padding-top: var(--space-1);
}

:deep(.category-card__btn:hover:not(:disabled)) {
  background-color: var(--action-primary);
  color: var(--text-on-brand);
  border-color: var(--action-primary-active);
  box-shadow: 0 3px 0 var(--action-primary-active);
}
</style>
