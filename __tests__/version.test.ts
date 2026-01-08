/**
 * Unit tests for src/version.ts
 */
import { bumpVersion } from '../src/version.js'

describe('version.ts', () => {
  it('Throws when version is missing', async () => {
    await expect(bumpVersion('', 'patch')).rejects.toThrow(
      'version is not a string'
    )
  })

  it('Throws when bump type is invalid', async () => {
    await expect(
      bumpVersion(
        '1.2.3',
        'invalid' as 'major' | 'minor' | 'patch' | 'revision' | 'none'
      )
    ).rejects.toThrow(
      "bump must be either 'major', 'minor', 'patch', 'revision', or 'none'"
    )
  })

  it('Throws when format is invalid', async () => {
    await expect(
      bumpVersion('1.2.3', 'patch', 'invalid' as 'a.b.c' | 'a.b.c.d')
    ).rejects.toThrow("format must be either 'a.b.c' or 'a.b.c.d'")
  })

  it('Bumps major version correctly', async () => {
    const result = await bumpVersion('1.2.3', 'major')
    expect(result).toBe('2.0.0')
  })

  it('Bumps minor version correctly', async () => {
    const result = await bumpVersion('1.2.3', 'minor')
    expect(result).toBe('1.3.0')
  })

  it('Bumps patch version correctly', async () => {
    const result = await bumpVersion('1.2.3', 'patch')
    expect(result).toBe('1.2.4')
  })

  it('Bumps revision version correctly', async () => {
    const result = await bumpVersion('1.2.3.4', 'revision')
    expect(result).toBe('1.2.3.5')
  })

  it('Adds revision when bumping revision on 3-part version', async () => {
    const result = await bumpVersion('1.2.3', 'revision')
    expect(result).toBe('1.2.3.1')
  })

  it('Returns original version when bump is none', async () => {
    const result = await bumpVersion('1.2.3', 'none')
    expect(result).toBe('1.2.3')
  })

  it('Handles 4-part version with patch bump', async () => {
    const result = await bumpVersion('1.2.3.4', 'patch')
    expect(result).toBe('1.2.4.0')
  })

  // Two-component version tests
  it('Bumps major version on two-component version', async () => {
    const result = await bumpVersion('1.2', 'major')
    expect(result).toBe('2.0.0')
  })

  it('Bumps minor version on two-component version', async () => {
    const result = await bumpVersion('1.2', 'minor')
    expect(result).toBe('1.3.0')
  })

  it('Bumps patch version on two-component version', async () => {
    const result = await bumpVersion('1.2', 'patch')
    expect(result).toBe('1.2.1')
  })

  it('Bumps revision version on two-component version', async () => {
    const result = await bumpVersion('1.2', 'revision')
    expect(result).toBe('1.2.0.1')
  })

  // Format parameter tests
  it('Uses specified format a.b.c for revision bump', async () => {
    const result = await bumpVersion('1.2.3', 'revision', 'a.b.c')
    expect(result).toBe('1.2.3')
  })

  it('Uses specified format a.b.c.d for patch bump', async () => {
    const result = await bumpVersion('1.2.3', 'patch', 'a.b.c.d')
    expect(result).toBe('1.2.4.0')
  })

  it('Auto-detects a.b.c.d format for revision bump', async () => {
    const result = await bumpVersion('1.2.3', 'revision')
    expect(result).toBe('1.2.3.1')
  })

  it('Auto-detects a.b.c format for patch bump on 3-part version', async () => {
    const result = await bumpVersion('1.2.3', 'patch')
    expect(result).toBe('1.2.4')
  })

  it('Auto-detects a.b.c.d format for patch bump on 4-part version', async () => {
    const result = await bumpVersion('1.2.3.4', 'patch')
    expect(result).toBe('1.2.4.0')
  })

  it('Uses specified format a.b.c for two-component version', async () => {
    const result = await bumpVersion('1.2', 'patch', 'a.b.c')
    expect(result).toBe('1.2.1')
  })

  it('Uses specified format a.b.c.d for two-component version', async () => {
    const result = await bumpVersion('1.2', 'patch', 'a.b.c.d')
    expect(result).toBe('1.2.1.0')
  })
})
