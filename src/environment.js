const DEFAULT_CHAIN_ID = 4 // rinkeby

const envVars = {
  CHAIN_ID: parseInt(process.env.REACT_APP_CHAIN_ID) || DEFAULT_CHAIN_ID, // TODO: Find a way to remove REACT_APP prefix
}

export const DEFAULT_LOCAL_CHAIN = 'rpc'

export default function environment(name) {
  const envVar = envVars[name]
  if (!envVar) {
    return null
  }
  return envVar
}
