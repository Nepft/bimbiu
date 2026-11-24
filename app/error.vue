<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const isNotFound = computed(() => props.error?.statusCode === 404)

function handleGoHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="error-page-shell">
    <PublicHeader :show-login-action="false" />
    <main class="error-page-main">
      <AppCard variant="tactile" padding="lg" class="error-card">
        <BimbiuIllustration :name="isNotFound ? 'compass-lost' : 'padlock'" :size="64" />
        <StatusBadge :label="isNotFound ? '404' : 'Kendala'" tone="accent" />
        <h1 class="error-card__title">
          {{ isNotFound ? 'Halaman Tidak Ditemukan' : 'Terjadi Kendala Sementara' }}
        </h1>
        <p class="error-card__desc">
          {{ isNotFound ? 'Halaman atau materi yang kamu cari tidak tersedia. Ayo kembali ke halaman utama.' : 'Sistem sedang mengalami gangguan ringan. Silakan kembali ke beranda dan coba lagi.' }}
        </p>
        <div>
          <AppButton variant="primary" size="lg" @click="handleGoHome">
            Kembali ke Beranda
          </AppButton>
        </div>
      </AppCard>
    </main>
  </div>
</template>

<style scoped>
.error-page-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.error-page-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
}

.error-card {
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.error-card__title {
  font-size: var(--text-h1);
}

.error-card__desc {
  color: var(--text-secondary);
}
</style>
