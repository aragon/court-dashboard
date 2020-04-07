import { useCallback, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Preferences base query string
const GLOBAL_PREFERENCES_QUERY_PARAM = '?preferences='

export function getPreferencesSearch(screen) {
  return `${GLOBAL_PREFERENCES_QUERY_PARAM}${screen}`
}

function parsePreferences(search = '') {
  const searchParams = new URLSearchParams(search)

  return searchParams.get('preferences')
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

  const searchParamFromUrl = parsePreferences(search)

  // In case that this hook is called from the the global error we need to redirect to the home page and reload
  const basePath = appCrashed ? '/' : pathname

  const preferenceScreen = useRef(searchParamFromUrl)

  const handleOpenPreferences = useCallback(
    screen => {
      preferenceScreen.current = screen
      const fullPath = basePath + getPreferencesSearch(preferenceScreen.current)
      history.push(fullPath)
      if (appCrashed) {
        window.location.reload()
      }
    },
    [appCrashed, basePath, history]
  )

  const handleClosePreferences = useCallback(() => {
    preferenceScreen.current = ''
    history.push(basePath)
  }, [basePath, history])

  return [
    handleOpenPreferences,
    handleClosePreferences,
    preferenceScreen.current,
  ]
}
