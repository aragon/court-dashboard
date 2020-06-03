import {
  getLastPackageVersion,
  getPackageVersion,
  setPackageVersion,
} from '../local-settings'
import { clearActivities } from './migrations'
import { isNewVersion, satisifesRange } from './helper'

const MIGRATIONS = [['1.0.0', () => clearActivities()]]

export function checkMigrations() {
  const packageVersion = getPackageVersion()
  const lastPackageVersion = getLastPackageVersion()

  if (isNewVersion(lastPackageVersion, packageVersion)) {
    // Save the current package version
    setPackageVersion(packageVersion)

    // Run each migration which falls in the range (lastPackageVersion, packageVersion]
    for (const [version, migration] of MIGRATIONS) {
      if (satisifesRange(version, lastPackageVersion, packageVersion)) {
        // Run migration
        migration()
      }
    }
  }
}
