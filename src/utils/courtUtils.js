function getFirstTermDate(courtSettings) {
  const { terms } = courtSettings
  return terms[0].startTime * 1000
}

export function getTermStartTime(term, courtSettings) {
  const { termDuration } = courtSettings
  const termMs = term * termDuration

  return getFirstTermDate(courtSettings) + termMs
}
