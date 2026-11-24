import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import {
  badgeDefinitionSchema,
  categoryDefinitionSchema,
  lessonContentSchema,
  unitDefinitionSchema,
} from '../server/content/schema'

const ROOT = process.cwd()
const CONTENT_DIR = path.join(ROOT, 'server', 'content')
const PUBLIC_DIRS = [path.join(ROOT, 'app'), path.join(ROOT, 'public')]

function fail(message: string): never {
  console.error(`❌ Content validation failed: ${message}`)
  process.exit(1)
}

function readJson(filePath: string): unknown {
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw)
}

function walkFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  const out: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walkFiles(full))
    } else {
      out.push(full)
    }
  }
  return out
}

// 1. Validate categories.json
const categoriesRaw = readJson(path.join(CONTENT_DIR, 'categories.json'))
const categories = z.array(categoryDefinitionSchema).min(6).parse(categoriesRaw)
const categoryIds = new Set(categories.map(c => c.id))
if (categoryIds.size !== categories.length) {
  fail('Duplicate category IDs in categories.json')
}

// 2. Validate badges.json
const badgesRaw = readJson(path.join(CONTENT_DIR, 'badges.json'))
const badges = z.array(badgeDefinitionSchema).min(1).parse(badgesRaw)
const badgeIds = new Set(badges.map(b => b.id))
if (badgeIds.size !== badges.length) {
  fail('Duplicate badge IDs in badges.json')
}

// 3. Walk all unit.json and lesson JSONs under server/content/<category>/<unit>/
const unitIds = new Set<string>()
const lessonIds = new Set<string>()
const questionIds = new Set<string>()
const lessons: z.infer<typeof lessonContentSchema>[] = []

for (const cat of categories) {
  const catDir = path.join(CONTENT_DIR, cat.id)
  if (!fs.existsSync(catDir)) {
    fail(`Missing category directory: server/content/${cat.id}`)
  }

  for (const unitEntry of fs.readdirSync(catDir, { withFileTypes: true })) {
    if (!unitEntry.isDirectory()) continue
    const unitDir = path.join(catDir, unitEntry.name)
    const unitFile = path.join(unitDir, 'unit.json')
    if (!fs.existsSync(unitFile)) {
      fail(`Missing unit.json in ${unitDir}`)
    }

    const unit = unitDefinitionSchema.parse(readJson(unitFile))
    if (unit.categoryId !== cat.id) {
      fail(`Unit ${unit.id} has categoryId=${unit.categoryId}, expected ${cat.id}`)
    }
    if (unitIds.has(unit.id)) {
      fail(`Duplicate unit ID: ${unit.id}`)
    }
    unitIds.add(unit.id)

    const lessonFiles = fs
      .readdirSync(unitDir)
      .filter(f => f.endsWith('.json') && f !== 'unit.json')
      .sort()

    for (const lf of lessonFiles) {
      const lessonPath = path.join(unitDir, lf)
      const lesson = lessonContentSchema.parse(readJson(lessonPath))

      if (lesson.categoryId !== cat.id || lesson.unitId !== unit.id) {
        fail(`Lesson ${lesson.id} categoryId/unitId mismatch in ${lessonPath}`)
      }
      if (lessonIds.has(lesson.id)) {
        fail(`Duplicate lesson ID: ${lesson.id}`)
      }
      lessonIds.add(lesson.id)

      for (const q of lesson.questions) {
        if (questionIds.has(q.id)) {
          fail(`Duplicate question ID: ${q.id} in ${lesson.id}`)
        }
        questionIds.add(q.id)
      }

      lessons.push(lesson)
    }
  }
}

// 4. Validate prerequisites point to existing lessons
for (const lesson of lessons) {
  for (const pre of lesson.prerequisites) {
    if (!lessonIds.has(pre)) {
      fail(`Lesson ${lesson.id} has invalid prerequisite "${pre}"`)
    }
    if (pre === lesson.id) {
      fail(`Lesson ${lesson.id} cannot depend on itself`)
    }
  }
}

// 5. Ensure no answer keys leak into app/ or public/
for (const dir of PUBLIC_DIRS) {
  for (const file of walkFiles(dir)) {
    if (!/\.(ts|js|vue|json)$/.test(file)) continue
    const content = fs.readFileSync(file, 'utf8')
    if (/\b(correctAnswer|acceptedAnswers)\b/.test(content)) {
      fail(`Potential answer key leak detected in client/public file: ${file}`)
    }
  }
}

console.log(
  `✅ Content validation passed: ${categories.length} categories, ${unitIds.size} units, ${lessons.length} lessons, ${questionIds.size} questions, ${badges.length} badges.`,
)
