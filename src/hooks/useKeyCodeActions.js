import { useCallback } from 'react'
// import { saveAs } from 'file-saver'
import { generateRandomNumber } from '../lib/math-utils'
// import { dateFormat } from '../utils/date-utils'

export default function useKeyCodeActions() {
  //   const [keyCode, setKeyCode] = useState('')

  const generateKeyCode = useCallback(() => {
    const num = generateRandomNumber()
    return num
  }, [])

  const downloadKeyCode = useCallback(() => {
    // const today = dateFormat(Date.now(), 'YYYY-MM-DDTHH:mm:ssZ')
    // const blob = new Blob([JSON.stringify(keyCode)])
    // saveAs(blob, `court-commit-code_${today}.json`)
  }, [])
  return { generateKeyCode, downloadKeyCode }
}
