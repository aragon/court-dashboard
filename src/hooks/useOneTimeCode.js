import { useCallback, useState } from 'react'
import { saveAs } from 'file-saver'
import { generateRandomNumber } from '../lib/math-utils'
import { dateFormat } from '../utils/date-utils'

export default function useOneTimeCode() {
  const [code] = useState(generateRandomNumber)

  const download = useCallback(() => {
    const today = dateFormat(Date.now(), 'iso')
    const blob = new Blob([JSON.stringify(code)])
    saveAs(blob, `court-commit-code_${today}.json`)
  }, [code])

  return { oneTimeCode: code, download }
}
