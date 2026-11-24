export default defineNuxtRouteMiddleware(async (to) => {
  const isAppRoute = to.path === '/app' || to.path.startsWith('/app/')
  const isOnboardingRoute = to.path === '/auth/onboarding'
  const isLoginRoute = to.path === '/auth/login'

  if (!isAppRoute && !isOnboardingRoute && !isLoginRoute) {
    return
  }

  const { fetchMe } = useAuth()
  const user = await fetchMe()

  if (isLoginRoute) {
    if (user) {
      return navigateTo(user.onboardingCompleted ? '/app' : '/auth/onboarding')
    }
    return
  }

  if (isOnboardingRoute) {
    if (!user) {
      return navigateTo('/auth/login')
    }
    if (user.onboardingCompleted) {
      return navigateTo('/app')
    }
    return
  }

  if (isAppRoute) {
    if (!user) {
      return navigateTo('/auth/login')
    }
    if (!user.onboardingCompleted) {
      return navigateTo('/auth/onboarding')
    }
  }
})
