import { createError, getRouterParam } from 'h3'
import { getLessonById, sanitizeLessonForClient } from '../../../services/content.service'
import { requireOnboardedLearner } from '../../../utils/session'

export default defineEventHandler(async (event) => {
  await requireOnboardedLearner(event)
  const lessonId = getRouterParam(event, 'lessonId')
  if (!lessonId) {
    throw createError({ statusCode: 400, statusMessage: 'lessonId diperlukan.' })
  }

  const lesson = getLessonById(lessonId)
  if (!lesson) {
    throw createError({ statusCode: 404, statusMessage: 'Pelajaran tidak ditemukan.' })
  }

  return sanitizeLessonForClient(lesson)
})
