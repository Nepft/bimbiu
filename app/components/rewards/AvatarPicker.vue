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
  customAvatarData?: string | null
  options?: AvatarOption[]
}

const AVATAR_ILLU_MAP: Record<string, IllustrationName> = {
  R1: 'avatar-r1',
  R2: 'avatar-r2',
  R3: 'avatar-r3',
  R4: 'avatar-r4',
}

const props = withDefaults(defineProps<Props>(), {
  customAvatarData: null,
  options: () => [
    { key: 'R1', label: 'Kompas', bg: 'var(--action-primary)', fg: 'var(--text-on-brand)' },
    { key: 'R2', label: 'Atlas', bg: 'var(--action-atlas)', fg: 'var(--text-on-brand)' },
    { key: 'R3', label: 'Surya', bg: 'var(--action-accent)', fg: 'var(--text-primary)' },
    { key: 'R4', label: 'Bintang', bg: 'var(--bg-surface-subtle)', fg: 'var(--text-primary)' },
  ],
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:customAvatarData': [value: string | null]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const uploadError = ref('')
const uploadedMeta = ref('')

const MAX_FILE_BYTES = 2 * 1024 * 1024
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])

const hasCustomPreview = computed(() => Boolean(props.customAvatarData))

function triggerFilePick() {
  uploadError.value = ''
  fileInputRef.value?.click()
}

function selectPreset(key: string) {
  uploadError.value = ''
  emit('update:modelValue', key)
}

function removeCustomAvatar() {
  uploadError.value = ''
  uploadedMeta.value = ''
  emit('update:customAvatarData', null)
  if (props.modelValue === 'custom') {
    emit('update:modelValue', 'R1')
  }
}

function formatKb(bytes: number): string {
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

async function compressAndCropSquare(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('Gagal membaca gambar.'))
      el.src = objectUrl
    })

    const size = 192
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Browser tidak mendukung pemrosesan gambar.')

    const minSide = Math.min(img.naturalWidth, img.naturalHeight)
    const sx = Math.floor((img.naturalWidth - minSide) / 2)
    const sy = Math.floor((img.naturalHeight - minSide) / 2)
    ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size)

    const webp = canvas.toDataURL('image/webp', 0.84)
    if (webp.startsWith('data:image/webp')) {
      return webp
    }
    return canvas.toDataURL('image/jpeg', 0.85)
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  if (!ALLOWED_MIME.has(file.type) || file.size > MAX_FILE_BYTES) {
    uploadError.value = 'Gunakan JPG, PNG, atau WebP dengan ukuran maksimal 2 MB.'
    return
  }

  try {
    const dataUrl = await compressAndCropSquare(file)
    uploadError.value = ''
    uploadedMeta.value = `${file.name} (${formatKb(file.size)})`
    emit('update:customAvatarData', dataUrl)
    emit('update:modelValue', 'custom')
  } catch {
    uploadError.value = 'Gambar tidak dapat diproses. Coba pilih gambar lain.'
  }
}
</script>

