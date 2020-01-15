import dayjs from 'dayjs'

export function getTermStartDate(termId, terms, termDuration) {
  const totalSecondsTillTerm = termId * termDuration
  const firstTermStartTime = parseInt(terms[0].startTime, 10)

  return new Date((firstTermStartTime + totalSecondsTillTerm) * 1000)
}

export function getCurrentTermId(now, terms, termDuration) {
  let currentTermId = 0

  if (terms.length > 0) {
    const firstTermStartTime = parseInt(terms[0].startTime, 10)

    currentTermId = Math.floor(
      (dayjs(now).unix() - firstTermStartTime) / termDuration
    )
  }

  return currentTermId
}

export function getTermStartAndEndTime(termId, terms, termDuration) {
  let [termStartTime, termEndTime] = [0, 0]

  if (terms.length > 0) {
    const firstTermStartTime = parseInt(terms[0].startTime, 10)
    termStartTime = termId * termDuration + firstTermStartTime
    termEndTime = termStartTime + (termDuration - 1)
  }

  return { termStartTime, termEndTime }
}
