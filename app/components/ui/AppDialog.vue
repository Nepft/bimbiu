<script setup lang="ts">
interface Props {
  open: boolean
  title: string
  titleId?: string
}

const props = withDefaults(defineProps<Props>(), {
  titleId: 'app-dialog-title',
})

const emit = defineEmits<{
  close: []
}>()

const dialogEl = ref<HTMLElement | null>(null)
let previousActiveElement: HTMLElement | null = null

watch(
  () => props.open,
  async (isOpen) => {
    if (!import.meta.client) return
    if (isOpen) {
      previousActiveElement = document.activeElement as HTMLElement | null
      await nextTick()
      dialogEl.value?.focus()
    } else if (previousActiveElement) {
      previousActiveElement.focus()
      previousActiveElement = null
    }
  },
)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="app-dialog-backdrop" @click.self="emit('close')">
      <div
        ref="dialogEl"
        class="app-dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
      >
        <div class="app-dialog__header">
          <h2 :id="titleId" class="app-dialog__title">
            {{ title }}
          </h2>
          <button
            type="button"
            class="app-dialog__close"
            aria-label="Tutup dialog"
            @click="emit('close')"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <div class="app-dialog__body">
          <slot />
        </div>
        <div v-if="$slots.actions" class="app-dialog__actions">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.app-dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background-color: rgba(23, 35, 48, 0.45);
}

.app-dialog {
  width: 100%;
  max-width: 440px;
  padding: var(--space-6);
  background-color: var(--bg-surface);
  border: 2px solid var(--border-strong);
  border-radius: var(--radius-xl);
  box-shadow: 0 12px 32px rgba(23, 35, 48, 0.18);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.app-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.app-dialog__title {
  font-size: var(--text-h2);
  line-height: 1.3;
}

.app-dialog__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--touch-target-min);
  min-height: var(--touch-target-min);
  background: transparent;
  border: 1.5px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary);
}

.app-dialog__body {
  color: var(--text-secondary);
  font-size: var(--text-body);
}

.app-dialog__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}
</style>
