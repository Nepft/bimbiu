export interface LearnerUser {
  id: string
  displayName: string
  avatarKey: string
  onboardingCompleted: boolean
  status: string
}

interface AuthMeResponse {
  authenticated: boolean
  user: LearnerUser | null
}

export function useAuth() {
  const user = useState<LearnerUser | null>('bimbiu-auth-user', () => null)
  const loaded = useState<boolean>('bimbiu-auth-loaded', () => false)

  async function fetchMe(force = false): Promise<LearnerUser | null> {
    if (loaded.value && !force) {
      return user.value
    }

    try {
      const requestFetch = useRequestFetch()
      const data = await requestFetch<AuthMeResponse>('/api/auth/me')
      user.value = data.authenticated ? data.user : null
    } catch {
      user.value = null
    } finally {
      loaded.value = true
    }

    return user.value
  }

  async function completeOnboarding(payload: {
    displayName: string
    avatarKey: string
    guardianConsent: boolean
  }): Promise<LearnerUser> {
    const res = await $fetch<{ user: LearnerUser }>('/api/auth/onboarding', {
      method: 'POST',
      body: payload,
    })
    user.value = res.user
    loaded.value = true
    return res.user
  }

  async function updateProfile(payload: {
    displayName: string
    avatarKey: string
  }): Promise<LearnerUser> {
    const res = await $fetch<{ user: LearnerUser }>('/api/profile', {
      method: 'PATCH',
      body: payload,
    })
    user.value = res.user
    loaded.value = true
    return res.user
  }

  async function logout(): Promise<void> {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    loaded.value = true
  }

  return {
    user,
    loaded,
    fetchMe,
    completeOnboarding,
    updateProfile,
    logout,
  }
}
