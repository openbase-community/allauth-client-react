import React, { useState } from "react";
import { act, create } from "react-test-renderer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthContext } from "../src/auth/AuthContext";
import {
  AnonymousRoute,
  AuthChangeRedirector,
  withNextQuery,
} from "../src/auth/routing";

const anonymousAuth = {
  status: 401,
  meta: { is_authenticated: false },
  data: { flows: [] },
};

const authenticatedAuth = {
  status: 200,
  meta: { is_authenticated: true },
  data: { flows: [], methods: [], user: { id: 1 } },
};

let authenticate;
let startFlow;
let currentLocation;

function pendingFlowAuth(flowId) {
  return {
    status: 401,
    meta: { is_authenticated: false },
    data: { flows: [{ id: flowId, is_pending: true }] },
  };
}

function LocationCapture() {
  const location = useLocation();
  currentLocation = location.pathname + location.search;
  return null;
}

function AuthHarness({ initialAuth = anonymousAuth }) {
  const [auth, setAuth] = useState(initialAuth);
  authenticate = () => setAuth(authenticatedAuth);
  startFlow = (flowId) => setAuth(pendingFlowAuth(flowId));

  return (
    <AuthContext.Provider value={{ auth, config: { status: 200 } }}>
      <AuthChangeRedirector>
        <LocationCapture />
        <Routes>
          <Route
            path="/account/login"
            element={
              <AnonymousRoute>
                <div>Login</div>
              </AnonymousRoute>
            }
          />
          <Route path="/account/login/code" element={<div>Code</div>} />
          <Route
            path="/account/login/code/confirm"
            element={
              <AnonymousRoute>
                <div>Confirm code</div>
              </AnonymousRoute>
            }
          />
          <Route path="/account/signup" element={<div>Signup</div>} />
          <Route
            path="/account/verify-email"
            element={
              <AnonymousRoute>
                <div>Verify email</div>
              </AnonymousRoute>
            }
          />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
          <Route path="/dashboard/settings" element={<div>Settings</div>} />
        </Routes>
      </AuthChangeRedirector>
    </AuthContext.Provider>
  );
}

async function renderAt(path, initialAuth) {
  let renderer;
  await act(async () => {
    renderer = create(
      <MemoryRouter
        initialEntries={[path]}
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        <AuthHarness initialAuth={initialAuth} />
      </MemoryRouter>,
    );
  });
  return renderer;
}

describe("post-login redirects", () => {
  beforeEach(() => {
    authenticate = undefined;
    startFlow = undefined;
    currentLocation = undefined;
    vi.stubGlobal("window", {
      location: { assign: vi.fn() },
      sessionStorage: window.sessionStorage,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("preserves a server destination through the login state transition", async () => {
    const destination =
      "/o/authorize/?response_type=code&client_id=openbase-coder-cli" +
      "&redirect_uri=http%3A%2F%2F127.0.0.1%3A52807%2Foauth%2Fcallback" +
      "&code_challenge=WaDc6KvXdxh0eMqo8cWhWQK7Qu7reXxPfYN4byKzAkA" +
      "&code_challenge_method=S256&state=f9bd0cb6011259d254e84ee735c5b706";
    const renderer = await renderAt(
      `/account/login?next=${encodeURIComponent(destination)}`,
    );

    await act(async () => {
      authenticate();
    });

    expect(window.location.assign).toHaveBeenCalledWith(destination);
    expect(currentLocation).not.toBe("/dashboard");
    renderer.unmount();
  });

  it("honors a server destination for an existing authenticated session", async () => {
    const destination = "/o/authorize/?client_id=openbase-coder-cli";
    const renderer = await renderAt(
      `/account/login?next=${encodeURIComponent(destination)}`,
      authenticatedAuth,
    );

    expect(window.location.assign).toHaveBeenCalledWith(destination);
    expect(currentLocation).not.toBe("/dashboard");
    renderer.unmount();
  });

  it("uses client-side navigation for an internal destination", async () => {
    const renderer = await renderAt(
      "/account/login?next=%2Fdashboard%2Fsettings",
      authenticatedAuth,
    );

    expect(currentLocation).toBe("/dashboard/settings");
    expect(window.location.assign).not.toHaveBeenCalled();
    renderer.unmount();
  });
});

const cliAuthorize =
  "/o/authorize/?response_type=code&client_id=openbase-coder-cli" +
  "&redirect_uri=http%3A%2F%2F127.0.0.1%3A52807%2Foauth%2Fcallback" +
  "&state=f9bd0cb6011259d254e84ee735c5b706";

describe("pending flow navigation keeps ?next=", () => {
  beforeEach(() => {
    authenticate = undefined;
    startFlow = undefined;
    currentLocation = undefined;
    vi.stubGlobal("window", {
      location: { assign: vi.fn() },
      sessionStorage: window.sessionStorage,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([
    ["login by code", "/account/login/code", "login_by_code", "/account/login/code/confirm"],
    ["signup verification", "/account/signup", "verify_email", "/account/verify-email"],
  ])(
    "returns to the CLI authorize after %s",
    async (_label, startPath, flowId, flowPath) => {
      const renderer = await renderAt(
        `${startPath}?next=${encodeURIComponent(cliAuthorize)}`,
      );

      await act(async () => {
        startFlow(flowId);
      });
      expect(currentLocation).toBe(
        `${flowPath}?next=${encodeURIComponent(cliAuthorize)}`,
      );

      await act(async () => {
        authenticate();
      });
      expect(window.location.assign).toHaveBeenCalledWith(cliAuthorize);
      expect(currentLocation).not.toBe("/dashboard");
      renderer.unmount();
    },
  );

  it("navigates to the flow without a query when there is no next", async () => {
    const renderer = await renderAt("/account/login/code");
    await act(async () => {
      startFlow("login_by_code");
    });
    expect(currentLocation).toBe("/account/login/code/confirm");
    renderer.unmount();
  });
});

describe("withNextQuery", () => {
  it("keeps only next and encodes it", () => {
    expect(
      withNextQuery("/account/signup", "?next=%2Fo%2Fauthorize%2F%3Fa%3D1&x=2"),
    ).toBe("/account/signup?next=%2Fo%2Fauthorize%2F%3Fa%3D1");
  });

  it("returns the bare path without next", () => {
    expect(withNextQuery("/account/login", "?x=2")).toBe("/account/login");
    expect(withNextQuery("/account/login", "")).toBe("/account/login");
  });

  it("appends to a path that already has a query", () => {
    expect(withNextQuery("/account/email?tab=1", "?next=%2Fdashboard")).toBe(
      "/account/email?tab=1&next=%2Fdashboard",
    );
  });
});
