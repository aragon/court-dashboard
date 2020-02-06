export const retryMax = async (callback, maxAttempts = 5) => {
  let retryNum = 0

  const attempt = async () => {
    try {
      return await callback()
    } catch (err) {
      if (retryNum === maxAttempts) {
        throw err
      }
      ++retryNum

      console.log(`Retrying attempt #${retryNum}...`)
      return attempt()
    }
  }

  return attempt()
}
