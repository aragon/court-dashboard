const httpRegex = /^https?:\/\//
const websocketRegex = /^wss?:\/\/.+/

export function validHttpFormat(uri) {
  return httpRegex.test(uri)
}

export function validWebSocketFormat(uri) {
  return websocketRegex.test(uri)
}
