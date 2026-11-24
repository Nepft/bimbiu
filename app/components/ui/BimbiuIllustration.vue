<script setup lang="ts">
export type IllustrationName =
  | 'mascot'
  | 'trophy'
  | 'telescope'
  | 'solar-banner'
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
  if (props.name === 'solar-banner') return { w: 160, h: 84 }
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

  <!-- Golden Trophy (72x72 viewBox) -->
  <svg
    v-else-if="name === 'trophy'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 72 72"
    fill="none"
    aria-hidden="true"
  >
    <rect width="72" height="72" rx="14" fill="#172330" />
    <circle cx="13.5" cy="15.5" r="1.5" fill="#FFFFFF" />
    <circle cx="59" cy="18" r="2" fill="#F2B632" />
    <circle cx="16.5" cy="55.5" r="1.5" fill="#F2B632" />
    <path d="M22 21C22 19.3 23.3 18 25 18H47C48.7 18 50 19.3 50 21V28C50 34.6 44.6 40 38 40H34C27.4 40 22 34.6 22 28V21Z" fill="#F2B632" />
    <rect x="33" y="40" width="6" height="10" fill="#F2B632" />
    <rect x="24" y="50" width="24" height="6" rx="2" fill="#8C5E00" />
    <polygon points="36,22 37.8,26 42,26.5 38.9,29.3 39.7,33.5 36,31.4 32.3,33.5 33.1,29.3 30,26.5 34.2,26" fill="#172330" />
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

  <!-- Level Crest (40x40) -->
  <svg
    v-else-if="name === 'level-crest'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
  >
    <rect width="40" height="40" rx="10" fill="#172330" />
    <circle cx="7" cy="8" r="1.3" fill="#FFFFFF" />
    <polygon points="20,8 23.2,15.5 31.4,16.2 25.2,21.5 27.1,29.5 20,25.2 12.9,29.5 14.8,21.5 8.6,16.2 16.8,15.5" fill="#F2B632" />
  </svg>

  <!-- Step Icons (36x36) -->
  <svg
    v-else-if="name === 'step-01'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 36 36"
    fill="none"
    aria-hidden="true"
  >
    <rect width="36" height="36" rx="10" fill="#E6F3EF" />
    <circle cx="18" cy="18" r="11" fill="#0F6A5B" />
    <polygon points="18,10 23,26 13,26" fill="#F2B632" />
  </svg>
  <svg
    v-else-if="name === 'step-02'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 36 36"
    fill="none"
    aria-hidden="true"
  >
    <rect width="36" height="36" rx="10" fill="#1E4D8C" />
    <rect x="8" y="7" width="20" height="22" rx="4" fill="#FFFFFF" />
    <rect x="12" y="12" width="12" height="3" rx="1.5" fill="#1E4D8C" />
    <rect x="12" y="18" width="8" height="3" rx="1.5" fill="#F2B632" />
  </svg>
  <svg
    v-else-if="name === 'step-03'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 36 36"
    fill="none"
    aria-hidden="true"
  >
    <rect width="36" height="36" rx="10" fill="#FEF8E8" />
    <circle cx="18" cy="15" r="8" fill="#F2B632" />
    <rect x="14" y="23" width="8" height="5" rx="2" fill="#172330" />
  </svg>
  <svg
    v-else-if="name === 'step-04'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 36 36"
    fill="none"
    aria-hidden="true"
  >
    <rect width="36" height="36" rx="10" fill="#172330" />
    <polygon points="18,7 21,14 28.5,14.8 22.8,19.8 24.5,27 18,23.2 11.5,27 13.2,19.8 7.5,14.8 15,14" fill="#F2B632" />
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
  <!-- 4 Gamification Icons (28x28) -->
  <svg
    v-else-if="name === 'icon-badge'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden="true"
  >
    <rect width="28" height="28" rx="8" fill="#FEF8E8" />
    <rect x="8" y="16" width="5" height="9" rx="1" transform="rotate(12 10.5 20.5)" fill="#0F6A5B" />
    <rect x="15" y="16" width="5" height="9" rx="1" transform="rotate(-12 17.5 20.5)" fill="#0F6A5B" />
    <circle cx="14" cy="11" r="8" fill="#F2B632" stroke="#8C5E00" stroke-width="1.5" />
    <polygon points="14,7 15.2,9.8 18.2,10.1 16,12.1 16.6,15 14,13.4 11.4,15 12,12.1 9.8,10.1 12.8,9.8" fill="#172330" />
  </svg>
  <svg
    v-else-if="name === 'icon-lesson'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden="true"
  >
    <rect width="28" height="28" rx="8" fill="#E6F3EF" />
    <rect x="5" y="5" width="18" height="18" rx="3" fill="#0F6A5B" />
    <rect x="7" y="7" width="6" height="14" rx="1" fill="#FFFFFF" />
    <rect x="15" y="7" width="6" height="14" rx="1" fill="#FFFFFF" />
    <rect x="16" y="5" width="3.5" height="9" rx="1" fill="#F2B632" />
  </svg>
  <svg
    v-else-if="name === 'icon-level'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden="true"
  >
    <rect width="28" height="28" rx="8" fill="#172330" />
    <path d="M14 4L22 7V14C22 19 18.5 22.5 14 24.5C9.5 22.5 6 19 6 14V7L14 4Z" fill="#1E4D8C" stroke="#FAF7F0" stroke-width="1.5" />
    <polygon points="14,9.5 15.3,12.5 18.5,12.8 16.1,14.9 16.8,18 14,16.3 11.2,18 11.9,14.9 9.5,12.8 12.7,12.5" fill="#F2B632" />
  </svg>
  <svg
    v-else-if="name === 'icon-xp'"
    :width="dims.w"
    :height="dims.h"
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden="true"
  >
    <rect width="28" height="28" rx="8" fill="#172330" />
    <path d="M15 4L8 15H13.5L12 24L20 12.5H14.5L15 4Z" fill="#F2B632" stroke="#8C5E00" stroke-width="1" stroke-linejoin="round" />
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
