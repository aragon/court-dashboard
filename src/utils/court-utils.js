function getFirstTermDate(courtConfig) {
  const { terms } = courtConfig
  return terms[0].startTime * 1000
}

export function getTermStartTime(term, courtConfig) {
  const { termDuration } = courtConfig
  const termMs = term * termDuration

  return getFirstTermDate(courtConfig) + termMs
}
