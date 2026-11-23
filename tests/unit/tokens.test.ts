import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('Design system tokens', () => {
  it('defines core Warm Paper, Forest Teal, Atlas Blue, and Sunburst Marigold tokens', () => {
    const css = readFileSync(resolve(process.cwd(), 'app/assets/css/tokens.css'), 'utf-8')
    expect(css).toContain('--bg-canvas: var(--color-paper-50);')
    expect(css).toContain('--color-paper-50: #FAF7F0;')
    expect(css).toContain('--color-teal-700: #0F6A5B;')
    expect(css).toContain('--color-atlas-700: #1E4D8C;')
    expect(css).toContain('--color-gold-400: #F2B632;')
    expect(css).toContain('--touch-target-min: 44px;')
  })
})
