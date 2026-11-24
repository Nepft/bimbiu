import { createError, getRouterParam } from 'h3'
import { quizService } from '../../../../services/quiz.service'
import { requireOnboardedLearner } from '../../../../utils/session'

export default defineEventHandler(async (event) => {
  const learner = await requireOnboardedLearner(event)
  const attemptId = getRouterParam(event, 'attemptId')
  if (!attemptId) {
    throw createError({ statusCode: 400, statusMessage: 'attemptId diperlukan.' })
  }

  return quizService.getAttemptResult(learner.id, attemptId)
})
