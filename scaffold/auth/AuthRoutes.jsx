import { Route } from "react-router-dom";
import ChangeEmail from "./account/ChangeEmail";
import ChangePassword from "./account/ChangePassword";
import ConfirmLoginCode from "./account/ConfirmLoginCode";
import ConfirmPasswordResetCode from "./account/ConfirmPasswordResetCode";
import Login from "./account/Login";
import Logout from "./account/Logout";
import Reauthenticate from "./account/Reauthenticate";
import RequestLoginCode from "./account/RequestLoginCode";
import RequestPasswordReset from "./account/RequestPasswordReset";
import {
  ResetPasswordByCode,
  ResetPasswordByLink,
  resetPasswordByLinkLoader,
} from "./account/ResetPassword";
import Signup from "./account/Signup";
import VerificationEmailSent from "./account/VerificationEmailSent";
import VerifyEmail, { loader as verifyEmailLoader } from "./account/VerifyEmail";
import VerifyEmailByCode from "./account/VerifyEmailByCode";
import {
  AnonymousRoute,
  AuthenticatedRoute,
} from "openbase-auth-client/auth";
import ActivateTOTP, { loader as activateTOTPLoader } from "./mfa/ActivateTOTP";
import AddWebAuthn from "./mfa/AddWebAuthn";
import AuthenticateRecoveryCodes from "./mfa/AuthenticateRecoveryCodes";
import AuthenticateTOTP from "./mfa/AuthenticateTOTP";
import AuthenticateWebAuthn from "./mfa/AuthenticateWebAuthn";
import CreateSignupPasskey from "./mfa/CreateSignupPasskey";
import DeactivateTOTP from "./mfa/DeactivateTOTP";
import GenerateRecoveryCodes, {
  loader as generateRecoveryCodesLoader,
} from "./mfa/GenerateRecoveryCodes";
import ListWebAuthn, { loader as listWebAuthnLoader } from "./mfa/ListWebAuthn";
import MFAOverview, { loader as mfaOverviewLoader } from "./mfa/MFAOverview";
import ReauthenticateRecoveryCodes from "./mfa/ReauthenticateRecoveryCodes";
import ReauthenticateTOTP from "./mfa/ReauthenticateTOTP";
import ReauthenticateWebAuthn from "./mfa/ReauthenticateWebAuthn";
import RecoveryCodes, { loader as recoveryCodesLoader } from "./mfa/RecoveryCodes";
import SignupByPasskey from "./mfa/SignupByPasskey";
import Trust from "./mfa/Trust";
import ManageProviders from "./socialaccount/ManageProviders";
import ProviderCallback from "./socialaccount/ProviderCallback";
import ProviderSignup from "./socialaccount/ProviderSignup";
import Sessions from "./usersessions/Sessions";

