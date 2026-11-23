<template>
  <div class="layout-default">
    <a href="#main-content" class="skip-link">Langsung ke konten utama</a>
    <PublicHeader />
    <main id="main-content" class="layout-default__main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout-default {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.layout-default__main {
  flex: 1;
}
</style>
