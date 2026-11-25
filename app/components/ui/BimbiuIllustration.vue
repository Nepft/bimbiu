<script setup lang="ts">
export type IllustrationName =
  | 'mascot'
  | 'trophy'
  | 'telescope'
  | 'solar-banner'
  | 'banner-geography'
  | 'banner-history'
  | 'banner-logic'
  | 'banner-language'
  | 'banner-everyday'
  | 'padlock'
  | 'compass-lost'
  | 'key-session'
  | 'dialog-bookmark'
  | 'dialog-door'
  | 'level-crest'
  | 'step-01'
  | 'step-02'
  | 'step-03'
  | 'step-04'
  | 'cat-science'
  | 'cat-geography'
  | 'cat-history'
  | 'cat-logic'
  | 'cat-language'
  | 'cat-everyday'
  | 'avatar-r1'
  | 'avatar-r2'
  | 'avatar-r3'
  | 'avatar-r4'
  | 'icon-badge'
  | 'icon-lesson'
  | 'icon-level'
  | 'icon-xp'
  | 'badge-star-teal'
  | 'badge-crown-gold'
  | 'badge-crown-coral'
  | 'badge-circle-sky'
  | 'badge-star-coral'
  | 'badge-gem-gold'
  | 'badge-circle-coral'
  | 'badge-tri-teal'
  | 'badge-circle-teal'
  | 'badge-rect-amber'
  | 'badge-circle-blue'
  | 'badge-rect-teal'
  | 'badge-circle-gold'
  | 'badge-star-gold'
  | 'badge-rect-coral'
  | 'badge-tri-blue'
  | 'badge-rect-gold'

interface Props {
  name: IllustrationName
  size?: number
}

const props = defineProps<Props>()

const dims = computed(() => {
  if (props.name === 'telescope') return { w: 156, h: 88 }
  if (props.name === 'solar-banner' || props.name.startsWith('banner-')) return { w: 160, h: 84 }
  const s = props.size ?? 44
  return { w: s, h: s }
})
</script>

