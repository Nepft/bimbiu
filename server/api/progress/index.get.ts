import { progressService } from '../../services/progress.service'
import { requireOnboardedLearner } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const learner = await requireOnboardedLearner(event)
  return progressService.getProgressSummary(learner.id)
})
