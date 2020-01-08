const DEFAULT_CHAIN_ID = 1337 // rpc
const envVars = {
  CHAIN_ID: process.env.CHAIN_ID || DEFAULT_CHAIN_ID,
}

export default function environment(name) {
  const envVar = envVars[name]
  if (!envVar) {
    return null
  }
  return envVar
}
