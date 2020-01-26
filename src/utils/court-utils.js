import dayjs from 'dayjs'
import { bigNum } from '../lib/math-utils'

function getFirstTermDate(courtConfig) {
  const { terms } = courtConfig
  return terms[0].startTime
}

export function getTermStartTime(term, courtConfig) {
  const { termDuration } = courtConfig
  const termMs = term * termDuration

  return getFirstTermDate(courtConfig) + termMs
}

export function getCurrentTermId(now, terms, termDuration) {
  let currentTermId = 0

  if (terms.length > 0) {
    const firstTermStartTime = parseInt(terms[0].startTime, 10)

    currentTermId = Math.floor((dayjs(now) - firstTermStartTime) / termDuration)
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

export function getVoteId(disputeId, roundId) {
  return bigNum(disputeId)
    .shln(128)
    .add(bigNum(roundId))
}
