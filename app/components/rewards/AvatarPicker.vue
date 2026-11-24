<script setup lang="ts">
import type { IllustrationName } from '~/components/ui/BimbiuIllustration.vue'

export interface AvatarOption {
  key: string
  label: string
  bg: string
  fg: string
}

interface Props {
  modelValue: string
  options?: AvatarOption[]
}

const AVATAR_ILLU_MAP: Record<string, IllustrationName> = {
  R1: 'avatar-r1',
  R2: 'avatar-r2',
  R3: 'avatar-r3',
  R4: 'avatar-r4',
}

withDefaults(defineProps<Props>(), {
  options: () => [
    { key: 'R1', label: 'Kompas', bg: 'var(--action-primary)', fg: 'var(--text-on-brand)' },
    { key: 'R2', label: 'Atlas', bg: 'var(--action-atlas)', fg: 'var(--text-on-brand)' },
    { key: 'R3', label: 'Surya', bg: 'var(--action-accent)', fg: 'var(--text-primary)' },
    { key: 'R4', label: 'Bintang', bg: 'var(--bg-surface-subtle)', fg: 'var(--text-primary)' },
  ],
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="avatar-picker" role="radiogroup" aria-label="Pilih avatar bawaan">
    <button
      v-for="item in options"
      :key="item.key"
      type="button"
      role="radio"
      :aria-checked="modelValue === item.key"
      class="avatar-picker__item"
      :class="{ 'avatar-picker__item--selected': modelValue === item.key }"
      @click="emit('update:modelValue', item.key)"
    >
      <BimbiuIllustration :name="AVATAR_ILLU_MAP[item.key] ?? 'avatar-r1'" :size="44" />
      <span class="avatar-picker__label">
        {{ item.label }}<span v-if="modelValue === item.key"> (Dipilih)</span>
      </span>
    </button>
  </div>
</template>

<style scoped>
.avatar-picker {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}

.avatar-picker__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 92px;
  padding: var(--space-3);
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-subtle);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  transition: background-color var(--motion-fast), border-color var(--motion-fast);
}

.avatar-picker__item:hover {
  background-color: var(--bg-surface-hover);
}

.avatar-picker__item--selected {
  background-color: var(--action-primary-tint);
  border: 2px solid var(--action-primary);
}

.avatar-picker__circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-pill);
  font-size: var(--text-ui);
  font-weight: 600;
}

.avatar-picker__label {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--text-secondary);
}

.avatar-picker__item--selected .avatar-picker__label {
  color: var(--action-primary-hover);
  font-weight: 600;
}

@media (min-width: 640px) {
  .avatar-picker {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
