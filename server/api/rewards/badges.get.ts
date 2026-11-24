import { progressService } from '../../services/progress.service'
import { requireOnboardedLearner } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const learner = await requireOnboardedLearner(event)
  const rewards = await progressService.getRewardsSummary(learner.id)
  return {
    badges: rewards.badges,
    earnedBadgesCount: rewards.earnedBadgesCount,
    totalBadgesCount: rewards.totalBadgesCount,
  }
})
