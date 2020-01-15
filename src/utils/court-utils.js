export function getTermStartDate(termId, terms, termDuration) {
  const totalSecondsTillTerm = termId * termDuration
  const firstTermStartTime = parseInt(terms[0].startTime, 10)

  return new Date((firstTermStartTime + totalSecondsTillTerm) * 1000)
}
