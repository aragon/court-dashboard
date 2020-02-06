import { useCallback, useState, useMemo } from 'react'

export function useSidePanel() {
  const [visible, setVisible] = useState(false)
  const [opened, setOpened] = useState(false)

  const requestOpen = useCallback(() => {
    setVisible(true)
    setOpened(false)
  }, [])

  const endTransition = setOpened

  const requestClose = useCallback(() => {
    setVisible(false)
    setOpened(false)
  }, [setVisible, setOpened])

  return useMemo(() => {
    return {
      visible,
      opened,
      requestOpen,
      endTransition,
      requestClose,
    }
  }, [endTransition, opened, requestClose, requestOpen, visible])
}
