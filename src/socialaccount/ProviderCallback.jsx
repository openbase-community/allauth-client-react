import {
  Navigate,
  useLocation,
  Link
} from 'react-router-dom'
import { URLs, isServerPath, pathForPendingFlow, safeRedirectPath, useAuthStatus } from '../auth'

export default function ProviderCallback () {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const error = params.get('error')
  const next = params.get('next')
  const [auth, status] = useAuthStatus()

  let url = URLs.LOGIN_URL
  if (status.isAuthenticated) {
    url = safeRedirectPath(next)
  } else {
    url = pathForPendingFlow(auth) || url
  }
  if (isServerPath(url)) {
    window.location.assign(url)
    return null
  }
  if (!error) {
    return <Navigate to={url} />
  }
  return (
    <>
      <h1>Third-Party Login Failure</h1>
      <p>Something went wrong.</p>
      <Link to={url}>Continue</Link>
    </>
  )
}
