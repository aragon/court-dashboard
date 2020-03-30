import { CourtModuleType } from '../types/court-module-types'
import { bigNum } from '../lib/math-utils'
import { transformSubscriptionModuleDataAttributes } from './subscription-utils'

export function transformCourtConfigDataAttributes(courtConfig) {
  const { subscriptions: subscriptionModule } = courtConfig
  return {
    ...courtConfig,
    draftFee: bigNum(courtConfig.draftFee),
    settleFee: bigNum(courtConfig.settleFee),
    jurorFee: bigNum(courtConfig.jurorFee),
    minActiveBalance: bigNum(courtConfig.minActiveBalance),
    maxRegularAppealRounds: parseInt(courtConfig.maxRegularAppealRounds, 10),
    termDuration: parseInt(courtConfig.termDuration, 10) * 1000,
    currentTerm: parseInt(courtConfig.currentTerm, 10),
    evidenceTerms: parseInt(courtConfig.evidenceTerms, 10),
    commitTerms: parseInt(courtConfig.commitTerms, 10),
    revealTerms: parseInt(courtConfig.revealTerms, 10),
    appealTerms: parseInt(courtConfig.appealTerms, 10),
    appealConfirmationTerms: parseInt(courtConfig.appealConfirmationTerms, 10),
    terms: courtConfig.terms.map(term => ({
      ...term,
      startTime: parseInt(term.startTime, 10) * 1000,
    })),
    subscriptionModule: transformSubscriptionModuleDataAttributes(
      subscriptionModule
    ),
  }
}

function getFirstTermDate(courtConfig) {
  const { terms } = courtConfig
  return terms[0].startTime
}

export function getTermStartTime(term, courtConfig) {
  const { termDuration } = courtConfig
  const termMs = term * termDuration

  return getFirstTermDate(courtConfig) + termMs
}

export function getExpectedCurrentTermId(now, terms, termDuration) {
  let currentTermId = 0

  if (terms.length > 0) {
    const firstTermStartTime = terms[0].startTime

    currentTermId = Math.floor(
      (now.valueOf() - firstTermStartTime) / termDuration
    )
  }

  return currentTermId
}

export function getTermStartAndEndTime(termId, terms, termDuration) {
  let [termStartTime, termEndTime] = [0, 0]

  if (terms.length > 0) {
    const firstTermStartTime = terms[0].startTime
    termStartTime = termId * termDuration + firstTermStartTime
    termEndTime = termStartTime + (termDuration - 1)
  }

  return { termStartTime, termEndTime }
}

export function getModuleAddress(modules, moduleType) {
  const courtModule = modules.find(
    mod => CourtModuleType[mod.type] === moduleType
  )

  return courtModule ? courtModule.address : null
}
