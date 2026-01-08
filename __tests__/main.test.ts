/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import { bumpVersion } from '../__fixtures__/version.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/version.js', () => ({ bumpVersion }))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation((name: string) => {
      const inputs: Record<string, string> = {
        version: '1.2.3',
        bump: 'patch'
      }
      return inputs[name] || ''
    })

    // Mock bumpVersion to return a version.
    bumpVersion.mockImplementation(() => Promise.resolve('1.2.4'))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Sets the version output when a version is bumped', async () => {
    await run()

    // Verify bumpVersion was called with correct parameters.
    expect(bumpVersion).toHaveBeenCalledWith('1.2.3', 'patch', '')

    // Verify the version output was set.
    expect(core.setOutput).toHaveBeenCalledWith('version', '1.2.4')
  })

  it('Sets a failed status when bumpVersion throws an error', async () => {
    // Mock bumpVersion to throw an error.
    bumpVersion
      .mockClear()
      .mockRejectedValueOnce(new Error('Invalid version format'))

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenCalledWith('Invalid version format')
  })

  it('Sets a failed status when an error occurs', async () => {
    // Mock bumpVersion to throw an error.
    bumpVersion
      .mockClear()
      .mockRejectedValueOnce(new Error('Version parsing failed'))

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenCalledWith('Version parsing failed')
  })
})
