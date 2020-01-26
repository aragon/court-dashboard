import { useCallback, useState, useMemo } from 'react'

let lastUseSide = {}
export function useSidePanel() {
  const [visible, setVisible] = useState(false)
  const [opened, setOpened] = useState(false)

  const requestOpen = useCallback(() => {
    setVisible(true)
    setOpened(false)
  }, [])

  const endTransition = useCallback(() => {
    return setOpened
  }, [setOpened])

  const requestClose = useCallback(() => {
    setVisible(false)
    setOpened(false)
  }, [setVisible, setOpened])

  console.log(
    'SIDE EQ ',
    visible === lastUseSide.visible,
    opened === lastUseSide.opened,
    requestOpen === lastUseSide.requestOpen,
    endTransition === lastUseSide.endTransition,
    requestClose === lastUseSide.requestClose
  )
  lastUseSide = { visible, opened, requestOpen, endTransition, requestClose }

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
