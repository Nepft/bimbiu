// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  typescript: {
    strict: true,
    typeCheck: true,
  },
  css: [
    '@fontsource/bricolage-grotesque/600.css',
    '@fontsource/bricolage-grotesque/700.css',
    '@fontsource/plus-jakarta-sans/400.css',
    '@fontsource/plus-jakarta-sans/500.css',
    '@fontsource/plus-jakarta-sans/600.css',
    '@fontsource/plus-jakarta-sans/700.css',
    '~/assets/css/tokens.css',
    '~/assets/css/base.css',
  ],
  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'Bimbiu - Kuis Pengetahuan Umum Anak',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
})
