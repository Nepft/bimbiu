<script setup lang="ts">
interface Props {
  showMark?: boolean
}

withDefaults(defineProps<Props>(), {
  showMark: true,
})
</script>

<template>
  <span class="bimbiu-logo" aria-label="Bimbiu">
    <span v-if="showMark" class="bimbiu-logo__mark" aria-hidden="true">B</span>
    <span class="bimbiu-logo__word" aria-hidden="true">
      <span class="bimbiu-logo__text">{{ showMark ? 'imbiu' : 'Bimbiu' }}</span>
      <svg class="bimbiu-logo__smile" viewBox="0 0 68 10" fill="none">
        <path d="M3 3C22 9 46 9 65 2.5" stroke="#F2B632" stroke-width="3" stroke-linecap="round" />
      </svg>
    </span>
  </span>
</template>

<style scoped>
.bimbiu-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  user-select: none;
}

.bimbiu-logo__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background-color: var(--action-primary);
  color: var(--text-on-brand);
  border: 2px solid var(--action-primary-active);
  border-radius: 10px;
  box-shadow: 0 2px 0 var(--action-primary-active);
  transform: rotate(-5deg);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 20px;
  line-height: 1;
}

.bimbiu-logo__word {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  padding-bottom: 4px;
}

.bimbiu-logo__text {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 24px;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--action-primary);
}

.bimbiu-logo__smile {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  width: 100%;
  height: 8px;
}
</style>
