<script setup lang="ts">
interface Props {
  id: string
  label: string
  modelValue?: string
  type?: 'text' | 'search' | 'email' | 'password'
  placeholder?: string
  helperText?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  helperText: undefined,
  error: undefined,
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const describedBy = computed(() => {
  const ids: string[] = []
  if (props.error) ids.push(`${props.id}-error`)
  if (props.helperText) ids.push(`${props.id}-helper`)
  return ids.length ? ids.join(' ') : undefined
})

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="app-field">
    <label :for="id" class="app-field__label">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      class="app-field__input"
      :class="{ 'app-field__input--error': Boolean(error) }"
      @input="onInput"
    >
    <p v-if="error" :id="`${id}-error`" class="app-field__error" role="alert">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
        <path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      <span>{{ error }}</span>
    </p>
    <p v-if="helperText" :id="`${id}-helper`" class="app-field__helper">
      {{ helperText }}
    </p>
  </div>
</template>

<style scoped>
.app-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.app-field__label {
  font-size: var(--text-ui);
  font-weight: 600;
  color: var(--text-primary);
}

.app-field__input {
  width: 100%;
  min-height: 48px;
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--text-body);
  color: var(--text-primary);
  background-color: var(--bg-surface);
  border: 2px solid var(--border-control);
  border-radius: var(--radius-md);
}

.app-field__input--error {
  border-color: var(--feedback-review-fg);
  background-color: var(--feedback-review-bg);
}

.app-field__input:disabled {
  background-color: var(--bg-disabled);
  color: var(--text-secondary);
}

.app-field__error {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-caption);
  font-weight: 600;
  color: var(--feedback-review-fg);
}

.app-field__helper {
  font-size: var(--text-caption);
  color: var(--text-secondary);
}
</style>