<template>
  <div class="avatar-picker-wrap">
    <div class="avatar-picker" role="radiogroup" aria-label="Pilih avatar bawaan">
      <button
        v-for="item in options"
        :key="item.key"
        type="button"
        role="radio"
        :aria-checked="modelValue === item.key"
        class="avatar-picker__item"
        :class="{ 'avatar-picker__item--selected': modelValue === item.key }"
        @click="selectPreset(item.key)"
      >
        <BimbiuIllustration :name="AVATAR_ILLU_MAP[item.key] ?? 'avatar-r1'" :size="44" />
        <span class="avatar-picker__label">
          {{ item.label }}<span v-if="modelValue === item.key"> (Dipilih)</span>
        </span>
      </button>
    </div>

    <div
      class="avatar-upload"
      :class="{
        'avatar-upload--preview': hasCustomPreview && !uploadError,
        'avatar-upload--selected': modelValue === 'custom' && hasCustomPreview && !uploadError,
        'avatar-upload--error': Boolean(uploadError),
      }"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        class="avatar-upload__input"
        aria-label="Unggah gambar avatar kustom"
        @change="handleFileChange"
      >

      <div class="avatar-upload__lead">
        <button
          v-if="hasCustomPreview"
          type="button"
          class="avatar-upload__thumb-btn"
          aria-label="Gunakan avatar kustom"
          @click="emit('update:modelValue', 'custom')"
        >
          <img
            :src="customAvatarData!"
            alt="Pratinjau avatar kustom"
            class="avatar-upload__thumb-img"
          >
        </button>
        <div v-else class="avatar-upload__icon-circle" aria-hidden="true">
          <AppIcon name="upload" :size="20" />
        </div>

        <div class="avatar-upload__copy">
          <p v-if="uploadError" class="avatar-upload__title avatar-upload__title--error">
            Format atau ukuran gambar tidak sesuai
          </p>
          <p v-else-if="hasCustomPreview" class="avatar-upload__title">
            {{ uploadedMeta || 'Avatar kustom tersimpan' }}
          </p>
          <p v-else class="avatar-upload__title">
            Atau Unggah Gambar Sendiri
          </p>

          <p v-if="uploadError" class="avatar-upload__helper avatar-upload__helper--error">
            {{ uploadError }}
          </p>
          <p v-else-if="hasCustomPreview" class="avatar-upload__helper avatar-upload__helper--success">
            {{ modelValue === 'custom' ? 'Avatar kustom sedang aktif.' : 'Klik gambar atau tombol Pilih untuk memakai foto ini.' }}
          </p>
          <p v-else class="avatar-upload__helper">
            JPG, PNG, atau WebP · Maks. 2 MB · Rasio 1:1
          </p>
        </div>
      </div>

      <div class="avatar-upload__actions">
        <button
          v-if="hasCustomPreview && modelValue !== 'custom'"
          type="button"
          class="avatar-upload__btn avatar-upload__btn--primary"
          @click="emit('update:modelValue', 'custom')"
        >
          Pakai Foto
        </button>
        <button
          type="button"
          class="avatar-upload__btn"
          :class="{ 'avatar-upload__btn--error': Boolean(uploadError) }"
          @click="triggerFilePick"
        >
          {{ hasCustomPreview ? 'Ganti' : 'Pilih Gambar' }}
        </button>
        <button
          v-if="hasCustomPreview"
          type="button"
          class="avatar-upload__btn avatar-upload__btn--danger"
          @click="removeCustomAvatar"
        >
          Hapus
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-picker-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

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
  cursor: pointer;
  transition: background-color var(--motion-fast), border-color var(--motion-fast);
}

.avatar-picker__item:hover {
  background-color: var(--bg-surface-hover);
}

.avatar-picker__item--selected {
  background-color: var(--action-primary-tint);
  border: 2px solid var(--action-primary);
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

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-4);
  background-color: var(--bg-surface-subtle);
  border: 1.5px dashed var(--border-control);
  border-radius: var(--radius-md);
}

.avatar-upload--preview {
  border-style: solid;
  border-color: var(--action-primary);
  background-color: var(--action-primary-tint);
}

.avatar-upload--selected {
  border-width: 2px;
}

.avatar-upload--error {
  border-style: solid;
  border-color: var(--feedback-review-fg);
  background-color: var(--feedback-review-bg);
}

.avatar-upload__input {
  display: none;
}

.avatar-upload__lead {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.avatar-upload__thumb-btn {
  padding: 0;
  border: 2px solid var(--action-primary);
  border-radius: var(--radius-pill);
  background: none;
  cursor: pointer;
  overflow: hidden;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
}

.avatar-upload__thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-upload__icon-circle {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-pill);
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-subtle);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--action-primary);
  flex-shrink: 0;
}

.avatar-upload__copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.avatar-upload__title {
  font-size: var(--text-ui);
  font-weight: 700;
  color: var(--text-primary);
}

.avatar-upload__title--error {
  color: var(--feedback-review-fg);
}

.avatar-upload__helper {
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

.avatar-upload__helper--success {
  color: var(--action-primary-hover);
  font-weight: 600;
}

.avatar-upload__helper--error {
  color: var(--feedback-review-fg);
}

.avatar-upload__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.avatar-upload__btn {
  min-height: 36px;
  padding: 6px 14px;
  background-color: var(--bg-surface);
  border: 1.5px solid var(--action-primary);
  border-radius: var(--radius-sm);
  color: var(--action-primary);
  font-family: var(--font-sans);
  font-size: var(--text-caption);
  font-weight: 700;
  cursor: pointer;
}

.avatar-upload__btn--primary {
  background-color: var(--action-primary);
  color: var(--text-on-brand);
}

.avatar-upload__btn--error {
  border-color: var(--feedback-review-fg);
  color: var(--feedback-review-fg);
}

.avatar-upload__btn--danger {
  background-color: var(--feedback-review-bg);
  border-color: var(--feedback-review-fg);
  color: var(--feedback-review-fg);
}

@media (min-width: 640px) {
  .avatar-picker {
    grid-template-columns: repeat(4, 1fr);
  }

  .avatar-upload {
    flex-direction: row;
    align-items: center;
  }
}
</style>
