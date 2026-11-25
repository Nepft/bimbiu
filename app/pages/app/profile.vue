<script setup lang="ts">
import type { IllustrationName } from '~/components/ui/BimbiuIllustration.vue'

definePageMeta({ layout: 'learner' })
useHead({ title: 'Profil Learner - Bimbiu' })

const router = useRouter()
const { user, updateProfile, logout } = useAuth()
const { data: rewards } = await useFetch<{ level: number; totalXp: number }>('/api/rewards')
const displayName = ref(user.value?.displayName || 'Learner')
const avatarKey = ref(user.value?.avatarKey || 'R1')
const customAvatarData = ref<string | null>(user.value?.customAvatarData ?? null)
const savedMessage = ref('')
const saving = ref(false)
const showLogoutDialog = ref(false)

watch(user, (nextUser) => {
  if (nextUser) {
    displayName.value = nextUser.displayName
    avatarKey.value = nextUser.avatarKey
    customAvatarData.value = nextUser.customAvatarData ?? null
  }
})

const AVATAR_ILLU_MAP: Record<string, IllustrationName> = {
  R1: 'avatar-r1',
  R2: 'avatar-r2',
  R3: 'avatar-r3',
  R4: 'avatar-r4',
}

const currentAvatarIllustration = computed<IllustrationName>(() => AVATAR_ILLU_MAP[avatarKey.value] ?? 'avatar-r1')
const hasActiveCustomAvatar = computed(() => avatarKey.value === 'custom' && Boolean(customAvatarData.value))

async function handleSaveProfile() {
  if (displayName.value.trim().length < 2) {
    savedMessage.value = 'Nama tampilan minimal 2 huruf.'
    return
  }

  saving.value = true
  savedMessage.value = ''
  try {
    await updateProfile({
      displayName: displayName.value.trim(),
      avatarKey: avatarKey.value,
      customAvatarData: customAvatarData.value,
    })
    savedMessage.value = 'Perubahan profil tersimpan.'
  } catch (error: unknown) {
    const fetchErr = error as { data?: { statusMessage?: string }; statusMessage?: string }
    savedMessage.value = fetchErr?.data?.statusMessage || fetchErr?.statusMessage || 'Gagal menyimpan perubahan.'
  } finally {
    saving.value = false
  }
}

async function handleConfirmLogout() {
  showLogoutDialog.value = false
  await logout()
  await router.push('/auth/login')
}
</script>

<template>
  <div class="profile-page">
    <h1 class="profile-page__title">
      Profil Learner
    </h1>

    <AppCard padding="md" class="identity-card">
      <img
        v-if="hasActiveCustomAvatar"
        :src="customAvatarData!"
        :alt="`Avatar ${displayName}`"
        class="identity-card__custom-avatar"
      >
      <BimbiuIllustration v-else :name="currentAvatarIllustration" :size="64" />
      <div class="identity-card__info">
        <h2 class="identity-card__name">
          {{ displayName }}
        </h2>
        <p class="identity-card__meta">
          Level {{ rewards?.level ?? 1 }} · {{ rewards?.totalXp ?? 0 }} XP · Masuk dengan Akun Google
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
          <AvatarPicker
            v-model="avatarKey"
            v-model:custom-avatar-data="customAvatarData"
          />
        </div>

        <p v-if="savedMessage" class="profile-edit__status" aria-live="polite">
          {{ savedMessage }}
        </p>

        <div>
          <AppButton type="submit" variant="primary" size="lg" class="profile-edit__submit" :loading="saving">
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

.identity-card__custom-avatar {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-pill);
  object-fit: cover;
  border: 2px solid var(--action-primary);
  flex-shrink: 0;
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

.profile-edit__submit {
  width: 100%;
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
  .profile-edit__submit {
    width: auto;
  }

  .logout-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
