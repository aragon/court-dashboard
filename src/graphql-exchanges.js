import { fetchExchange } from 'urql'

// Default exchanges
const DEFAULT_FETCH_EXCHANGE = fetchExchange

export function getFetchExchange() {
  return DEFAULT_FETCH_EXCHANGE
}
