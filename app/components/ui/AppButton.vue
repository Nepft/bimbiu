<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger-soft'
  size?: 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  to?: string
  block?: boolean
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  to: undefined,
  block: false,
  disabled: false,
  loading: false,
})

const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <NuxtLink
    v-if="to && !isDisabled"
    :to="to"
    class="app-btn"
    :class="[`app-btn--${variant}`, `app-btn--${size}`, { 'app-btn--block': block }]"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    :type="type"
    :disabled="isDisabled"
    :aria-busy="loading ? 'true' : undefined"
    class="app-btn"
    :class="[`app-btn--${variant}`, `app-btn--${size}`, { 'app-btn--block': block }]"
  >
    <span v-if="loading" class="app-btn__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped>
.app-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 0 var(--space-5);
  font-family: var(--font-sans);
  font-size: var(--text-ui);
  font-weight: 600;
  line-height: 1.4;
  text-decoration: none;
  border: 2px solid transparent;
  transition:
    background-color var(--motion-fast),
    transform var(--motion-fast),
    box-shadow var(--motion-fast);
  white-space: nowrap;
}

.app-btn--md {
  min-height: var(--touch-target-min);
}

.app-btn--lg {
  min-height: 48px;
}

.app-btn--block {
  width: 100%;
}

.app-btn--primary {
  background-color: var(--action-primary);
  color: var(--text-on-brand);
  border-color: var(--action-primary-active);
  border-radius: var(--radius-lg);
  box-shadow: 0 3px 0 var(--action-primary-active);
}

.app-btn--primary:hover:not(:disabled) {
  background-color: var(--action-primary-hover);
}

.app-btn--secondary {
  background-color: var(--bg-surface);
  color: var(--text-primary);
  border-color: var(--border-control);
  border-radius: var(--radius-md);
  box-shadow: 0 3px 0 var(--border-control);
}

.app-btn--secondary:hover:not(:disabled) {
  background-color: var(--bg-surface-hover);
}

.app-btn--accent {
  background-color: var(--action-accent);
  color: var(--text-on-accent);
  border-color: var(--action-accent-border);
  border-radius: var(--radius-lg);
  box-shadow: 0 3px 0 var(--action-accent-border);
}

.app-btn--accent:hover:not(:disabled) {
  background-color: var(--action-accent-hover);
}

.app-btn--danger-soft {
  background-color: var(--feedback-review-bg);
  color: var(--feedback-review-fg);
  border-color: var(--feedback-review-fg);
  border-radius: var(--radius-md);
  box-shadow: 0 3px 0 var(--feedback-review-fg);
}

.app-btn--danger-soft:hover:not(:disabled) {
  background-color: #f9ded9;
}

.app-btn:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: 0 1px 0 currentColor;
}

.app-btn:disabled {
  background-color: var(--bg-disabled);
  color: var(--text-secondary);
  border-color: var(--border-subtle);
  box-shadow: none;
}

.app-btn__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: var(--radius-pill);
  animation: app-spin 0.7s linear infinite;
}

@keyframes app-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
