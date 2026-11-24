import fs from 'node:fs'
import path from 'node:path'

export function generateContentBundle(rootDir = process.cwd()) {
  const contentDir = path.join(rootDir, 'server', 'content')
  const categories = JSON.parse(
    fs.readFileSync(path.join(contentDir, 'categories.json'), 'utf8'),
  )
  const badges = JSON.parse(
    fs.readFileSync(path.join(contentDir, 'badges.json'), 'utf8'),
  )

  const units = []
  const lessons = []

  for (const cat of categories) {
    const catDir = path.join(contentDir, cat.id)
    if (!fs.existsSync(catDir)) continue

    for (const unitEntry of fs.readdirSync(catDir, { withFileTypes: true })) {
      if (!unitEntry.isDirectory()) continue
      const unitDir = path.join(catDir, unitEntry.name)
      const unitFile = path.join(unitDir, 'unit.json')
      if (!fs.existsSync(unitFile)) continue

      units.push(JSON.parse(fs.readFileSync(unitFile, 'utf8')))

      for (const fileEntry of fs.readdirSync(unitDir, { withFileTypes: true })) {
        if (!fileEntry.isFile() || !fileEntry.name.endsWith('.json') || fileEntry.name === 'unit.json') {
          continue
        }
        lessons.push(JSON.parse(fs.readFileSync(path.join(unitDir, fileEntry.name), 'utf8')))
      }
    }
  }

  const outFile = path.join(contentDir, 'bundle.generated.ts')
  const payload = JSON.stringify({ categories, badges, units, lessons })
  const source = [
    '// Auto-generated for serverless runtimes (Vercel). Do not edit manually.',
    `export const BUNDLED_CONTENT = ${payload} as const`,
    '',
  ].join('\n')

  fs.writeFileSync(outFile, source, 'utf8')
  return outFile
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
  const out = generateContentBundle()
  console.log(`Generated ${out}`)
}
