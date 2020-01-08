function getFirstTermDate(courtSettings) {
  const { terms } = courtSettings
  return terms[0].startTime
}

export function getTermStartDate(term, courtSettings) {
  const { termDuration } = courtSettings
  const termsSeconds = term * termDuration

  return getFirstTermDate(courtSettings) + termsSeconds
}
