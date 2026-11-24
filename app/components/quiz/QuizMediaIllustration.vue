<script setup lang="ts">
export type QuizMediaKey =
  | 'quiz-planet'
  | 'quiz-globe'
  | 'quiz-candi'
  | 'quiz-geometri'
  | 'cat-language'
  | 'cat-everyday'
  | 'quiz-ecosystem'
  | 'quiz-landmark'
  | 'quiz-heritage'
  | 'quiz-clock'
  | 'quiz-signboard'
  | 'quiz-recycle'

interface Props {
  mediaKey?: string
  caption?: string
}

const props = withDefaults(defineProps<Props>(), {
  mediaKey: 'quiz-planet',
  caption: undefined,
})

const resolvedKey = computed<QuizMediaKey>(() => {
  switch (props.mediaKey) {
    case 'quiz-globe':
    case 'quiz-candi':
    case 'quiz-geometri':
    case 'cat-language':
    case 'cat-everyday':
    case 'quiz-ecosystem':
    case 'quiz-landmark':
    case 'quiz-heritage':
    case 'quiz-clock':
    case 'quiz-signboard':
    case 'quiz-recycle':
    case 'quiz-planet':
      return props.mediaKey
    default:
      return 'quiz-planet'
  }
})
</script>

<template>
  <!-- quiz-globe: Geografi & Bola Dunia -->
  <svg
    v-if="resolvedKey === 'quiz-globe'"
    width="320"
    height="172"
    viewBox="0 0 320 172"
    fill="none"
    role="img"
    :aria-label="caption || 'Ilustrasi peta bola dunia'"
    class="quiz-media-svg"
  >
    <rect width="320" height="172" rx="16" fill="#172330" />
    <circle cx="46" cy="30" r="2.5" fill="#FAF7F0" />
    <circle cx="272" cy="34" r="3" fill="#F2B632" />
    <circle cx="260" cy="134" r="2" fill="#FAF7F0" />
    <circle cx="160" cy="86" r="54" fill="#1E4D8C" />
    <path d="M126 62c12-10 30-12 42-2 10 8 4 22-8 26-10 3-24 10-32 2-6-6-10-18-2-26z" fill="#0F6A5B" />
    <path d="M174 84c14-4 28 4 30 18 2 10-8 22-22 24-12 2-18-10-16-22 2-8 2-18 8-20z" fill="#219E8A" />
    <ellipse cx="160" cy="86" rx="54" ry="18" stroke="#FAF7F0" stroke-opacity="0.3" stroke-width="2" />
    <line x1="160" y1="32" x2="160" y2="140" stroke="#FAF7F0" stroke-opacity="0.3" stroke-width="2" />
    <path d="M124 148h72" stroke="#F2B632" stroke-width="5" stroke-linecap="round" />
  </svg>

  <!-- quiz-candi: Sejarah & Candi Nusantara -->
  <svg
    v-else-if="resolvedKey === 'quiz-candi'"
    width="320"
    height="172"
    viewBox="0 0 320 172"
    fill="none"
    role="img"
    :aria-label="caption || 'Ilustrasi candi bersejarah Nusantara'"
    class="quiz-media-svg"
  >
    <rect width="320" height="172" rx="16" fill="#172330" />
    <circle cx="66" cy="44" r="18" fill="#F2B632" />
    <circle cx="268" cy="36" r="2.5" fill="#FAF7F0" />
    <rect x="74" y="126" width="172" height="18" rx="4" fill="#8C5E00" />
    <rect x="96" y="104" width="128" height="22" rx="4" fill="#F2EBDB" />
    <rect x="118" y="82" width="84" height="22" rx="4" fill="#FAF7F0" />
    <polygon points="160,36 196,82 124,82" fill="#F2B632" />
    <rect x="150" y="108" width="20" height="36" rx="10" fill="#172330" />
  </svg>

  <!-- quiz-geometri: Logika, Pola & Bangun Datar -->
  <svg
    v-else-if="resolvedKey === 'quiz-geometri'"
    width="320"
    height="172"
    viewBox="0 0 320 172"
    fill="none"
    role="img"
    :aria-label="caption || 'Ilustrasi bangun datar dan pola bilangan'"
    class="quiz-media-svg"
  >
    <rect width="320" height="172" rx="16" fill="#172330" />
    <rect x="44" y="48" width="70" height="70" rx="12" fill="#1E4D8C" stroke="#3A94D6" stroke-width="3" />
    <polygon points="162,42 204,118 120,118" fill="#0F6A5B" stroke="#219E8A" stroke-width="3" />
    <circle cx="246" cy="83" r="34" fill="#F2B632" />
    <circle cx="246" cy="83" r="14" fill="#172330" />
    <circle cx="32" cy="28" r="2" fill="#FAF7F0" />
    <circle cx="288" cy="140" r="2.5" fill="#FAF7F0" />
  </svg>

  <!-- cat-language: Bahasa & Buku Cerita -->
  <svg
    v-else-if="resolvedKey === 'cat-language'"
    width="320"
    height="172"
    viewBox="0 0 320 172"
    fill="none"
    role="img"
    :aria-label="caption || 'Ilustrasi buku cerita dan kosakata'"
    class="quiz-media-svg"
  >
    <rect width="320" height="172" rx="16" fill="#172330" />
    <circle cx="61" cy="61" r="43" fill="#0F6A5B" fill-opacity="0.25" />
    <rect x="56" y="36" width="208" height="114" rx="12" fill="#0F6A5B" />
    <rect x="66" y="30" width="92" height="112" rx="8" fill="#FAF7F0" />
    <rect x="162" y="30" width="92" height="112" rx="8" fill="#F2EBDB" />
    <rect x="156" y="30" width="8" height="114" rx="3" fill="#8C5E00" fill-opacity="0.5" />
    <path d="M218 30H236V74L227 65L218 74V30Z" fill="#C94A4A" />
    <rect x="78" y="48" width="56" height="6" rx="3" fill="#25374B" fill-opacity="0.75" />
    <rect x="78" y="62" width="66" height="5" rx="2.5" fill="#25374B" fill-opacity="0.35" />
    <rect x="78" y="74" width="60" height="5" rx="2.5" fill="#25374B" fill-opacity="0.35" />
    <rect x="78" y="102" width="42" height="18" rx="6" fill="#F2B632" />
    <text x="86" y="115" fill="#172330" font-size="11" font-weight="700" font-family="Plus Jakarta Sans, sans-serif">A-Z</text>
    <rect x="174" y="82" width="66" height="5" rx="2.5" fill="#25374B" fill-opacity="0.35" />
    <rect x="174" y="94" width="58" height="5" rx="2.5" fill="#25374B" fill-opacity="0.35" />
    <rect x="174" y="106" width="64" height="5" rx="2.5" fill="#25374B" fill-opacity="0.35" />
  </svg>

  <!-- cat-everyday: Pengetahuan Sehari-hari (Gizi & Pilah Sampah) -->
  <svg
    v-else-if="resolvedKey === 'cat-everyday'"
    width="320"
    height="172"
    viewBox="0 0 320 172"
    fill="none"
    role="img"
    :aria-label="caption || 'Ilustrasi piring gizi seimbang dan pilah sampah 3R'"
    class="quiz-media-svg"
  >
    <rect width="320" height="172" rx="16" fill="#172330" />
    <circle cx="96" cy="86" r="58" fill="#FAF7F0" />
    <circle cx="96" cy="86" r="46" fill="#F2EBDB" />
    <circle cx="75" cy="65" r="17" fill="#F2B632" />
    <circle cx="115" cy="65" r="17" fill="#219E8A" />
    <circle cx="75" cy="105" r="17" fill="#C94A4A" fill-opacity="0.9" />
    <circle cx="115" cy="105" r="17" fill="#3A94D6" fill-opacity="0.9" />
    <rect x="182" y="54" width="34" height="54" rx="6" fill="#219E8A" />
    <rect x="179" y="46" width="40" height="9" rx="4" fill="#0F6A5B" />
    <text x="193" y="87" fill="#FAF7F0" font-size="13" font-weight="700" font-family="Plus Jakarta Sans, sans-serif">O</text>
    <rect x="224" y="54" width="34" height="54" rx="6" fill="#F2B632" />
    <rect x="221" y="46" width="40" height="9" rx="4" fill="#8C5E00" />
    <text x="236" y="87" fill="#172330" font-size="13" font-weight="700" font-family="Plus Jakarta Sans, sans-serif">A</text>
    <rect x="266" y="54" width="34" height="54" rx="6" fill="#C94A4A" />
    <rect x="263" y="46" width="40" height="9" rx="4" fill="#25374B" />
    <text x="274" y="87" fill="#FAF7F0" font-size="12" font-weight="700" font-family="Plus Jakarta Sans, sans-serif">B3</text>
    <text x="184" y="132" fill="#FAF7F0" font-size="12" font-weight="600" font-family="Plus Jakarta Sans, sans-serif">Gizi &amp; Pilah 3R</text>
  </svg>

  <!-- quiz-ecosystem: Sains Ekosistem & Alam -->
  <svg
    v-else-if="resolvedKey === 'quiz-ecosystem'"
    width="320"
    height="172"
    viewBox="0 0 320 172"
    fill="none"
    role="img"
    :aria-label="caption || 'Ilustrasi ekosistem dan lingkungan alam'"
    class="quiz-media-svg"
  >
    <rect width="320" height="172" rx="16" fill="#172330" />
    <circle cx="241" cy="39" r="25" fill="#F2B632" fill-opacity="0.2" />
    <circle cx="241" cy="39" r="17" fill="#F2B632" />
    <circle cx="63" cy="45" r="13" fill="#FAF7F0" fill-opacity="0.9" />
    <circle cx="84" cy="40" r="16" fill="#FAF7F0" fill-opacity="0.95" />
    <circle cx="100" cy="46" r="12" fill="#FAF7F0" fill-opacity="0.9" />
    <rect y="126" width="320" height="46" fill="#0F6A5B" />
    <rect x="175" y="134" width="145" height="38" rx="12" fill="#3A94D6" fill-opacity="0.85" />
    <rect x="92" y="90" width="14" height="42" rx="4" fill="#8C5E00" />
    <circle cx="89" cy="77" r="23" fill="#219E8A" />
    <circle cx="113" cy="67" r="21" fill="#219E8A" />
  </svg>

  <!-- quiz-landmark: Geografi Gunung & Bentang Alam -->
  <svg
    v-else-if="resolvedKey === 'quiz-landmark'"
    width="320"
    height="172"
    viewBox="0 0 320 172"
    fill="none"
    role="img"
    :aria-label="caption || 'Ilustrasi pegunungan dan bentang alam Indonesia'"
    class="quiz-media-svg"
  >
    <rect width="320" height="172" rx="16" fill="#172330" />
    <circle cx="251" cy="39" r="15" fill="#F2B632" />
    <polygon points="40,132 116,48 192,132" fill="#0F6A5B" />
    <polygon points="134,132 200,64 266,132" fill="#219E8A" />
    <polygon points="94,72 116,48 138,72 125,68 116,76 107,68" fill="#FAF7F0" />
    <rect y="132" width="320" height="40" fill="#1E4D8C" />
    <rect x="48" y="146" width="86" height="5" rx="2.5" fill="#3A94D6" fill-opacity="0.7" />
    <rect x="174" y="152" width="92" height="5" rx="2.5" fill="#3A94D6" fill-opacity="0.7" />
  </svg>

  <!-- quiz-heritage: Sejarah Perjuangan & Benteng -->
  <svg
    v-else-if="resolvedKey === 'quiz-heritage'"
    width="320"
    height="172"
    viewBox="0 0 320 172"
    fill="none"
    role="img"
    :aria-label="caption || 'Ilustrasi benteng sejarah dan bendera Merah Putih'"
    class="quiz-media-svg"
  >
    <rect width="320" height="172" rx="16" fill="#172330" />
    <rect x="72" y="86" width="176" height="58" rx="6" fill="#F2EBDB" />
    <rect x="72" y="74" width="28" height="18" rx="3" fill="#F2EBDB" />
    <rect x="114" y="74" width="28" height="18" rx="3" fill="#F2EBDB" />
    <rect x="178" y="74" width="28" height="18" rx="3" fill="#F2EBDB" />
    <rect x="220" y="74" width="28" height="18" rx="3" fill="#F2EBDB" />
    <rect x="144" y="108" width="32" height="36" rx="16" fill="#172330" />
    <rect x="158" y="26" width="4" height="62" rx="2" fill="#F2B632" />
    <rect x="162" y="28" width="52" height="16" rx="2" fill="#C94A4A" />
    <rect x="162" y="44" width="52" height="16" rx="2" fill="#FAF7F0" />
  </svg>

  <!-- quiz-clock: Logika Waktu & Deret Bilangan -->
  <svg
    v-else-if="resolvedKey === 'quiz-clock'"
    width="320"
    height="172"
    viewBox="0 0 320 172"
    fill="none"
    role="img"
    :aria-label="caption || 'Ilustrasi jam analog dan pola bilangan'"
    class="quiz-media-svg"
  >
    <rect width="320" height="172" rx="16" fill="#172330" />
    <circle cx="86" cy="82" r="48" fill="#F2B632" />
    <circle cx="86" cy="82" r="38" fill="#FAF7F0" />
    <rect x="84" y="58" width="4" height="26" rx="2" fill="#172330" />
    <rect x="84" y="80" width="22" height="4" rx="2" fill="#C94A4A" />
    <circle cx="86" cy="82" r="4" fill="#172330" />
    <rect x="164" y="42" width="54" height="40" rx="8" fill="#219E8A" />
    <text x="185" y="69" fill="#FAF7F0" font-size="18" font-weight="700" font-family="Plus Jakarta Sans, sans-serif">3</text>
    <rect x="228" y="42" width="54" height="40" rx="8" fill="#1E4D8C" />
    <text x="249" y="69" fill="#FAF7F0" font-size="18" font-weight="700" font-family="Plus Jakarta Sans, sans-serif">6</text>
    <rect x="164" y="92" width="54" height="40" rx="8" fill="#3A94D6" />
    <text x="185" y="119" fill="#FAF7F0" font-size="18" font-weight="700" font-family="Plus Jakarta Sans, sans-serif">9</text>
    <rect x="228" y="92" width="54" height="40" rx="8" fill="#F2B632" />
    <text x="249" y="119" fill="#172330" font-size="18" font-weight="700" font-family="Plus Jakarta Sans, sans-serif">?</text>
  </svg>

  <!-- quiz-signboard: Bahasa Papan Petunjuk -->
  <svg
    v-else-if="resolvedKey === 'quiz-signboard'"
    width="320"
    height="172"
    viewBox="0 0 320 172"
    fill="none"
    role="img"
    :aria-label="caption || 'Ilustrasi papan petunjuk bahasa Indonesia'"
    class="quiz-media-svg"
  >
    <rect width="320" height="172" rx="16" fill="#172330" />
    <rect x="155" y="86" width="10" height="62" rx="4" fill="#8C5E00" />
    <rect x="66" y="36" width="188" height="56" rx="12" fill="#F2B632" />
    <rect x="74" y="44" width="172" height="40" rx="8" fill="#FAF7F0" />
    <text x="102" y="70" fill="#172330" font-size="16" font-weight="700" font-family="Plus Jakarta Sans, sans-serif">LOKET TIKET</text>
    <rect x="36" y="106" width="84" height="34" rx="10" fill="#219E8A" />
    <text x="56" y="128" fill="#FAF7F0" font-size="13" font-weight="700" font-family="Plus Jakarta Sans, sans-serif">A  B  C</text>
  </svg>

  <!-- quiz-recycle: Hemat Energi & Daur Ulang 3R -->
  <svg
    v-else-if="resolvedKey === 'quiz-recycle'"
    width="320"
    height="172"
    viewBox="0 0 320 172"
    fill="none"
    role="img"
    :aria-label="caption || 'Ilustrasi hemat energi dan daur ulang 3R'"
    class="quiz-media-svg"
  >
    <rect width="320" height="172" rx="16" fill="#172330" />
    <circle cx="80" cy="62" r="36" fill="#F2B632" fill-opacity="0.2" />
    <circle cx="80" cy="62" r="28" fill="#F2B632" />
    <rect x="68" y="86" width="24" height="22" rx="4" fill="#F2EBDB" />
    <rect x="72" y="110" width="16" height="8" rx="4" fill="#25374B" />
    <circle cx="222" cy="80" r="48" fill="#0F6A5B" />
    <circle cx="222" cy="80" r="36" fill="#219E8A" />
    <text x="206" y="89" fill="#FAF7F0" font-size="24" font-weight="700" font-family="Plus Jakarta Sans, sans-serif">3R</text>
    <text x="168" y="148" fill="#FAF7F0" font-size="11" font-weight="600" font-family="Plus Jakarta Sans, sans-serif">Hemat &amp; Daur Ulang</text>
  </svg>

  <!-- quiz-planet (default): Tata Surya & Planet Bercincin -->
  <svg
    v-else
    width="320"
    height="172"
    viewBox="0 0 320 172"
    fill="none"
    role="img"
    :aria-label="caption || 'Ilustrasi tata surya dan planet'"
    class="quiz-media-svg"
  >
    <rect width="320" height="172" rx="16" fill="#172330" />
    <circle cx="51" cy="45" r="23" fill="#F2B632" fill-opacity="0.22" />
    <circle cx="51" cy="45" r="15" fill="#F2B632" />
    <ellipse cx="160" cy="86" rx="118" ry="43" transform="rotate(-14 160 86)" stroke="#FAF7F0" stroke-opacity="0.25" stroke-width="2" stroke-dasharray="6 5" />
    <circle cx="160" cy="86" r="46" fill="#1E4D8C" />
    <rect x="123" y="64" width="74" height="14" rx="7" fill="#3A94D6" fill-opacity="0.85" />
    <rect x="129" y="92" width="62" height="10" rx="5" fill="#219E8A" fill-opacity="0.75" />
    <circle cx="254" cy="52" r="16" fill="#F2EBDB" />
    <circle cx="250" cy="48" r="3.5" fill="#25374B" fill-opacity="0.25" />
    <circle cx="260" cy="57" r="2.5" fill="#25374B" fill-opacity="0.25" />
    <circle cx="88" cy="134" r="3" fill="#FAF7F0" fill-opacity="0.7" />
    <circle cx="212" cy="24" r="2.5" fill="#FAF7F0" fill-opacity="0.7" />
  </svg>
</template>

<style scoped>
.quiz-media-svg {
  max-width: 100%;
  height: auto;
  border-radius: 14px;
}
</style>
