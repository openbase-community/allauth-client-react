import { describe, expect, it } from "vitest";
import { AuthenticatorType, Flows } from "../src/lib/allauth";
import { ACCOUNT_PATHS } from "../src/auth/paths";
import { pathForFlow } from "../src/auth/routing";

// Guards the flow -> path contract that spans this library's router, the
// scaffold template, each consuming app's route table, and the backend
// HEADLESS_FRONTEND_URLS. If a flow starts redirecting somewhere no route is
// declared, that is a broken redirect / emailed link in production.

const declaredPaths = new Set(Object.values(ACCOUNT_PATHS));

describe("ACCOUNT_PATHS", () => {
  it("is frozen so consumers cannot mutate the shared contract", () => {
    expect(Object.isFrozen(ACCOUNT_PATHS)).toBe(true);
  });

  it("has no duplicate path strings", () => {
    const values = Object.values(ACCOUNT_PATHS);
    expect(new Set(values).size).toBe(values.length);
  });
});

describe("pathForFlow", () => {
  const cases = [
    [{ id: Flows.LOGIN }, ACCOUNT_PATHS.LOGIN],
    [{ id: Flows.LOGIN_BY_CODE }, ACCOUNT_PATHS.LOGIN_CODE_CONFIRM],
    [{ id: Flows.SIGNUP }, ACCOUNT_PATHS.SIGNUP],
    [{ id: Flows.VERIFY_EMAIL }, ACCOUNT_PATHS.VERIFY_EMAIL],
    [{ id: Flows.PASSWORD_RESET_BY_CODE }, ACCOUNT_PATHS.PASSWORD_RESET_CONFIRM],
    [{ id: Flows.PROVIDER_SIGNUP }, ACCOUNT_PATHS.PROVIDER_SIGNUP],
    [{ id: Flows.REAUTHENTICATE }, ACCOUNT_PATHS.REAUTHENTICATE],
    // Regression guard: the MFA trust flow must land on /account/2fa/trust,
    // the path the router/scaffold declare (a stale copy used /account/trust).
    [{ id: Flows.MFA_TRUST }, ACCOUNT_PATHS.MFA_TRUST],
    [{ id: Flows.MFA_WEBAUTHN_SIGNUP }, ACCOUNT_PATHS.SIGNUP_PASSKEY_CREATE],
    [
      { id: Flows.MFA_AUTHENTICATE, types: [AuthenticatorType.TOTP] },
      ACCOUNT_PATHS.AUTHENTICATE_TOTP,
    ],
    [
      { id: Flows.MFA_AUTHENTICATE, types: [AuthenticatorType.RECOVERY_CODES] },
      ACCOUNT_PATHS.AUTHENTICATE_RECOVERY_CODES,
    ],
    [
      { id: Flows.MFA_AUTHENTICATE, types: [AuthenticatorType.WEBAUTHN] },
      ACCOUNT_PATHS.AUTHENTICATE_WEBAUTHN,
    ],
    [
      { id: Flows.MFA_REAUTHENTICATE, types: [AuthenticatorType.TOTP] },
      ACCOUNT_PATHS.REAUTHENTICATE_TOTP,
    ],
  ];

  it.each(cases)("maps %o to its canonical account path", (flow, expected) => {
    const path = pathForFlow(flow);
    expect(path).toBe(expected);
    expect(declaredPaths.has(path)).toBe(true);
  });
});
