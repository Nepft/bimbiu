<script setup lang="ts">
const { user } = useAuth()
const customAvatarUrl = computed(() =>
  user.value?.avatarKey === 'custom' ? user.value.customAvatarData : null,
)
</script>

<template>
  <div class="layout-learner">
    <a href="#main-content" class="skip-link">Langsung ke konten utama</a>
    <LearnerTopBar
      :display-name="user?.displayName || 'Learner'"
      :avatar-key="user?.avatarKey || 'R1'"
      :avatar-url="customAvatarUrl"
    />
    <main id="main-content" class="layout-learner__main">
      <slot />
    </main>
    <LearnerFloatingNav />
  </div>
</template>

<style scoped>
.layout-learner {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.layout-learner__main {
  flex: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-5) var(--space-4) calc(var(--floating-nav-clearance-mobile) + env(safe-area-inset-bottom));
}

@media (min-width: 640px) {
  .layout-learner__main {
    padding: var(--space-6) var(--space-6) var(--floating-nav-clearance-desktop);
  }
}

@media (min-width: 1024px) {
  .layout-learner__main {
    padding: var(--space-8) 80px var(--floating-nav-clearance-desktop);
  }
}
</style>
