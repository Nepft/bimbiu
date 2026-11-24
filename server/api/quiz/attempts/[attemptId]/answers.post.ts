import { createError, getRouterParam, readBody } from 'h3'
import { quizService } from '../../../../services/quiz.service'
import { assertSameOrigin } from '../../../../utils/csrf'
import { requireOnboardedLearner } from '../../../../utils/session'

export default defineEventHandler(async (event) => {
  assertSameOrigin(event)
  const learner = await requireOnboardedLearner(event)
  const attemptId = getRouterParam(event, 'attemptId')
  if (!attemptId) {
    throw createError({ statusCode: 400, statusMessage: 'attemptId diperlukan.' })
  }

  const body = await readBody(event)
  return quizService.submitAnswer(learner.id, attemptId, body)
})
