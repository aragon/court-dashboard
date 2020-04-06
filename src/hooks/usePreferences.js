import { useCallback, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { getPreferencesSearch } from '../Routes'

/**
 * Hook to interact with the preferences
 * @returns {Array} first parameter open preferences handler, second parameter close preferences handler
 *  third parameter the selected preference option
 */
export default function usePreferences() {
  /* We need to keep track of the path where the preference was called 
    in order to return to the same path when the preference modal is closed
  */
  const { pathname: previousPath } = useLocation()
  const history = useHistory()

  const preferenceOption = useRef('')

  const handleOpenPreferences = useCallback(
    screen => {
      preferenceOption.current = screen
      const fullPath = previousPath + getPreferencesSearch(screen)
      history.push(fullPath)
    },
    [history, previousPath]
  )

  const handleClosePreferences = useCallback(() => {
    preferenceOption.current = ''
    history.push(previousPath)
  }, [history, previousPath])

  return [
    handleOpenPreferences,
    handleClosePreferences,
    preferenceOption.current,
  ]
}
