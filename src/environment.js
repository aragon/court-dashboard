// rinkeby
const CHAIN_ID_DEFAULT = 4

// TODO: Find a way to remove REACT_APP prefix
const ENV_VARS = {
  CHAIN_ID: () => {
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID)
    return isNaN(chainId) ? CHAIN_ID_DEFAULT : chainId
  },
  SENTRY_DSN: () => {
    const dsn = process.env.REACT_APP_SENTRY_DSN || ''
    return dsn.trim()
  },
  BUILD: () => {
    return process.env.REACT_APP_BUILD || 'undefined'
  },
}

export default function environment(name) {
  const envVar = ENV_VARS[name]
  return typeof envVar === 'function' ? envVar() : null
}

export const DEFAULT_LOCAL_CHAIN = 'rpc'
