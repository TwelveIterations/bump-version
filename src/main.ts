import * as core from '@actions/core'
import { bumpVersion } from './version.js'

export async function run(): Promise<void> {
  try {
    const version: string = core.getInput('version', {
      required: true
    })
    const bump: 'major' | 'minor' | 'patch' | 'revision' | 'none' =
      core.getInput('bump', {
        required: true
      }) as 'major' | 'minor' | 'patch' | 'revision' | 'none'
    const format: 'a.b.c' | 'a.b.c.d' | undefined = core.getInput('format', {
      required: false
    }) as 'a.b.c' | 'a.b.c.d' | undefined

    const result = await bumpVersion(version, bump, format)
    core.setOutput('version', result)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
