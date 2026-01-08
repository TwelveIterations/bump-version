export async function bumpVersion(
  version: string,
  bump: 'major' | 'minor' | 'patch' | 'revision' | 'none',
  format?: 'a.b.c' | 'a.b.c.d'
): Promise<string> {
  if (!version || typeof version !== 'string') {
    throw new Error('version is not a string')
  }
  if (
    bump !== 'major' &&
    bump !== 'minor' &&
    bump !== 'patch' &&
    bump !== 'revision' &&
    bump !== 'none'
  ) {
    throw new Error(
      "bump must be either 'major', 'minor', 'patch', 'revision', or 'none'"
    )
  }
  if (format && format !== 'a.b.c' && format !== 'a.b.c.d') {
    throw new Error("format must be either 'a.b.c' or 'a.b.c.d'")
  }

  const versionParts = version.split('.')
  let major = parseInt(versionParts[0])
  let minor = versionParts.length > 1 ? parseInt(versionParts[1]) : 0
  let patch = versionParts.length > 2 ? parseInt(versionParts[2]) : 0
  let revision = versionParts.length > 3 ? parseInt(versionParts[3]) : 0

  if (bump === 'major') {
    major++
    minor = 0
    patch = 0
    revision = 0
  } else if (bump === 'minor') {
    minor++
    patch = 0
    revision = 0
  } else if (bump === 'patch') {
    patch++
    revision = 0
  } else if (bump === 'revision') {
    revision++
  }

  if (!format) {
    format =
      bump === 'revision' || versionParts.length >= 4 ? 'a.b.c.d' : 'a.b.c'
  }

  if (format === 'a.b.c.d') {
    return major + '.' + minor + '.' + patch + '.' + revision
  } else {
    return major + '.' + minor + '.' + patch
  }
}
