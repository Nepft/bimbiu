import { App } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { Capacitor } from '@capacitor/core'

export default defineNuxtPlugin(() => {
  if (!Capacitor.isNativePlatform()) return

  const router = useRouter()
  const { fetchMe } = useAuth()
  let lastHandledUrl = ''

  async function handleAuthCallback(url: string) {
    if (!url.startsWith('bimbiu://auth-callback') || url === lastHandledUrl) return
    lastHandledUrl = url

    await Browser.close().catch(() => {})

    try {
      const parsed = new URL(url)
      const error = parsed.searchParams.get('error')
      const code = parsed.searchParams.get('code')

      if (error || !code) {
        await router.replace(`/auth/login?error=${error === 'cancelled' ? 'cancelled' : 'failed'}`)
        return
      }

      const res = await $fetch<{ ok: boolean; redirectTo: string }>('/api/auth/app-exchange', {
        method: 'POST',
        body: { code },
      })

      // Force refresh so the cached `loaded` state from `/auth/login` is bypassed.
      const user = await fetchMe(true)
      if (!user) {
        await router.replace('/auth/login?error=failed')
        return
      }

      await router.replace(res.redirectTo || '/app')
    } catch {
      await router.replace('/auth/login?error=failed')
    }
  }

  App.addListener('appUrlOpen', ({ url }) => {
    void handleAuthCallback(url)
  })

  void App.getLaunchUrl().then((launch) => {
    if (launch?.url) {
      void handleAuthCallback(launch.url)
    }
  })
})
