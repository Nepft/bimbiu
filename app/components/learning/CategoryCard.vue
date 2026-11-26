<script setup lang="ts">
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

const BANNER_BG_MAP: Record<string, string> = {
  'science-nature': '#172330',
  'world-geography': '#1E4D8C',
  'history-culture': '#FEF6E4',
  'logic-mathematics': '#E6F3EF',
  'language-words': '#EEF4FF',
  'everyday-knowledge': '#FEF6E4',
}

const bannerBg = computed(() => BANNER_BG_MAP[props.categoryId] ?? '#172330')
</script>

<template>
  <article class="category-card">
    <div class="category-card__banner" :style="{ backgroundColor: bannerBg }" aria-hidden="true">
      <svg
        v-if="categoryId === 'science-nature'"
        width="120"
        height="64"
        viewBox="0 0 120 64"
        fill="none"
      >
        <circle cx="16" cy="14" r="2" fill="#FFFFFF" />
        <circle cx="102" cy="18" r="2.5" fill="#F2B632" />
        <circle cx="24" cy="50" r="1.5" fill="#0F6A5B" />
        <circle cx="96" cy="48" r="2" fill="#FFFFFF" />
        <circle cx="60" cy="32" r="18" fill="#F2B632" />
        <rect x="44" y="26" width="32" height="3.5" rx="1.75" fill="#8C5E00" />
        <rect x="43" y="34" width="34" height="3.5" rx="1.75" fill="#8C5E00" />
        <ellipse cx="60" cy="32" rx="34" ry="10" transform="rotate(-18 60 32)" stroke="#FAF7F0" stroke-width="3" />
      </svg>

      <svg
        v-else-if="categoryId === 'world-geography'"
        width="120"
        height="64"
        viewBox="0 0 120 64"
        fill="none"
      >
        <circle cx="18" cy="14" r="2" fill="#F2B632" />
        <circle cx="102" cy="48" r="2" fill="#FAF7F0" />
        <circle cx="60" cy="32" r="22" fill="#E6F3EF" stroke="#FAF7F0" stroke-width="2.5" />
        <ellipse cx="52" cy="23" rx="7.5" ry="6" fill="#0F6A5B" />
        <circle cx="69" cy="38" r="7" fill="#0F6A5B" />
        <ellipse cx="60" cy="32" rx="22" ry="7" stroke="#1E4D8C" stroke-opacity="0.2" stroke-width="1.5" />
      </svg>

      <svg
        v-else-if="categoryId === 'history-culture'"
        width="120"
        height="64"
        viewBox="0 0 120 64"
        fill="none"
      >
        <circle cx="20" cy="16" r="2" fill="#D4A853" />
        <circle cx="100" cy="20" r="2" fill="#D4A853" />
        <polygon points="60,10 86,25 34,25" fill="#8C5E00" />
        <rect x="41" y="27" width="7" height="20" rx="2" fill="#B4690E" />
        <rect x="56.5" y="27" width="7" height="20" rx="2" fill="#B4690E" />
        <rect x="72" y="27" width="7" height="20" rx="2" fill="#B4690E" />
        <rect x="34" y="49" width="52" height="5" rx="2" fill="#8C5E00" />
      </svg>

      <svg
        v-else-if="categoryId === 'logic-mathematics'"
        width="120"
        height="64"
        viewBox="0 0 120 64"
        fill="none"
      >
        <rect x="30" y="16" width="22" height="22" rx="5" fill="#0F6A5B" />
        <polygon points="60,18 74,44 46,44" fill="#1E4D8C" />
        <circle cx="80" cy="34" r="13" fill="#F2B632" />
      </svg>

      <svg
        v-else-if="categoryId === 'language-words'"
        width="120"
        height="64"
        viewBox="0 0 120 64"
        fill="none"
      >
        <rect x="30" y="13" width="28" height="38" rx="4" fill="#FFFFFF" stroke="#1E4D8C" stroke-width="2" />
        <rect x="62" y="13" width="28" height="38" rx="4" fill="#FFFFFF" stroke="#1E4D8C" stroke-width="2" />
        <rect x="58" y="13" width="4" height="38" fill="#1E4D8C" />
        <rect x="36" y="22" width="16" height="3.5" rx="1.75" fill="#1E4D8C" />
        <rect x="36" y="30" width="12" height="3.5" rx="1.75" fill="#64748B" />
        <rect x="68" y="22" width="16" height="3.5" rx="1.75" fill="#1E4D8C" />
        <rect x="68" y="30" width="12" height="3.5" rx="1.75" fill="#F2B632" />
      </svg>

      <svg
        v-else
        width="120"
        height="64"
        viewBox="0 0 120 64"
        fill="none"
      >
        <circle cx="60" cy="27" r="20" fill="#F2B632" fill-opacity="0.22" />
        <circle cx="60" cy="27" r="14" fill="#F2B632" />
        <circle cx="60" cy="25" r="5" fill="#FAF7F0" />
        <rect x="52" y="42" width="16" height="7" rx="2.5" fill="#172330" />
        <rect x="55" y="51" width="10" height="4" rx="2" fill="#64748B" />
      </svg>
    </div>

    <div class="category-card__title-box">
      <span class="category-card__title-accent" aria-hidden="true" />
      <h3 class="category-card__title">
        {{ title }}
      </h3>
    </div>

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

.category-card__banner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 84px;
  border-radius: 12px;
  overflow: hidden;
}

.category-card__title-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background-color: var(--bg-canvas);
  border: 1px solid #e6dec8;
  border-radius: 10px;
}

.category-card__title-accent {
  width: 4px;
  height: 22px;
  flex-shrink: 0;
  border-radius: 999px;
  background-color: var(--action-accent);
}

.category-card__title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.015em;
  color: var(--text-primary);
}

.category-card__desc {
  flex: 1;
  color: var(--text-secondary);
  font-size: 14.5px;
  line-height: 1.48;
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
