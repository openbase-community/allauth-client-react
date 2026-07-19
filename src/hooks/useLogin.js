import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../lib/allauth'
import { pathForPendingFlow } from '../auth/routing'

// The headless allauth API only returns an `errors` array for field-level
// validation failures (HTTP 400). Every other failure — a 401 with no new
// pending flow, 409, 429, 500, or an unreachable server — has no `errors`,
// and the AuthChangeRedirector only navigates when the pending flow
// *changes*, so without a synthesized message the user would press "Sign in"
// and see nothing happen at all.
export function fallbackLoginErrors(content) {
  const status = content?.status
  let message
  switch (status) {
    case 401:
      message =
        'Sign-in failed. Your credentials were not accepted. Please try again, and contact support if the problem persists.'
      break
    case 409:
      message = 'You are already signed in. Refresh the page to continue.'
      break
    case 429:
      message = 'Too many sign-in attempts. Please wait a moment and try again.'
      break
    default:
      message = `Sign-in failed${status ? ` (status ${status})` : ''}. Please try again, and contact support if the problem persists.`
      break
  }
  return [{ message }]
}

export default function useLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [response, setResponse] = useState({ fetching: false, content: null })
  const navigate = useNavigate()

  const handleSubmit = useCallback(() => {
    setResponse(prev => ({ ...prev, fetching: true }))

    login({ email, password })
      .then((content) => {
        if (content.status !== 200 && !content.errors?.length) {
          // A 401 with a pending flow (e.g. email verification) needs the
          // user to complete that flow. The AuthChangeRedirector only reacts
          // when the pending flow changes, so a repeated attempt would
          // otherwise strand the user on the login page with no feedback.
          let pendingFlowPath = null
          try {
            pendingFlowPath = pathForPendingFlow(content)
          } catch {
            // Unknown flow — fall through to showing an error message.
          }
          if (pendingFlowPath) {
            setResponse(prev => ({ ...prev, content }))
            navigate(pendingFlowPath)
            return
          }
          content = { ...content, errors: fallbackLoginErrors(content) }
        }
        setResponse(prev => ({ ...prev, content }))
      })
      .catch((error) => {
        console.error(error)
        setResponse(prev => ({
          ...prev,
          content: {
            status: 0,
            errors: [
              {
                message:
                  'Unable to reach the sign-in service. Please check your connection and try again.'
              }
            ]
          }
        }))
      })
      .finally(() => {
        setResponse(prev => ({ ...prev, fetching: false }))
      })
  }, [email, password, navigate])

  const resetForm = useCallback(() => {
    setEmail('')
    setPassword('')
    setResponse({ fetching: false, content: null })
  }, [])

  return {
    email,
    setEmail,
    password,
    setPassword,
    response,
    handleSubmit,
    resetForm,
    isLoading: response.fetching,
    errors: response.content?.errors
  }
}
