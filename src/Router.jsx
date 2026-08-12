import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root";
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
import VerifyEmail, {
  loader as verifyEmailLoader,
} from "./account/VerifyEmail";
import VerifyEmailByCode from "./account/VerifyEmailByCode";
import {
  AnonymousRoute,
  AuthChangeRedirector,
  AuthenticatedRoute,
  ACCOUNT_PATHS,
} from "./auth";
import { useConfig } from "./auth/hooks";
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
import RecoveryCodes, {
  loader as recoveryCodesLoader,
} from "./mfa/RecoveryCodes";
import SignupByPasskey from "./mfa/SignupByPasskey";
import Trust from "./mfa/Trust";
import ManageProviders from "./socialaccount/ManageProviders";
import ProviderCallback from "./socialaccount/ProviderCallback";
import ProviderSignup from "./socialaccount/ProviderSignup";
import Sessions from "./usersessions/Sessions";

function createRouter(config) {
  return createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthChangeRedirector>
          <Root />
        </AuthChangeRedirector>
      ),
      children: [
        {
          path: ACCOUNT_PATHS.LOGIN,
          element: (
            <AnonymousRoute>
              <Login />
            </AnonymousRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.LOGIN_CODE,
          element: (
            <AnonymousRoute>
              <RequestLoginCode />
            </AnonymousRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.LOGIN_CODE_CONFIRM,
          element: (
            <AnonymousRoute>
              <ConfirmLoginCode />
            </AnonymousRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.EMAIL,
          element: (
            <AuthenticatedRoute>
              <ChangeEmail />
            </AuthenticatedRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.LOGOUT,
          element: <Logout />,
        },
        {
          path: ACCOUNT_PATHS.PROVIDER_CALLBACK,
          element: <ProviderCallback />,
        },
        {
          path: ACCOUNT_PATHS.PROVIDER_SIGNUP,
          element: (
            <AnonymousRoute>
              <ProviderSignup />
            </AnonymousRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.PROVIDERS,
          element: (
            <AuthenticatedRoute>
              <ManageProviders />
            </AuthenticatedRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.SIGNUP,
          element: (
            <AnonymousRoute>
              <Signup />
            </AnonymousRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.SIGNUP_PASSKEY,
          element: (
            <AnonymousRoute>
              <SignupByPasskey />
            </AnonymousRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.SIGNUP_PASSKEY_CREATE,
          element: (
            <AnonymousRoute>
              <CreateSignupPasskey />
            </AnonymousRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.VERIFY_EMAIL,
          element: config.data.account.email_verification_by_code_enabled ? (
            <VerifyEmailByCode />
          ) : (
            <VerificationEmailSent />
          ),
        },
        {
          path: ACCOUNT_PATHS.VERIFY_EMAIL_KEY,
          element: <VerifyEmail />,
          loader: verifyEmailLoader,
        },
        {
          path: ACCOUNT_PATHS.PASSWORD_RESET,
          element: (
            <AnonymousRoute>
              <RequestPasswordReset />
            </AnonymousRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.PASSWORD_RESET_CONFIRM,
          element: (
            <AnonymousRoute>
              <ConfirmPasswordResetCode />
            </AnonymousRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.PASSWORD_RESET_COMPLETE,
          element: (
            <AnonymousRoute>
              <ResetPasswordByCode />
            </AnonymousRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.PASSWORD_RESET_KEY,
          element: (
            <AnonymousRoute>
              <ResetPasswordByLink />
            </AnonymousRoute>
          ),
          loader: resetPasswordByLinkLoader,
        },
        {
          path: ACCOUNT_PATHS.PASSWORD_CHANGE,
          element: (
            <AuthenticatedRoute>
              <ChangePassword />
            </AuthenticatedRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.MFA,
          element: (
            <AuthenticatedRoute>
              <MFAOverview />
            </AuthenticatedRoute>
          ),
          loader: mfaOverviewLoader,
        },
        {
          path: ACCOUNT_PATHS.REAUTHENTICATE,
          element: (
            <AuthenticatedRoute>
              <Reauthenticate />
            </AuthenticatedRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.REAUTHENTICATE_TOTP,
          element: (
            <AuthenticatedRoute>
              <ReauthenticateTOTP />
            </AuthenticatedRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.REAUTHENTICATE_RECOVERY_CODES,
          element: (
            <AuthenticatedRoute>
              <ReauthenticateRecoveryCodes />
            </AuthenticatedRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.REAUTHENTICATE_WEBAUTHN,
          element: (
            <AuthenticatedRoute>
              <ReauthenticateWebAuthn />
            </AuthenticatedRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.AUTHENTICATE_TOTP,
          element: (
            <AnonymousRoute>
              <AuthenticateTOTP />
            </AnonymousRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.MFA_TRUST,
          element: (
            <AnonymousRoute>
              <Trust />
            </AnonymousRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.AUTHENTICATE_RECOVERY_CODES,
          element: (
            <AnonymousRoute>
              <AuthenticateRecoveryCodes />
            </AnonymousRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.AUTHENTICATE_WEBAUTHN,
          element: (
            <AnonymousRoute>
              <AuthenticateWebAuthn />
            </AnonymousRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.MFA_TOTP_ACTIVATE,
          element: (
            <AuthenticatedRoute>
              <ActivateTOTP />
            </AuthenticatedRoute>
          ),
          loader: activateTOTPLoader,
        },
        {
          path: ACCOUNT_PATHS.MFA_TOTP_DEACTIVATE,
          element: (
            <AuthenticatedRoute>
              <DeactivateTOTP />
            </AuthenticatedRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.MFA_RECOVERY_CODES,
          element: (
            <AuthenticatedRoute>
              <RecoveryCodes />
            </AuthenticatedRoute>
          ),
          loader: recoveryCodesLoader,
        },
        {
          path: ACCOUNT_PATHS.MFA_RECOVERY_CODES_GENERATE,
          element: (
            <AuthenticatedRoute>
              <GenerateRecoveryCodes />
            </AuthenticatedRoute>
          ),
          loader: generateRecoveryCodesLoader,
        },
        {
          path: ACCOUNT_PATHS.MFA_WEBAUTHN,
          element: (
            <AuthenticatedRoute>
              <ListWebAuthn />
            </AuthenticatedRoute>
          ),
          loader: listWebAuthnLoader,
        },
        {
          path: ACCOUNT_PATHS.MFA_WEBAUTHN_ADD,
          element: (
            <AuthenticatedRoute>
              <AddWebAuthn />
            </AuthenticatedRoute>
          ),
        },
        {
          path: ACCOUNT_PATHS.SESSIONS,
          element: (
            <AuthenticatedRoute>
              <Sessions />
            </AuthenticatedRoute>
          ),
        },
      ],
    },
  ]);
}

export default function Router() {
  // If we create the router globally, the loaders of the routes already trigger
  // even before the <AuthContext/> trigger the initial loading of the auth.
  // state.
  const [router, setRouter] = useState(null);
  const config = useConfig();
  useEffect(() => {
    setRouter(createRouter(config));
  }, [config]);
  return router ? <RouterProvider router={router} /> : null;
}
