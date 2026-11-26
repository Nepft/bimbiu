import { App } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { Capacitor } from '@capacitor/core'

export default defineNuxtPlugin(() => {
  if (!Capacitor.isNativePlatform()) return

  const router = useRouter()
  const { fetchMe } = useAuth()

  App.addListener('appUrlOpen', async ({ url }) => {
    if (!url.startsWith('bimbiu://auth-callback')) return

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

      await fetchMe()
      await router.replace(res.redirectTo || '/app')
    } catch {
      await router.replace('/auth/login?error=failed')
    }
  })
})
