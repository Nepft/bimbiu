<script setup lang="ts">
useHead({
  title: 'Masuk ke Bimbiu',
})

const route = useRoute()
const router = useRouter()

const hasAuthError = computed(() => route.query.error === 'cancelled' || route.query.error === 'failed')

function handleGoogleSignIn() {
  // TODO(Tahap 4): Arahkan ke /api/auth/google setelah endpoint OAuth Nitro diimplementasikan
  router.push('/auth/onboarding')
}
</script>

<template>
  <section class="auth-page">
    <AppCard variant="tactile" padding="lg" class="auth-card">
      <BimbiuIllustration name="mascot" :size="56" />
      <div class="auth-card__header">
        <h1 class="auth-card__title">
          Masuk ke Bimbiu
        </h1>
        <p class="auth-card__subtitle">
          Gunakan akun Google untuk mulai kuis, menyimpan skor terbaik, XP, dan badge milikmu.
        </p>
      </div>

      <div v-if="hasAuthError" class="auth-error" role="alert">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
          <path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <p>Proses masuk dibatalkan atau gagal. Tekan tombol Masuk dengan Akun Google untuk mencoba lagi.</p>
      </div>

      <button type="button" class="google-btn" @click="handleGoogleSignIn">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        <span>Masuk dengan Akun Google</span>
      </button>

      <div class="auth-notice">
        <p class="auth-notice__title">
          Akun Learner
        </p>
        <p class="auth-notice__body">
          Bimbiu hanya menggunakan data akun seminimal mungkin untuk menyimpan progres belajarmu.
        </p>
      </div>

      <div class="auth-card__footer">
        <NuxtLink to="/" class="auth-card__link">
          <AppIcon name="arrow-left" :size="18" />
          <span>Kembali ke Halaman Utama</span>
        </NuxtLink>
      </div>
    </AppCard>
  </section>
</template>

<style scoped>
.auth-page {
  min-height: calc(100dvh - 70px);
  padding: var(--space-8) var(--space-4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.auth-card__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.auth-card__title {
  font-size: var(--text-h1);
}

.auth-card__subtitle {
  color: var(--text-secondary);
}

.auth-error {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background-color: var(--feedback-review-bg);
  border: 1.5px solid var(--feedback-review-fg);
  border-radius: var(--radius-md);
  color: var(--feedback-review-fg);
  font-size: var(--text-caption);
  font-weight: 500;
}

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  width: 100%;
  min-height: 52px;
  padding: var(--space-3) var(--space-5);
  background-color: var(--bg-surface);
  border: 2px solid var(--border-control);
  border-radius: var(--radius-md);
  box-shadow: 0 3px 0 var(--border-control);
  font-family: var(--font-sans);
  font-size: var(--text-ui);
  font-weight: 600;
  color: var(--text-primary);
  transition: background-color var(--motion-fast), transform var(--motion-fast), box-shadow var(--motion-fast);
}

.google-btn:hover {
  background-color: var(--bg-surface-hover);
}

.google-btn:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 var(--border-control);
}

.auth-notice {
  padding: var(--space-3) var(--space-4);
  background-color: var(--bg-surface-subtle);
  border: 1.5px solid var(--border-subtle);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.auth-notice__title {
  font-size: var(--text-ui);
  font-weight: 600;
}

.auth-notice__body {
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

.auth-card__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-3);
}

.auth-card__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-ui);
  font-weight: 600;
  color: var(--action-primary);
  text-decoration: none;
}
</style>
