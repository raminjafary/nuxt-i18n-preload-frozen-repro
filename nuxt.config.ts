export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'ar',
    detectBrowserLanguage: false,
    locales: [
      { code: 'ar', language: 'ar-IQ', files: ['ar.json'] },
      { code: 'en', language: 'en-US', files: ['en.json'] },
    ],
    experimental: { preload: true },
  },
})
