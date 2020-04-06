import { useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Preferences base query string
const GLOBAL_PREFERENCES_QUERY_PARAM = '?preferences='

export function getPreferencesSearch(screen) {
  return `${GLOBAL_PREFERENCES_QUERY_PARAM}${screen}`
}

function parsePreferences(search = '') {
  const [, path = ''] = search.split(GLOBAL_PREFERENCES_QUERY_PARAM)

  return path
}

/**
 * Hook to interact with the preferences
 * @param {Boolean} appCrashed flag that indicates if the app crashed
 * @returns {Array} [open preferences handler, close preferences handler, current preference screen]
 */
export default function usePreferences(appCrashed = false) {
  // We need to keep track of the path where the preference was called in order to return to the same path when the preference modal is closed
  const { pathname, search } = useLocation()
  const history = useHistory()

  const searchParmFromUrl = parsePreferences(search)

  // In case that this hook is called from the the global error we need to redirect to the home page and reload
  const basePath = appCrashed ? '/' : pathname

  const preferenceScreen = useRef(searchParmFromUrl)

  const handleOpenPreferences = screen => {
    preferenceScreen.current = screen
    const fullPath = basePath + getPreferencesSearch(preferenceScreen.current)
    history.push(fullPath)
    if (appCrashed) {
      window.location.reload()
    }
  }

  const handleClosePreferences = () => {
    preferenceScreen.current = ''
    history.push(basePath)
  }

  return [
    handleOpenPreferences,
    handleClosePreferences,
    preferenceScreen.current,
  ]
}
