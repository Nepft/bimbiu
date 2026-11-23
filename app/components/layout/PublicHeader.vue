<script setup lang="ts">
interface Props {
  showLoginAction?: boolean
}

withDefaults(defineProps<Props>(), {
  showLoginAction: true,
})
</script>

<template>
  <header class="public-header">
    <div class="public-header__inner">
      <NuxtLink to="/" class="public-header__brand">
        <span class="public-header__mark" aria-hidden="true">B</span>
        <span class="public-header__wordmark">Bimbiu</span>
      </NuxtLink>
      <nav aria-label="Navigasi publik" class="public-header__nav">
        <slot name="actions">
          <AppButton v-if="showLoginAction" variant="primary" size="md" to="/auth/login">
            Masuk dengan Google
          </AppButton>
        </slot>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.public-header {
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-subtle);
}

.public-header__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 14px var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.public-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.public-header__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background-color: var(--action-primary);
  color: var(--text-on-brand);
  border-radius: var(--radius-sm);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 18px;
}

.public-header__wordmark {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 22px;
  color: var(--action-primary);
}

@media (min-width: 1024px) {
  .public-header__inner {
    padding: 16px 80px;
  }
}
</style>
