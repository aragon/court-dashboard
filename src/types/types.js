export const Status = {
  Open: Symbol('Open'),
  Closed: Symbol('Closed'),
}

export const Phase = {
  All: Symbol('All'),
  Invalid: Symbol('Invalid'),
  Adjudicating: Symbol('Adjudicating'),
  Ruled: Symbol('Ruled'),
  Evidence: Symbol('Evidence submission'),
  JuryDrafting: Symbol('Jury drafting'),
  VotingPeriod: Symbol('Voting period'),
  RevealVote: Symbol('Reveal vote'),
  AppealRuling: Symbol('Appealing'),
  ConfirmAppeal: Symbol('ConfirmingAppeal'),
  ClaimRewards: Symbol('Claim rewards'),
  Ended: Symbol('Ended'),
  ExecuteRuling: Symbol('Execute Ruling'),
}

const stringMapping = {
  [Status.Open]: 'Open',
  [Status.Closed]: 'Closed',
  [Phase.All]: 'All',
  [Phase.Evidence]: 'Evidence submission',
  [Phase.JuryDrafting]: 'Jury drafting',
  [Phase.VotingPeriod]: 'Voting period',
  [Phase.RevealVote]: 'Reveal vote',
  [Phase.AppealRuling]: 'Appeal ruling',
  [Phase.ConfirmAppeal]: 'Confirm appeal',
  [Phase.ClaimRewards]: 'Claim rewards',
  [Phase.Invalid]: 'Invalid',
  [Phase.Ended]: 'Ended',
  [Phase.ExecuteRuling]: 'Execute Ruling',
}

const symbolMapping = {
  All: Phase.All,
  Invalid: Phase.Invalid,
  Committing: Phase.VotingPeriod,
  Revealing: Phase.RevealVote,
  Drafting: Phase.JuryDrafting,
  Adjudicating: Phase.Adjudicating,
  Ruled: Phase.Ruled,
  Evidence: Phase.Evidence,
}

export function convertFromString(str) {
  return symbolMapping[str]
}

export function convertToString(symbol) {
  return stringMapping[symbol]
}
