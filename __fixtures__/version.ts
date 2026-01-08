import { jest } from '@jest/globals'

export const bumpVersion =
  jest.fn<typeof import('../src/version.js').bumpVersion>()
