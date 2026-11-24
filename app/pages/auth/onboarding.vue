<script setup lang="ts">
useHead({
  title: 'Lengkapi Profil - Bimbiu',
})

const router = useRouter()

const displayName = ref('Rafi')
const avatarKey = ref('R1')
const guardianChecked = ref(false)
const formError = ref('')

function handleCompleteOnboarding() {
  if (displayName.value.trim().length < 2) {
    formError.value = 'Nama tampilan minimal 2 huruf.'
    return
  }
  if (!guardianChecked.value) {
    formError.value = 'Centang konfirmasi pendampingan orang tua/wali terlebih dahulu.'
    return
  }
  formError.value = ''
  // TODO(Tahap 4): Kirim ke POST /api/auth/onboarding
  router.push('/app')
}
</script>

<template>
  <section class="onboarding-page">
    <AppCard variant="tactile" padding="lg" class="onboarding-card">
      <div class="onboarding-card__header">
        <h1 class="onboarding-card__title">
          Lengkapi Profil Belajarmu
        </h1>
        <p class="onboarding-card__subtitle">
          Akun Google berhasil terhubung. Pilih nama panggilan dan avatar bawaan untuk mulai kuis.
        </p>
      </div>

      <form class="onboarding-form" @submit.prevent="handleCompleteOnboarding">
        <AppInput
          id="onboarding-nickname"
          v-model="displayName"
          label="Nama Tampilan (Nickname)"
          placeholder="Contoh: Rafi"
          helper-text="Gunakan nama panggilan. Jangan masukkan nama lengkap atau data pribadi."
          :error="formError && displayName.trim().length < 2 ? formError : undefined"
        />

        <div class="onboarding-avatar-sec">
          <p class="onboarding-avatar-sec__label">
            Pilih Avatar Bawaan
          </p>
          <AvatarPicker v-model="avatarKey" />
        </div>

        <div class="guardian-box">
          <label for="guardian-consent" class="guardian-box__check">
            <input
              id="guardian-consent"
              v-model="guardianChecked"
              type="checkbox"
              class="guardian-box__input"
            >
            <span>Saya berusia 10-12 tahun dan menggunakan Bimbiu dengan sepengetahuan orang tua/wali.</span>
          </label>
        </div>

        <p v-if="formError" class="onboarding-error" role="alert">
          {{ formError }}
        </p>

        <AppButton type="submit" variant="primary" size="lg">
          Mulai Belajar di Bimbiu
        </AppButton>
      </form>
    </AppCard>
  </section>
</template>

<style scoped>
.onboarding-page {
  padding: var(--space-8) var(--space-4) var(--space-12);
  display: flex;
  justify-content: center;
}

.onboarding-card {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.onboarding-card__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.onboarding-card__title {
  font-size: var(--text-h1);
}

.onboarding-card__subtitle {
  color: var(--text-secondary);
}

.onboarding-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.onboarding-avatar-sec {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.onboarding-avatar-sec__label {
  font-size: var(--text-ui);
  font-weight: 600;
}

.guardian-box {
  padding: var(--space-3) var(--space-4);
  background-color: var(--feedback-hint-bg);
  border: 1.5px solid var(--action-accent-border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.guardian-box__tag {
  font-size: var(--text-caption);
  font-weight: 600;
  color: var(--feedback-hint-fg);
}

.guardian-box__check {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: var(--text-caption);
  color: var(--text-primary);
}

.guardian-box__input {
  width: 20px;
  height: 20px;
  margin-top: 2px;
  accent-color: var(--action-primary);
}

.onboarding-error {
  font-size: var(--text-caption);
  font-weight: 600;
  color: var(--feedback-review-fg);
}
</style>
