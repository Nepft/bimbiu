<template>
  <div class="layout-quiz-focus">
    <a href="#main-content" class="skip-link">Langsung ke konten utama</a>
    <slot name="header" />
    <main id="main-content" class="layout-quiz-focus__main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout-quiz-focus {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.layout-quiz-focus__main {
  flex: 1;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4) var(--space-8);
}

@media (min-width: 1024px) {
  .layout-quiz-focus__main {
    padding: var(--space-10) var(--space-4) var(--space-12);
  }
}
</style>
