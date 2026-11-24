<script setup lang="ts">
interface Props {
  showLoginAction?: boolean
}

withDefaults(defineProps<Props>(), {
  showLoginAction: true,
})

const route = useRoute()
const { isHidden } = useSmartHeader()

const isLanding = computed(() => route.path === '/')
const isLogin = computed(() => route.path.startsWith('/auth/login'))
const isOnboarding = computed(() => route.path.startsWith('/auth/onboarding'))
const isPrivacy = computed(() => route.path.startsWith('/privacy'))
</script>

<template>
  <header class="public-header" :class="{ 'public-header--hidden': isHidden }">
    <div class="public-header__inner">
      <NuxtLink to="/" class="public-header__brand">
        <BimbiuLogo :show-mark="!isOnboarding" />
      </NuxtLink>
      <nav aria-label="Navigasi publik" class="public-header__nav">
        <slot name="actions">
          <template v-if="isLanding">
            <AppButton variant="secondary" size="md" to="/auth/login">
              Masuk
            </AppButton>
            <AppButton variant="primary" size="md" to="/auth/login" class="public-header__signup">
              Daftar Gratis
            </AppButton>
          </template>
          <AppButton v-else-if="isLogin" variant="secondary" size="md" to="/">
            <AppIcon name="arrow-left" :size="18" />
            <span>Kembali ke Beranda</span>
          </AppButton>
          <span v-else-if="isOnboarding" class="public-header__status">
            Lengkapi Profil Awal
          </span>
          <AppButton v-else-if="isPrivacy" variant="secondary" size="md" to="/">
            <AppIcon name="arrow-left" :size="18" />
            <span>Kembali</span>
          </AppButton>
          <AppButton v-else-if="showLoginAction" variant="secondary" size="md" to="/auth/login">
            Masuk
          </AppButton>
        </slot>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.public-header {
  position: sticky;
  top: 0;
  z-index: 400;
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-subtle);
  transition: transform 0.22s ease;
}

.public-header--hidden {
  transform: translateY(-100%);
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

.public-header__nav {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
}

.public-header__signup {
  display: none;
}

.public-header__status {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--text-secondary);
}

@media (min-width: 640px) {
  .public-header__signup {
    display: inline-flex;
  }
}

@media (min-width: 1024px) {
  .public-header__inner {
    padding: 16px 80px;
  }
}
</style>
