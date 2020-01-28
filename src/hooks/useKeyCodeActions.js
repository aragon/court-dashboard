import { useCallback, useMemo, useEffect, useState } from 'react'
import { saveAs } from 'file-saver'
import { generateRandomNumber } from '../lib/math-utils'
import { dateFormat } from '../utils/date-utils'

export default function useKeyCodeActions() {
  const [keyCode, setKeyCode] = useState('')

  useEffect(() => {
    setKeyCode(generateRandomNumber())
  }, [])

  const downloadKeyCode = useCallback(() => {
    const today = dateFormat(Date.now(), 'YYYY-MM-DDTHH:mm:ssZ')
    const blob = new Blob([JSON.stringify(keyCode)])
    saveAs(blob, `court-commit-code_${today}.json`)
  }, [keyCode])

  return useMemo(() => {
    return { keyCode, downloadKeyCode }
  }, [downloadKeyCode, keyCode])
}
