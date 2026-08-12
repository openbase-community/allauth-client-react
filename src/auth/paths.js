// Canonical source of truth for the frontend `/account/*` route paths.
//
// These strings are a cross-package, cross-repo contract. They must stay in
// sync across:
//   - this library's router (`src/Router.jsx`) and flow redirects
//     (`src/auth/routing.jsx` `flow2path`),
//   - the scaffold template (`scaffold/auth/AuthRoutes.jsx`),
//   - each consuming app's route table (e.g. openbase-cloud-web `src/App.tsx`),
//   - the backend `HEADLESS_FRONTEND_URLS` in openbase-drf-api-core
//     `config/settings.py` (which builds emailed verification / password-reset
//     links and OAuth-error redirects to these paths).
//
// Import from here instead of hardcoding path literals. A rename made here (and
// mirrored in the backend `{key}` templates) propagates everywhere at once,
// rather than silently diverging and breaking redirects or emailed links.
//
// Values use react-router pattern syntax (`:key`). The backend mirrors the two
// parameterized paths with `{key}` placeholders.
export const ACCOUNT_PATHS = Object.freeze({
  LOGIN: "/account/login",
  LOGIN_CODE: "/account/login/code",
  LOGIN_CODE_CONFIRM: "/account/login/code/confirm",
  EMAIL: "/account/email",
  LOGOUT: "/account/logout",
  PROVIDER_CALLBACK: "/account/provider/callback",
  PROVIDER_SIGNUP: "/account/provider/signup",
  PROVIDERS: "/account/providers",
  SIGNUP: "/account/signup",
  SIGNUP_PASSKEY: "/account/signup/passkey",
  SIGNUP_PASSKEY_CREATE: "/account/signup/passkey/create",
  VERIFY_EMAIL: "/account/verify-email",
  VERIFY_EMAIL_KEY: "/account/verify-email/:key",
  PASSWORD_RESET: "/account/password/reset",
  PASSWORD_RESET_CONFIRM: "/account/password/reset/confirm",
  PASSWORD_RESET_COMPLETE: "/account/password/reset/complete",
  PASSWORD_RESET_KEY: "/account/password/reset/key/:key",
  PASSWORD_CHANGE: "/account/password/change",
  MFA: "/account/2fa",
  REAUTHENTICATE: "/account/reauthenticate",
  REAUTHENTICATE_TOTP: "/account/reauthenticate/totp",
  REAUTHENTICATE_RECOVERY_CODES: "/account/reauthenticate/recovery-codes",
  REAUTHENTICATE_WEBAUTHN: "/account/reauthenticate/webauthn",
  AUTHENTICATE_TOTP: "/account/authenticate/totp",
  AUTHENTICATE_RECOVERY_CODES: "/account/authenticate/recovery-codes",
  AUTHENTICATE_WEBAUTHN: "/account/authenticate/webauthn",
  MFA_TRUST: "/account/2fa/trust",
  MFA_TOTP_ACTIVATE: "/account/2fa/totp/activate",
  MFA_TOTP_DEACTIVATE: "/account/2fa/totp/deactivate",
  MFA_RECOVERY_CODES: "/account/2fa/recovery-codes",
  MFA_RECOVERY_CODES_GENERATE: "/account/2fa/recovery-codes/generate",
  MFA_WEBAUTHN: "/account/2fa/webauthn",
  MFA_WEBAUTHN_ADD: "/account/2fa/webauthn/add",
  SESSIONS: "/account/sessions",
});

// Build a concrete URL for the two parameterized account routes.
export function verifyEmailPath(key) {
  return `/account/verify-email/${encodeURIComponent(key)}`;
}

export function passwordResetKeyPath(key) {
  return `/account/password/reset/key/${encodeURIComponent(key)}`;
}
