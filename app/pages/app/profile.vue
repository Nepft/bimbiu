<script setup lang="ts">
import type { IllustrationName } from '~/components/ui/BimbiuIllustration.vue'

definePageMeta({ layout: 'learner' })
useHead({ title: 'Profil Learner - Bimbiu' })

const router = useRouter()
const displayName = ref('Rafi')
const avatarKey = ref('R1')
const savedMessage = ref('')
const showLogoutDialog = ref(false)

const AVATAR_ILLU_MAP: Record<string, IllustrationName> = {
  R1: 'avatar-r1',
  R2: 'avatar-r2',
  R3: 'avatar-r3',
  R4: 'avatar-r4',
}

const currentAvatarIllustration = computed<IllustrationName>(() => AVATAR_ILLU_MAP[avatarKey.value] ?? 'avatar-r1')

function handleSaveProfile() {
  if (displayName.value.trim().length < 2) {
    savedMessage.value = 'Nama tampilan minimal 2 huruf.'
    return
  }
  // TODO(Tahap 4): Kirim ke PATCH /api/profile
  savedMessage.value = 'Perubahan profil tersimpan.'
}

function handleConfirmLogout() {
  showLogoutDialog.value = false
  // TODO(Tahap 4): Panggil POST /api/auth/logout
  router.push('/auth/login')
}
</script>

<template>
  <div class="profile-page">
    <h1 class="profile-page__title">
      Profil Learner
    </h1>

    <AppCard padding="md" class="identity-card">
      <BimbiuIllustration :name="currentAvatarIllustration" :size="64" />
      <div class="identity-card__info">
        <h2 class="identity-card__name">
          {{ displayName }}
        </h2>
        <p class="identity-card__meta">
          Level 2 · 140 XP · Masuk dengan Akun Google
        </p>
      </div>
    </AppCard>

    <AppCard padding="lg" class="profile-edit">
      <form class="profile-edit__form" @submit.prevent="handleSaveProfile">
        <AppInput
          id="profile-nickname"
          v-model="displayName"
          label="Nama Tampilan"
          helper-text="Gunakan nama panggilan. Jangan masukkan nama lengkap atau data pribadi."
        />

        <div class="profile-edit__avatars">
          <p class="profile-edit__label">
            Pilih Avatar Bawaan
          </p>
          <AvatarPicker v-model="avatarKey" />
        </div>

        <p v-if="savedMessage" class="profile-edit__status" aria-live="polite">
          {{ savedMessage }}
        </p>

        <div>
          <AppButton type="submit" variant="primary" size="lg">
            Simpan Perubahan
          </AppButton>
        </div>
      </form>
    </AppCard>

    <AppCard padding="md" class="logout-card">
      <div class="logout-card__copy">
        <h2 class="logout-card__title">
          Sesi Akun
        </h2>
        <p class="logout-card__desc">
          Keluar jika kamu menggunakan perangkat bersama.
        </p>
      </div>
      <AppButton variant="danger-soft" size="lg" @click="showLogoutDialog = true">
        <AppIcon name="log-out" :size="18" />
        <span>Keluar dari Akun</span>
      </AppButton>
    </AppCard>

    <AppDialog
      :open="showLogoutDialog"
      title="Keluar dari Akun?"
      @close="showLogoutDialog = false"
    >
      <BimbiuIllustration name="dialog-door" :size="48" />
      <p>Progres, XP, dan badge kamu aman tersimpan. Kamu bisa masuk kembali kapan saja lewat akun Google.</p>
      <template #actions>
        <AppButton variant="secondary" @click="showLogoutDialog = false">
          Batal
        </AppButton>
        <AppButton variant="danger-soft" @click="handleConfirmLogout">
          Ya, Keluar
        </AppButton>
      </template>
    </AppDialog>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.profile-page__title {
  font-size: var(--text-h1);
}

.identity-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.identity-card__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  background-color: var(--action-primary);
  color: var(--text-on-brand);
  border-radius: var(--radius-pill);
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
}

.identity-card__info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.identity-card__name {
  font-size: var(--text-h2);
}

.identity-card__meta {
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

.profile-edit__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.profile-edit__avatars {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.profile-edit__label {
  font-size: var(--text-ui);
  font-weight: 600;
}

.profile-edit__status {
  font-size: var(--text-caption);
  font-weight: 600;
  color: var(--feedback-correct-fg);
}

.logout-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.logout-card__copy {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.logout-card__title {
  font-size: var(--text-h3);
}

.logout-card__desc {
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

@media (min-width: 640px) {
  .logout-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
