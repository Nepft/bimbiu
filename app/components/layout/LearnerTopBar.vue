<script setup lang="ts">
import type { IllustrationName } from '~/components/ui/BimbiuIllustration.vue'

interface Props {
  displayName?: string
  level?: number
  avatarKey?: string
  avatarUrl?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  displayName: 'Learner',
  level: 1,
  avatarKey: 'R1',
  avatarUrl: null,
})

const AVATAR_ILLU_MAP: Record<string, IllustrationName> = {
  R1: 'avatar-r1',
  R2: 'avatar-r2',
  R3: 'avatar-r3',
  R4: 'avatar-r4',
}

const presetIllustration = computed<IllustrationName>(() => AVATAR_ILLU_MAP[props.avatarKey] ?? 'avatar-r1')
</script>

<template>
  <header class="learner-topbar">
    <div class="learner-topbar__inner">
      <NuxtLink to="/app" class="learner-topbar__brand">
        <BimbiuLogo />
      </NuxtLink>

      <NuxtLink to="/app/profile" class="learner-topbar__profile" aria-label="Buka profil learner">
        <img
          v-if="avatarKey === 'custom' && avatarUrl"
          :src="avatarUrl"
          alt=""
          class="learner-topbar__avatar-img"
        >
        <BimbiuIllustration
          v-else
          :name="presetIllustration"
          :size="26"
          class="learner-topbar__avatar-svg"
        />
        <span class="learner-topbar__label">
          {{ displayName }}
        </span>
      </NuxtLink>
    </div>
  </header>
</template>

<style scoped>
.learner-topbar {
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-subtle);
}

.learner-topbar__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 12px var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.learner-topbar__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.learner-topbar__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: var(--action-primary);
  color: var(--text-on-brand);
  border-radius: var(--radius-sm);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 17px;
}

.learner-topbar__wordmark {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 21px;
  color: var(--action-primary);
}

.learner-topbar__profile {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--touch-target-min);
  padding: 4px 12px 4px 8px;
  background-color: var(--bg-surface-subtle);
  border: 1.5px solid var(--border-subtle);
  border-radius: var(--radius-pill);
  text-decoration: none;
  color: var(--text-primary);
  font-size: var(--text-caption);
  font-weight: 600;
}

.learner-topbar__profile.router-link-active {
  background-color: var(--action-primary-tint);
  border-color: var(--action-primary);
}

.learner-topbar__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background-color: var(--action-primary);
  color: var(--text-on-brand);
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 700;
}

.learner-topbar__avatar-img {
  width: 26px;
  height: 26px;
  border-radius: var(--radius-pill);
  object-fit: cover;
  border: 1.5px solid var(--action-primary);
}

@media (min-width: 1024px) {
  .learner-topbar__inner {
    padding: 14px 80px;
  }
}
</style>
