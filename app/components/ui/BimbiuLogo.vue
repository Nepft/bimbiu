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
      <span class="bimbiu-logo__text">
        <template v-if="!showMark">B</template><span class="bimbiu-logo__i">i<span class="bimbiu-logo__dot" /></span>mb<span class="bimbiu-logo__i">i<span class="bimbiu-logo__dot" /></span>u
      </span>
      <svg class="bimbiu-logo__smile" viewBox="0 0 64 8" fill="none">
        <path d="M2 2.5C20 7.5 44 7.5 62 2" stroke="#F2B632" stroke-width="3" stroke-linecap="round" />
      </svg>
    </span>
  </span>
</template>

<style scoped>
.bimbiu-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  user-select: none;
}

.bimbiu-logo__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
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
  padding-bottom: 5px;
}

.bimbiu-logo__text {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 26px;
  line-height: 1.05;
  letter-spacing: -0.015em;
  color: var(--action-primary);
}

.bimbiu-logo__i {
  position: relative;
  display: inline-block;
}

.bimbiu-logo__dot {
  position: absolute;
  top: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background-color: var(--action-accent);
  pointer-events: none;
}

.bimbiu-logo__smile {
  position: absolute;
  left: 2px;
  right: 2px;
  bottom: -1px;
  width: calc(100% - 4px);
  height: 7px;
}
</style>
