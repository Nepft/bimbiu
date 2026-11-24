import { getAuthenticatedLearner } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const learner = await getAuthenticatedLearner(event)
  if (!learner) {
    return {
      authenticated: false,
      user: null,
    }
  }

  return {
    authenticated: true,
    user: learner,
  }
})
