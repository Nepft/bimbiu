<script setup lang="ts">
export type AppIconName =
  | 'home'
  | 'book'
  | 'chart'
  | 'award'
  | 'play'
  | 'refresh'
  | 'check-circle'
  | 'alert-circle'
  | 'lightbulb'
  | 'lock'
  | 'clock'
  | 'sparkle'
  | 'shield'
  | 'arrow-left'
  | 'arrow-right'
  | 'log-out'
  | 'upload'

interface Props {
  name: AppIconName
  size?: number
}

withDefaults(defineProps<Props>(), {
  size: 20,
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'home'">
      <path d="M3 9.5L10 3.5L17 9.5V17H3Z" />
      <path d="M8 17V12H12V17" />
    </template>
    <template v-else-if="name === 'book'">
      <path d="M4 15.5V4.5H16V15.5H4Z" />
      <path d="M10 4.5V15.5" />
    </template>
    <template v-else-if="name === 'chart'">
      <path d="M4 17V12M8 17V7M12 17V10M16 17V4" />
    </template>
    <template v-else-if="name === 'award'">
      <circle cx="10" cy="7" r="4.5" />
      <path d="M7.5 11L6.5 17.5L10 15.5L13.5 17.5L12.5 11" />
    </template>
    <template v-else-if="name === 'play'">
      <path d="M6 4.5L15.5 10L6 15.5Z" />
    </template>
    <template v-else-if="name === 'refresh'">
      <path d="M15.6 8A6 6 0 1 0 14.5 14" />
      <path d="M4 5V9.5H8.5" />
    </template>
    <template v-else-if="name === 'check-circle'">
      <circle cx="10" cy="10" r="7.5" />
      <path d="M6.8 10.2L9.1 12.5L13.5 7.8" />
    </template>
    <template v-else-if="name === 'alert-circle'">
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 6.5V10.5M10 13.5V13.8" />
    </template>
    <template v-else-if="name === 'lightbulb'">
      <circle cx="10" cy="7.5" r="5" fill="#F2B632" stroke="#8C5E00" stroke-width="1.6" />
      <path d="M8 12.5H12M8.2 15.2H11.8M9 17.5H11" stroke="#172330" />
    </template>
    <template v-else-if="name === 'lock'">
      <rect x="5" y="9" width="10" height="7.5" rx="1.5" />
      <path d="M7 9V6.5C7 4.5 13 4.5 13 6.5V9" />
    </template>
    <template v-else-if="name === 'clock'">
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 6V10L13 11.8" />
    </template>
    <template v-else-if="name === 'sparkle'">
      <path d="M10 2.5L11.8 8.2L17.5 10L11.8 11.8L10 17.5L8.2 11.8L2.5 10L8.2 8.2Z" />
    </template>
    <template v-else-if="name === 'shield'">
      <path d="M10 2.8L16 5.2V9.8C16 13.6 13.4 16.2 10 17.5C6.6 16.2 4 13.6 4 9.8V5.2Z" />
      <path d="M7.5 10L9.4 11.9L13 8.2" />
    </template>
    <template v-else-if="name === 'arrow-left'">
      <path d="M15.5 10H4.5M9 5.5L4.5 10L9 14.5" />
    </template>
    <template v-else-if="name === 'arrow-right'">
      <path d="M4.5 10H15.5M11 5.5L15.5 10L11 14.5" />
    </template>
    <template v-else-if="name === 'log-out'">
      <path d="M8 4H4.5V16H8M10.5 10H16.5M13.5 7L16.5 10L13.5 13" />
    </template>
    <template v-else-if="name === 'upload'">
      <path d="M10 13V4.5M6.5 8L10 4.5L13.5 8" />
      <path d="M4 13.5V15.5H16V13.5" />
    </template>
  </svg>
</template>
