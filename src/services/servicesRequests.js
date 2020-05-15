import { courtServerEndpoint } from '../endpoints'
import {
  FORBIDDEN_RESPONSE,
  UNAUTHORIZED_RESPONSE,
  USER_NOT_FOUND,
} from './responseCodes'

const COURT_SERVER_ENDPOINT = courtServerEndpoint()

export async function createSession(address, signature, timestamp) {
  const endpoint = `${COURT_SERVER_ENDPOINT}/users/${address}/sessions`

  try {
    const rawResponse = await fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ signature, timestamp }),
    })

    const jsonResponse = await rawResponse.json()

    if (rawResponse.ok) {
      return {
        authenticated: jsonResponse?.authenticated,
        error: null,
      }
    }

    const errors = jsonResponse.errors
      .map(err => Object.values(err).join(', '))
      .join(', ')

    return {
      error: errors,
    }
  } catch (err) {
    console.error(err)
    return { error: err }
  }
}

export async function subscribeToNotifications(address, email) {
  const endpoint = `${COURT_SERVER_ENDPOINT}/users/${address}/email`

  try {
    const rawResponse = await fetch(endpoint, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const jsonResponse = await rawResponse.json()

    if (rawResponse.ok) {
      return {
        subscribedEmail: jsonResponse?.email,
        sent: jsonResponse?.sent,
        error: null,
      }
    }

    const errors = jsonResponse.errors
      .map(err => Object.values(err).join(', '))
      .join(', ')

    return {
      needsSignature:
        rawResponse.status === UNAUTHORIZED_RESPONSE ||
        rawResponse.status === USER_NOT_FOUND ||
        rawResponse.status === FORBIDDEN_RESPONSE,
      error: errors,
    }
  } catch (err) {
    console.error(err)
    return { error: err }
  }
}

export async function switchNotificationsStatus(address, disabled) {
  const endpoint = `${COURT_SERVER_ENDPOINT}/users/${address}/notifications`

  try {
    const rawResponse = await fetch(endpoint, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ disabled }),
    })

    const jsonResponse = await rawResponse.json()

    if (rawResponse.ok) {
      return {
        disabled: jsonResponse?.disabled,
        error: null,
      }
    }

    const errors = jsonResponse.errors
      .map(err => Object.values(err).join(', '))
      .join(', ')

    return {
      needsSignature:
        rawResponse.status === UNAUTHORIZED_RESPONSE ||
        rawResponse.status === USER_NOT_FOUND ||
        rawResponse.status === FORBIDDEN_RESPONSE,
      error: errors,
    }
  } catch (err) {
    console.error(err)
    return { error: err }
  }
}

export async function getJurorEmail(address) {
  const endpoint = `${COURT_SERVER_ENDPOINT}/users/${address}/email`

  try {
    const rawResponse = await fetch(endpoint, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const jsonResponse = await rawResponse.json()

    if (rawResponse.ok) {
      return {
        email: jsonResponse?.email,
        error: null,
      }
    }

    const errors = jsonResponse.errors
      .map(err => Object.values(err).join(', '))
      .join(', ')

    return {
      needsSignature:
        rawResponse.status === UNAUTHORIZED_RESPONSE ||
        rawResponse.status === USER_NOT_FOUND ||
        rawResponse.status === FORBIDDEN_RESPONSE,
      error: errors,
    }
  } catch (err) {
    console.error(err)
    return { error: err }
  }
}

export async function resendVerificationEmail(address) {
  const endpoint = `${COURT_SERVER_ENDPOINT}/users/${address}/email:resend`

  try {
    const rawResponse = await fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const jsonResponse = await rawResponse.json()

    if (rawResponse.ok) {
      return {
        sent: jsonResponse?.sent,
        error: null,
      }
    }

    const errors = jsonResponse.errors
      .map(err => Object.values(err).join(', '))
      .join(', ')

    return {
      needsSignature:
        rawResponse.status === UNAUTHORIZED_RESPONSE ||
        rawResponse.status === USER_NOT_FOUND ||
        rawResponse.status === FORBIDDEN_RESPONSE,
      error: errors,
    }
  } catch (err) {
    console.error(err)
    return { error: err }
  }
}

export async function subscribeExistingEmail(address) {
  const { email, error, needsSignature } = await getJurorEmail(address)

  if (needsSignature) {
    return { needsSignature, email }
  }
  if (error) {
    return { error }
  }
  const { sent, error: errorReSending } = await resendVerificationEmail(address)

  return { email, sent, error: errorReSending }
}

export async function deleteJurorEmail(address) {
  const endpoint = `${COURT_SERVER_ENDPOINT}/users/${address}/email`

  try {
    const rawResponse = await fetch(endpoint, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const jsonResponse = await rawResponse.json()

    if (rawResponse.ok) {
      return {
        deleted: jsonResponse?.deleted,
        error: null,
      }
    }

    const errors = jsonResponse.errors
      .map(err => Object.values(err).join(', '))
      .join(', ')

    return {
      needsSignature:
        rawResponse.status === UNAUTHORIZED_RESPONSE ||
        rawResponse.status === USER_NOT_FOUND ||
        rawResponse.status === FORBIDDEN_RESPONSE,
      error: errors,
    }
  } catch (err) {
    console.error(err)
    return { error: err }
  }
}

export async function deleteCurrentSession(address) {
  const endpoint = `${COURT_SERVER_ENDPOINT}/users/${address}/sessions:current`

  try {
    const rawResponse = await fetch(endpoint, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const jsonResponse = await rawResponse.json()

    if (rawResponse.ok) {
      return {
        deleted: jsonResponse?.deleted,
        error: null,
      }
    }

    const errors = jsonResponse.errors
      .map(err => Object.values(err).join(', '))
      .join(', ')

    return {
      needsSignature:
        rawResponse.status === UNAUTHORIZED_RESPONSE ||
        rawResponse.status === USER_NOT_FOUND ||
        rawResponse.status === FORBIDDEN_RESPONSE,
      error: errors,
    }
  } catch (err) {
    console.error(err)
    return { error: err }
  }
}

export async function verifyJurorEmail(address, token) {
  const endpoint = `${COURT_SERVER_ENDPOINT}/users/${address}/email:verify`

  try {
    const rawResponse = await fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })

    const jsonResponse = await rawResponse.json()

    if (rawResponse.ok) {
      return {
        verified: jsonResponse?.verified,
        error: null,
      }
    }

    const errors = jsonResponse.errors
      .map(err => Object.values(err).join(', '))
      .join(', ')

    return {
      error: errors,
    }
  } catch (err) {
    console.error(err)
    return { error: err }
  }
}

export async function getSubscriptionDetails(address) {
  const endpoint = `${COURT_SERVER_ENDPOINT}/users/${address}`

  try {
    const rawResponse = await fetch(endpoint, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const jsonResponse = await rawResponse.json()

    if (rawResponse.ok) {
      return {
        addressVerified: jsonResponse?.addressVerified,
        emailExists: jsonResponse?.emailExists,
        emailVerified: jsonResponse?.emailVerified,
        notificationsDisabled: jsonResponse?.notificationsDisabled,
        error: null,
      }
    }

    const errors = jsonResponse.errors
      .map(err => Object.values(err).join(', '))
      .join(', ')

    return {
      error: errors,
    }
  } catch (err) {
    console.error(err)
    return { error: err }
  }
}