<template>
  <!-- Mascot Owl (64x64 viewBox) -->
  <svg
    v-if="name === 'mascot'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 64 64"
    fill="none"
    aria-hidden="true"
  >
    <rect width="64" height="64" rx="14" fill="#172330" />
    <circle cx="11.5" cy="11.5" r="1.5" fill="#FFFFFF" />
    <circle cx="53" cy="16" r="2" fill="#F2B632" />
    <ellipse cx="32" cy="36" rx="16" ry="18" fill="#0F6A5B" />
    <ellipse cx="32" cy="42" rx="10" ry="10" fill="#FAF7F0" />
    <rect x="20" y="12" width="24" height="9" rx="4.5" fill="#F2B632" />
    <rect x="16" y="18" width="32" height="4" rx="2" fill="#8C5E00" />
    <circle cx="25.5" cy="28.5" r="5.5" fill="#FFFFFF" />
    <circle cx="38.5" cy="28.5" r="5.5" fill="#FFFFFF" />
    <circle cx="26.2" cy="28.7" r="2.2" fill="#172330" />
    <circle cx="37.7" cy="28.7" r="2.2" fill="#172330" />
    <polygon points="29,31 35,31 32,36" fill="#F2B632" />
  </svg>

  <!-- Golden Trophy (72x72 duotone-monoline emblem) -->
  <svg
    v-else-if="name === 'trophy'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 72 72"
    fill="none"
    aria-hidden="true"
  >
    <rect x="0.75" y="0.75" width="70.5" height="70.5" rx="19.25" fill="#FEF6E4" stroke="#F3D89B" stroke-width="1.5" />
    <path d="M27.67 22.67H44.33V33.5C44.33 38.1 40.6 41.83 36 41.83C31.4 41.83 27.67 38.1 27.67 33.5V22.67Z" fill="#F2B632" fill-opacity="0.3" stroke="#824D00" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M27.67 26H23.5C22.12 26 21 27.12 21 28.5V30.17C21 33.38 23.62 36 26.83 36H27.67" stroke="#824D00" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M44.33 26H48.5C49.88 26 51 27.12 51 28.5V30.17C51 33.38 48.38 36 45.17 36H44.33" stroke="#824D00" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M36 41.83V48.5" stroke="#824D00" stroke-width="2.4" stroke-linecap="round" />
    <path d="M30.17 49.33H41.83" stroke="#824D00" stroke-width="2.4" stroke-linecap="round" />
    <path d="M36 28.5L37 30.58L39.33 30.92L37.67 32.58L38.08 34.83L36 33.75L33.92 34.83L34.33 32.58L32.67 30.92L35 30.58L36 28.5Z" fill="#824D00" />
  </svg>

  <!-- Explorer Telescope (156x88) -->
  <svg
    v-else-if="name === 'telescope'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 156 88"
    fill="none"
    aria-hidden="true"
  >
    <rect width="156" height="88" rx="14" fill="#172330" />
    <circle cx="22" cy="18" r="2" fill="#FFFFFF" />
    <circle cx="130" cy="22" r="2.5" fill="#F2B632" />
    <circle cx="43" cy="67" r="1.5" fill="#FFFFFF" />
    <circle cx="134" cy="66" r="2" fill="#0F6A5B" />
    <circle cx="110" cy="32" r="14" fill="#F2B632" />
    <ellipse cx="110" cy="33" rx="22" ry="5" transform="rotate(-16 110 33)" stroke="#FAF7F0" stroke-width="2" />
    <g transform="rotate(22 56 45)">
      <rect x="34" y="38" width="44" height="14" rx="4" fill="#0F6A5B" />
      <rect x="72" y="36" width="8" height="18" rx="2" fill="#F2B632" />
    </g>
    <rect x="46" y="50" width="4" height="24" rx="2" transform="rotate(-18 48 50)" fill="#FAF7F0" />
    <rect x="56" y="50" width="4" height="24" rx="2" transform="rotate(18 58 50)" fill="#FAF7F0" />
  </svg>

  <!-- Solar System Banner (160x84) -->
  <svg
    v-else-if="name === 'solar-banner'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 160 84"
    fill="none"
    aria-hidden="true"
  >
    <rect width="160" height="84" rx="14" fill="#172330" />
    <circle cx="20" cy="16" r="2" fill="#FFFFFF" />
    <circle cx="138" cy="20" r="2.5" fill="#F2B632" />
    <circle cx="31" cy="65" r="1.5" fill="#0F6A5B" />
    <circle cx="130" cy="64" r="2" fill="#FFFFFF" />
    <circle cx="45" cy="39" r="17" fill="#F2B632" />
    <circle cx="102" cy="40" r="20" fill="#0F6A5B" />
    <rect x="84" y="38" width="36" height="4" rx="2" fill="#FAF7F0" />
    <ellipse cx="102" cy="40" rx="32" ry="8" transform="rotate(-16 102 40)" stroke="#F2B632" stroke-width="2.5" />
  </svg>

  <!-- World & Geography Banner (160x84) -->
  <svg
    v-else-if="name === 'banner-geography'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 160 84"
    fill="none"
    aria-hidden="true"
  >
    <rect width="160" height="84" rx="14" fill="#172330" />
    <circle cx="22" cy="18" r="2" fill="#FFFFFF" />
    <circle cx="138" cy="64" r="2" fill="#F2B632" />
    <circle cx="80" cy="42" r="28" fill="#1E4D8C" />
    <circle cx="73" cy="33" r="11" fill="#0F6A5B" />
    <circle cx="92" cy="48" r="10" fill="#219E8A" />
    <ellipse cx="80" cy="42" rx="28" ry="9" stroke="#FAF7F0" stroke-opacity="0.35" stroke-width="2" />
    <circle cx="121" cy="23" r="7" fill="#F2B632" />
  </svg>

  <!-- History & Culture Banner (160x84) -->
  <svg
    v-else-if="name === 'banner-history'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 160 84"
    fill="none"
    aria-hidden="true"
  >
    <rect width="160" height="84" rx="14" fill="#172330" />
    <circle cx="34" cy="26" r="10" fill="#F2B632" />
    <circle cx="136" cy="20" r="2" fill="#FAF7F0" />
    <rect x="36" y="62" width="88" height="12" rx="3" fill="#8C5E00" />
    <rect x="48" y="48" width="64" height="14" rx="3" fill="#F2EBDB" />
    <rect x="60" y="34" width="40" height="14" rx="3" fill="#FAF7F0" />
    <polygon points="80,12 100,34 60,34" fill="#F2B632" />
    <rect x="73" y="52" width="14" height="22" rx="7" fill="#172330" />
  </svg>

  <!-- Logic & Mathematics Banner (160x84) -->
  <svg
    v-else-if="name === 'banner-logic'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 160 84"
    fill="none"
    aria-hidden="true"
  >
    <rect width="160" height="84" rx="14" fill="#172330" />
    <circle cx="18" cy="16" r="2" fill="#FAF7F0" />
    <rect x="24" y="24" width="34" height="34" rx="7" fill="#1E4D8C" />
    <polygon points="82,20 102,58 62,58" fill="#219E8A" />
    <circle cx="125" cy="41" r="17" fill="#F2B632" />
    <circle cx="125" cy="41" r="7" fill="#172330" />
  </svg>

  <!-- Language & Words Banner (160x84) -->
  <svg
    v-else-if="name === 'banner-language'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 160 84"
    fill="none"
    aria-hidden="true"
  >
    <rect width="160" height="84" rx="14" fill="#172330" />
    <rect x="32" y="18" width="96" height="52" rx="8" fill="#0F6A5B" />
    <rect x="38" y="14" width="40" height="50" rx="5" fill="#FAF7F0" />
    <rect x="82" y="14" width="40" height="50" rx="5" fill="#F2EBDB" />
    <rect x="77" y="14" width="6" height="52" rx="2" fill="#8C5E00" fill-opacity="0.5" />
    <path d="M104 14H114V36L109 31L104 36V14Z" fill="#C94A4A" />
    <rect x="44" y="26" width="26" height="4" rx="2" fill="#25374B" fill-opacity="0.6" />
    <rect x="44" y="36" width="22" height="4" rx="2" fill="#25374B" fill-opacity="0.35" />
    <rect x="44" y="46" width="24" height="10" rx="4" fill="#F2B632" />
  </svg>

  <!-- Everyday Knowledge Banner (160x84) -->
  <svg
    v-else-if="name === 'banner-everyday'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 160 84"
    fill="none"
    aria-hidden="true"
  >
    <rect width="160" height="84" rx="14" fill="#172330" />
    <circle cx="58" cy="36" r="22" fill="#F2B632" fill-opacity="0.22" />
    <circle cx="58" cy="36" r="14" fill="#F2B632" />
    <rect x="52" y="48" width="12" height="12" rx="3" fill="#F2EBDB" />
    <rect x="54" y="62" width="8" height="5" rx="2" fill="#25374B" />
    <circle cx="113" cy="41" r="21" fill="#0F6A5B" />
    <circle cx="113" cy="41" r="13" fill="#219E8A" />
    <text x="105" y="45" fill="#FAF7F0" font-size="11" font-weight="700" font-family="Plus Jakarta Sans, sans-serif">3R</text>
  </svg>

  <!-- Padlock (64x64) -->
  <svg
    v-else-if="name === 'padlock'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 64 64"
    fill="none"
    aria-hidden="true"
  >
    <rect width="64" height="64" rx="12" fill="#172330" />
    <circle cx="32" cy="24" r="10" stroke="#FAF7F0" stroke-width="4" />
    <rect x="16" y="26" width="32" height="24" rx="6" fill="#F2B632" />
    <circle cx="32" cy="38" r="3" fill="#172330" />
  </svg>

  <!-- Lost Compass 404 (64x64) -->
  <svg
    v-else-if="name === 'compass-lost'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 64 64"
    fill="none"
    aria-hidden="true"
  >
    <rect width="64" height="64" rx="12" fill="#172330" />
    <circle cx="13" cy="13" r="1.5" fill="#FFFFFF" />
    <circle cx="51" cy="49" r="1.5" fill="#F2B632" />
    <circle cx="32" cy="32" r="16" fill="#0F6A5B" stroke="#FAF7F0" stroke-width="2" />
    <polygon points="32,20 38,44 26,44" fill="#F2B632" />
  </svg>

  <!-- Key Session (64x64) -->
  <svg
    v-else-if="name === 'key-session'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 64 64"
    fill="none"
    aria-hidden="true"
  >
    <rect width="64" height="64" rx="12" fill="#172330" />
    <circle cx="24" cy="32" r="8" stroke="#F2B632" stroke-width="4" />
    <rect x="32" y="30" width="20" height="4" rx="2" fill="#F2B632" />
    <rect x="44" y="34" width="4" height="7" rx="1" fill="#F2B632" />
  </svg>

  <!-- Dialog Bookmark (48x48) -->
  <svg
    v-else-if="name === 'dialog-bookmark'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 48 48"
    fill="none"
    aria-hidden="true"
  >
    <rect width="48" height="48" rx="12" fill="#172330" />
    <rect x="12" y="11" width="24" height="26" rx="4" fill="#0F6A5B" />
    <rect x="24" y="11" width="7" height="16" rx="1" fill="#F2B632" />
  </svg>

  <!-- Dialog Door (48x48) -->
  <svg
    v-else-if="name === 'dialog-door'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 48 48"
    fill="none"
    aria-hidden="true"
  >
    <rect width="48" height="48" rx="12" fill="#172330" />
    <rect x="14" y="10" width="20" height="28" rx="4" fill="#FAF7F0" />
    <circle cx="29" cy="24" r="2" fill="#F2B632" />
  </svg>

  <!-- Level Crest (40x40 duotone-monoline squircle) -->
  <svg
    v-else-if="name === 'level-crest'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
  >
    <rect x="0.5" y="0.5" width="39" height="39" rx="10.5" fill="#EEF4FF" stroke="#C9DBFC" />
    <path d="M20 10L27.5 13.2V19C27.5 23.85 24.3 27.95 20 29.3C15.7 27.95 12.5 23.85 12.5 19V13.2L20 10Z" fill="#2563EB" fill-opacity="0.14" stroke="#1E40AF" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M17.2 19.8L20 17L22.8 19.8" stroke="#1E40AF" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M17.2 23L20 20.2L22.8 23" stroke="#F2B632" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <!-- Step Icons (40x40 duotone-monoline squircles) -->
  <svg
    v-else-if="name === 'step-01'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
  >
    <rect x="0.5" y="0.5" width="39" height="39" rx="10.5" fill="#ECFDF5" stroke="#BDE7D5" />
    <circle cx="20" cy="20" r="8.25" fill="#0F6A5B" fill-opacity="0.14" stroke="#0F6A5B" stroke-width="1.8" />
    <path d="M22.9 17.1L21.25 21.25L17.1 22.9L18.75 18.75L22.9 17.1Z" fill="#F2B632" stroke="#0F6A5B" stroke-width="1.4" stroke-linejoin="round" />
  </svg>
  <svg
    v-else-if="name === 'step-02'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
  >
    <rect x="0.5" y="0.5" width="39" height="39" rx="10.5" fill="#EEF4FF" stroke="#C9DBFC" />
    <rect x="12.5" y="11.5" width="15" height="17" rx="3" fill="#2563EB" fill-opacity="0.12" stroke="#1E40AF" stroke-width="1.8" />
    <path d="M16.5 17H23.5M16.5 21H20.5" stroke="#1E40AF" stroke-width="1.8" stroke-linecap="round" />
    <path d="M22.5 23L23.7 24.2L26 21.8" stroke="#F2B632" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
  <svg
    v-else-if="name === 'step-03'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
  >
    <rect x="0.5" y="0.5" width="39" height="39" rx="10.5" fill="#FEF6E4" stroke="#F3D89B" />
    <path d="M17.2 25.5H22.8M18.1 28H21.9M20 11.8C17.02 11.8 14.6 14.22 14.6 17.2C14.6 19.2 15.69 20.94 17.3 21.87V23.1C17.3 23.6 17.7 24 18.2 24H21.8C22.3 24 22.7 23.6 22.7 23.1V21.87C24.31 20.94 25.4 19.2 25.4 17.2C25.4 14.22 22.98 11.8 20 11.8Z" fill="#F2B632" fill-opacity="0.25" stroke="#9A5B00" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
  <svg
    v-else-if="name === 'step-04'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
  >
    <rect x="0.5" y="0.5" width="39" height="39" rx="10.5" fill="#FEF6E4" stroke="#F3D89B" />
    <path d="M20 11.8L22.35 16.55L27.6 17.32L23.8 21.02L24.7 26.25L20 23.78L15.3 26.25L16.2 21.02L12.4 17.32L17.65 16.55L20 11.8Z" fill="#F2B632" fill-opacity="0.32" stroke="#9A5B00" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <!-- 6 Category Icons (44x44) -->
  <svg
    v-else-if="name === 'cat-science'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 44 44"
    fill="none"
    aria-hidden="true"
  >
    <rect width="44" height="44" rx="10" fill="#172330" />
    <circle cx="9" cy="9" r="1" fill="#FFFFFF" />
    <circle cx="35" cy="11" r="1.3" fill="#F2B632" />
    <circle cx="33" cy="34" r="1" fill="#FFFFFF" />
    <circle cx="22" cy="22" r="9" fill="#F2B632" />
    <rect x="14" y="19" width="16" height="2" rx="1" fill="#8C5E00" />
    <rect x="13.5" y="23" width="17" height="2" rx="1" fill="#8C5E00" />
    <ellipse cx="22" cy="22" rx="16" ry="5" transform="rotate(-18 22 22)" stroke="#FAF7F0" stroke-width="2" />
  </svg>
  <svg
    v-else-if="name === 'cat-geography'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 44 44"
    fill="none"
    aria-hidden="true"
  >
    <rect width="44" height="44" rx="10" fill="#1E4D8C" />
    <circle cx="9" cy="10" r="1" fill="#F2B632" />
    <circle cx="35" cy="33" r="1" fill="#FAF7F0" />
    <circle cx="22" cy="22" r="12" fill="#E6F3EF" stroke="#FAF7F0" stroke-width="1.5" />
    <ellipse cx="18" cy="16.5" rx="4" ry="3.5" fill="#0F6A5B" />
    <circle cx="27" cy="25" r="4" fill="#0F6A5B" />
  </svg>
  <svg
    v-else-if="name === 'cat-history'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 44 44"
    fill="none"
    aria-hidden="true"
  >
    <rect width="44" height="44" rx="10" fill="#FEF8E8" />
    <rect x="10" y="31" width="24" height="3" rx="1" fill="#8C5E00" />
    <rect x="13" y="18" width="4" height="13" rx="1" fill="#F2B632" />
    <rect x="20" y="18" width="4" height="13" rx="1" fill="#F2B632" />
    <rect x="27" y="18" width="4" height="13" rx="1" fill="#F2B632" />
    <polygon points="22,9 34,19 10,19" fill="#8C5E00" />
  </svg>
  <svg
    v-else-if="name === 'cat-logic'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 44 44"
    fill="none"
    aria-hidden="true"
  >
    <rect width="44" height="44" rx="10" fill="#E6F3EF" />
    <rect x="10" y="10" width="14" height="14" rx="3" fill="#0F6A5B" />
    <circle cx="27.5" cy="25.5" r="6.5" fill="#F2B632" />
    <polygon points="17,22 23,34 11,34" fill="#1E4D8C" />
  </svg>
  <svg
    v-else-if="name === 'cat-language'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 44 44"
    fill="none"
    aria-hidden="true"
  >
    <rect width="44" height="44" rx="10" fill="#EAF0FA" />
    <rect x="9" y="13" width="12" height="18" rx="2" fill="#FFFFFF" />
    <rect x="23" y="13" width="12" height="18" rx="2" fill="#FFFFFF" />
    <rect x="21" y="13" width="2" height="18" fill="#1E4D8C" />
    <rect x="12" y="18" width="6" height="2" rx="1" fill="#1E4D8C" />
    <rect x="12" y="22" width="6" height="2" rx="1" fill="#0F6A5B" />
    <rect x="26" y="18" width="6" height="2" rx="1" fill="#F2B632" />
    <rect x="26" y="22" width="6" height="2" rx="1" fill="#1E4D8C" />
  </svg>
  <svg
    v-else-if="name === 'cat-everyday'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 44 44"
    fill="none"
    aria-hidden="true"
  >
    <rect width="44" height="44" rx="10" fill="#FEF8E8" />
    <circle cx="22" cy="18" r="9" fill="#F2B632" />
    <circle cx="22" cy="17" r="3" fill="#FAF7F0" />
    <rect x="17" y="26" width="10" height="5" rx="1" fill="#172330" />
    <rect x="18" y="32" width="8" height="3" rx="1.5" fill="#8C5E00" />
  </svg>

  <!-- 4 Avatar Emblems (44x44 circle) -->
  <svg
    v-else-if="name === 'avatar-r1'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 44 44"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="22" cy="22" r="22" fill="#0F6A5B" />
    <circle cx="22" cy="22" r="15" fill="#E6F3EF" />
    <polygon points="22,10 28,23 16,23" fill="#D9534F" />
    <polygon points="22,34 16,21 28,21" fill="#1E4D8C" />
    <circle cx="22" cy="22" r="2.5" fill="#172330" />
  </svg>
  <svg
    v-else-if="name === 'avatar-r2'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 44 44"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="22" cy="22" r="22" fill="#1E4D8C" />
    <circle cx="10" cy="12" r="1" fill="#FFFFFF" />
    <circle cx="35" cy="14" r="1" fill="#F2B632" />
    <polygon points="22,8 29,22 15,22" fill="#FAF7F0" />
    <rect x="17" y="20" width="10" height="12" rx="2" fill="#FAF7F0" />
    <circle cx="22" cy="22.5" r="2.5" fill="#F2B632" />
    <polygon points="22,39 18,32 26,32" fill="#F2B632" />
  </svg>
  <svg
    v-else-if="name === 'avatar-r3'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 44 44"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="22" cy="22" r="22" fill="#F2B632" />
    <circle cx="22" cy="22" r="12" fill="#FAF7F0" />
    <circle cx="22" cy="22" r="8" fill="#8C5E00" />
    <circle cx="22" cy="22" r="5" fill="#F2B632" />
  </svg>
  <!-- 4 Gamification Icons (duotone-monoline squircles) -->
  <svg
    v-else-if="name === 'icon-badge'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden="true"
  >
    <rect x="0.5" y="0.5" width="27" height="27" rx="8.5" fill="#FEF6E4" stroke="#F3D89B" />
    <circle cx="14" cy="11.5" r="4.8" fill="#F2B632" fill-opacity="0.28" stroke="#9A5B00" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M11.6 15.6L10.4 20.8L14 19L17.6 20.8L16.4 15.6" stroke="#0F6A5B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M14 9.6L14.6 10.8L15.9 11L14.95 11.9L15.2 13.2L14 12.6L12.8 13.2L13.05 11.9L12.1 11L13.4 10.8L14 9.6Z" fill="#9A5B00" />
  </svg>
  <svg
    v-else-if="name === 'icon-lesson'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden="true"
  >
    <rect x="0.5" y="0.5" width="27" height="27" rx="8.5" fill="#ECFDF5" stroke="#BDE7D5" />
    <path d="M6.5 9.1C6.5 8.45 7.05 7.9 7.7 7.9H11.4C12.85 7.9 14 9.05 14 10.5V20C14 18.95 13.15 18.1 12.1 18.1H7.7C7.05 18.1 6.5 17.55 6.5 16.9V9.1Z" fill="#0F6A5B" fill-opacity="0.14" stroke="#0F6A5B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M21.5 9.1C21.5 8.45 20.95 7.9 20.3 7.9H16.6C15.15 7.9 14 9.05 14 10.5V20C14 18.95 14.85 18.1 15.9 18.1H20.3C20.95 18.1 21.5 17.55 21.5 16.9V9.1Z" fill="#0F6A5B" fill-opacity="0.14" stroke="#0F6A5B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M17 7.9V12.8L18.3 11.8L19.6 12.8V7.9" stroke="#F2B632" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
  <svg
    v-else-if="name === 'icon-level'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden="true"
  >
    <rect x="0.5" y="0.5" width="27" height="27" rx="8.5" fill="#EEF4FF" stroke="#C9DBFC" />
    <path d="M14 7L19.3 9.25V13.4C19.3 16.85 17.05 19.75 14 20.7C10.95 19.75 8.7 16.85 8.7 13.4V9.25L14 7Z" fill="#2563EB" fill-opacity="0.14" stroke="#1E40AF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12.1 13.9L14 12L15.9 13.9" stroke="#1E40AF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12.1 16.2L14 14.3L15.9 16.2" stroke="#F2B632" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
  <svg
    v-else-if="name === 'icon-xp'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden="true"
  >
    <rect x="0.5" y="0.5" width="27" height="27" rx="8.5" fill="#FEF6E4" stroke="#F3D89B" />
    <path d="M14.75 6.8L8.4 15H13.6L12.85 21.2L19.6 13H14.4L14.75 6.8Z" fill="#F2B632" fill-opacity="0.35" stroke="#9A5B00" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
  <svg
    v-else-if="name.startsWith('badge-')"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 44 44"
    fill="none"
    aria-hidden="true"
  >
    <rect width="44" height="44" rx="12" fill="#172330" />
    <circle
      cx="22"
      cy="22"
      r="15"
      :fill="
        name.endsWith('-gold') ? '#F2B632'
        : name.endsWith('-coral') ? '#C94A4A'
        : name.endsWith('-sky') ? '#3A94D6'
        : name.endsWith('-amber') ? '#8C5E00'
        : name.endsWith('-blue') ? '#1E4D8C'
        : '#219E8A'
      "
      fill-opacity="0.22"
    />
    <polygon
      v-if="name.startsWith('badge-star-')"
      points="22,10 25,18.5 34,22 25,25.5 22,34 19,25.5 10,22 19,18.5"
      :fill="name.endsWith('-gold') ? '#F2B632' : name.endsWith('-coral') ? '#C94A4A' : '#219E8A'"
    />
    <polygon
      v-else-if="name.startsWith('badge-crown-')"
      points="22,10 25,18 33,18.5 27,23.5 29,31.5 22,27 15,31.5 17,23.5 11,18.5 19,18"
      :fill="name.endsWith('-coral') ? '#C94A4A' : '#F2B632'"
    />
    <polygon
      v-else-if="name.startsWith('badge-gem-')"
      points="22,11 31,16.5 31,27.5 22,33 13,27.5 13,16.5"
      fill="#F2B632"
    />
    <polygon
      v-else-if="name.startsWith('badge-tri-')"
      points="22,12 32,30 12,30"
      :fill="name.endsWith('-blue') ? '#1E4D8C' : '#219E8A'"
    />
    <template v-else-if="name.startsWith('badge-rect-')">
      <rect
        x="13"
        y="12"
        width="18"
        height="20"
        rx="4"
        :fill="
          name.endsWith('-gold') ? '#F2B632'
          : name.endsWith('-coral') ? '#C94A4A'
          : name.endsWith('-amber') ? '#8C5E00'
          : '#0F6A5B'
        "
      />
      <rect x="19" y="16" width="6" height="12" rx="2" fill="#FAF7F0" />
    </template>
    <template v-else>
      <circle
        cx="22"
        cy="22"
        r="10"
        :fill="
          name.endsWith('-coral') ? '#C94A4A'
          : name.endsWith('-sky') ? '#3A94D6'
          : name.endsWith('-blue') ? '#1E4D8C'
          : name.endsWith('-gold') ? '#F2B632'
          : '#219E8A'
        "
      />
      <rect x="18" y="18" width="8" height="8" rx="2" fill="#FAF7F0" />
    </template>
  </svg>
  <svg
    v-else
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 44 44"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="22" cy="22" r="22" fill="#172330" />
    <circle cx="10" cy="13" r="1" fill="#FAF7F0" />
    <circle cx="35" cy="31" r="1" fill="#E6F3EF" />
    <polygon points="22,10 25.2,17.5 33.4,18.2 27.2,23.5 29.1,31.5 22,27.2 14.9,31.5 16.8,23.5 10.6,18.2 18.8,17.5" fill="#F2B632" />
  </svg>
</template>