export function createAuthRoutes(config) {
  return (
    <>
      <Route
        path="/account/login"
        element={
          <AnonymousRoute>
            <Login />
          </AnonymousRoute>
        }
      />
      <Route
        path="/account/login/code"
        element={
          <AnonymousRoute>
            <RequestLoginCode />
          </AnonymousRoute>
        }
      />
      <Route
        path="/account/login/code/confirm"
        element={
          <AnonymousRoute>
            <ConfirmLoginCode />
          </AnonymousRoute>
        }
      />
      <Route
        path="/account/email"
        element={
          <AuthenticatedRoute>
            <ChangeEmail />
          </AuthenticatedRoute>
        }
      />
      <Route path="/account/logout" element={<Logout />} />
      <Route path="/account/provider/callback" element={<ProviderCallback />} />
      <Route
        path="/account/provider/signup"
        element={
          <AnonymousRoute>
            <ProviderSignup />
          </AnonymousRoute>
        }
      />
      <Route
        path="/account/providers"
        element={
          <AuthenticatedRoute>
            <ManageProviders />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/account/signup"
        element={
          <AnonymousRoute>
            <Signup />
          </AnonymousRoute>
        }
      />
      <Route
        path="/account/signup/passkey"
        element={
          <AnonymousRoute>
            <SignupByPasskey />
          </AnonymousRoute>
        }
      />
      <Route
        path="/account/signup/passkey/create"
        element={
          <AnonymousRoute>
            <CreateSignupPasskey />
          </AnonymousRoute>
        }
      />
      <Route
        path="/account/verify-email"
        element={
          config.data.account.email_verification_by_code_enabled ? (
            <VerifyEmailByCode />
          ) : (
            <VerificationEmailSent />
          )
        }
      />
      <Route
        path="/account/verify-email/:key"
        element={<VerifyEmail />}
        loader={verifyEmailLoader}
      />
      <Route
        path="/account/password/reset"
        element={
          <AnonymousRoute>
            <RequestPasswordReset />
          </AnonymousRoute>
        }
      />
      <Route
        path="/account/password/reset/confirm"
        element={
          <AnonymousRoute>
            <ConfirmPasswordResetCode />
          </AnonymousRoute>
        }
      />
      <Route
        path="/account/password/reset/complete"
        element={
          <AnonymousRoute>
            <ResetPasswordByCode />
          </AnonymousRoute>
        }
      />
      <Route
        path="/account/password/reset/key/:key"
        element={
          <AnonymousRoute>
            <ResetPasswordByLink />
          </AnonymousRoute>
        }
        loader={resetPasswordByLinkLoader}
      />
      <Route
        path="/account/password/change"
        element={
          <AuthenticatedRoute>
            <ChangePassword />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/account/2fa"
        element={
          <AuthenticatedRoute>
            <MFAOverview />
          </AuthenticatedRoute>
        }
        loader={mfaOverviewLoader}
      />
      <Route
        path="/account/reauthenticate"
        element={
          <AuthenticatedRoute>
            <Reauthenticate />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/account/reauthenticate/totp"
        element={
          <AuthenticatedRoute>
            <ReauthenticateTOTP />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/account/reauthenticate/recovery-codes"
        element={
          <AuthenticatedRoute>
            <ReauthenticateRecoveryCodes />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/account/reauthenticate/webauthn"
        element={
          <AuthenticatedRoute>
            <ReauthenticateWebAuthn />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/account/2fa/webauthn/add"
        element={
          <AuthenticatedRoute>
            <AddWebAuthn />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/account/2fa/webauthn"
        element={
          <AuthenticatedRoute>
            <ListWebAuthn />
          </AuthenticatedRoute>
        }
        loader={listWebAuthnLoader}
      />
      <Route
        path="/account/2fa/totp/activate"
        element={
          <AuthenticatedRoute>
            <ActivateTOTP />
          </AuthenticatedRoute>
        }
        loader={activateTOTPLoader}
      />
      <Route
        path="/account/2fa/totp/deactivate"
        element={
          <AuthenticatedRoute>
            <DeactivateTOTP />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/account/2fa/recovery-codes"
        element={
          <AuthenticatedRoute>
            <RecoveryCodes />
          </AuthenticatedRoute>
        }
        loader={recoveryCodesLoader}
      />
      <Route
        path="/account/2fa/recovery-codes/generate"
        element={
          <AuthenticatedRoute>
            <GenerateRecoveryCodes />
          </AuthenticatedRoute>
        }
        loader={generateRecoveryCodesLoader}
      />
      <Route
        path="/account/authenticate/totp"
        element={<AuthenticateTOTP />}
      />
      <Route
        path="/account/authenticate/recovery-codes"
        element={<AuthenticateRecoveryCodes />}
      />
      <Route
        path="/account/authenticate/webauthn"
        element={<AuthenticateWebAuthn />}
      />
      <Route
        path="/account/trust"
        element={<Trust />}
      />
      <Route
        path="/account/sessions"
        element={
          <AuthenticatedRoute>
            <Sessions />
          </AuthenticatedRoute>
        }
      />
    </>
  );
}
