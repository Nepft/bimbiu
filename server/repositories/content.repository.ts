import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import {
  badgeDefinitionSchema,
  categoryDefinitionSchema,
  lessonContentSchema,
  unitDefinitionSchema,
} from '../content/schema'
import type {
  BadgeDefinition,
  CategoryDefinition,
  LessonContent,
  UnitDefinition,
} from '../content/types'

interface ContentStore {
  categories: CategoryDefinition[]
  units: UnitDefinition[]
  lessons: LessonContent[]
  badges: BadgeDefinition[]
  lessonsById: Map<string, LessonContent>
}

let cachedStore: ContentStore | null = null

function readJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

export function loadContentStore(forceReload = false): ContentStore {
  if (cachedStore && !forceReload) {
    return cachedStore
  }

  const contentDir = path.join(process.cwd(), 'server', 'content')
  const categories = z
    .array(categoryDefinitionSchema)
    .parse(readJson(path.join(contentDir, 'categories.json')))
    .sort((a, b) => a.order - b.order)

  const badges = z
    .array(badgeDefinitionSchema)
    .parse(readJson(path.join(contentDir, 'badges.json')))

  const units: UnitDefinition[] = []
  const lessons: LessonContent[] = []
  const lessonsById = new Map<string, LessonContent>()

  for (const cat of categories) {
    const catDir = path.join(contentDir, cat.id)
    if (!fs.existsSync(catDir)) continue

    for (const unitEntry of fs.readdirSync(catDir, { withFileTypes: true })) {
      if (!unitEntry.isDirectory()) continue
      const unitDir = path.join(catDir, unitEntry.name)
      const unitFile = path.join(unitDir, 'unit.json')
      if (!fs.existsSync(unitFile)) continue

      const unit = unitDefinitionSchema.parse(readJson(unitFile))
      units.push(unit)

      const lessonFiles = fs
        .readdirSync(unitDir)
        .filter(f => f.endsWith('.json') && f !== 'unit.json')
        .sort()

      for (const lf of lessonFiles) {
        const lesson = lessonContentSchema.parse(readJson(path.join(unitDir, lf)))
        lessons.push(lesson)
        lessonsById.set(lesson.id, lesson)
      }
    }
  }

  units.sort((a, b) => a.order - b.order)
  lessons.sort((a, b) => a.order - b.order)

  cachedStore = { categories, units, lessons, badges, lessonsById }
  return cachedStore
}
