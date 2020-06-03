import semverDiff from 'semver/functions/diff'
import semverSatisfies from 'semver/functions/satisfies'

const DEFAULT_VERSION = '0.0.0'

export function isNewVersion(lastVersion, currentVersion) {
  if (!lastVersion && !currentVersion) {
    return false
  }

  return semverDiff(lastVersion || DEFAULT_VERSION, currentVersion) !== null
}

export function satisifesRange(version, fromVersion, toVersion) {
  const range = `>${fromVersion || DEFAULT_VERSION} <=${toVersion}`

  return semverSatisfies(version, range)
}
