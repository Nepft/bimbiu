import { createError, getRouterParam } from 'h3'
import { progressService } from '../../../services/progress.service'
import { requireOnboardedLearner } from '../../../utils/session'

export default defineEventHandler(async (event) => {
  const learner = await requireOnboardedLearner(event)
  const categoryId = getRouterParam(event, 'categoryId')
  if (!categoryId) {
    throw createError({ statusCode: 400, statusMessage: 'categoryId diperlukan.' })
  }

  const detail = await progressService.getCategoryDetailForLearner(learner.id, categoryId)
  if (!detail) {
    throw createError({ statusCode: 404, statusMessage: 'Kategori tidak ditemukan.' })
  }
  return detail
})
