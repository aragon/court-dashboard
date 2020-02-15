export function saveCodeInLocalStorage(
  connectedAccount,
  disputeId,
  oneTimeCode
) {
  localStorage.setItem(
    `oneTimeCode:${connectedAccount}:${disputeId}`,
    oneTimeCode
  )
}

export function getCodeFromLocalStorage(connectedAccount, disputeId) {
  return localStorage.getItem(`oneTimeCode:${connectedAccount}:${disputeId}`)
}

export function removeCodeFromLocalStorage(connectedAccount, disputeId) {
  localStorage.removeItem(`oneTimeCode:${connectedAccount}:${disputeId}`)
}
