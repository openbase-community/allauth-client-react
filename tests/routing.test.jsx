import React, { useState } from "react";
import { act, create } from "react-test-renderer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthContext } from "../src/auth/AuthContext";
import { AnonymousRoute, AuthChangeRedirector } from "../src/auth/routing";

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
let currentLocation;

function LocationCapture() {
  const location = useLocation();
  currentLocation = location.pathname + location.search;
  return null;
}

function AuthHarness({ initialAuth = anonymousAuth }) {
  const [auth, setAuth] = useState(initialAuth);
  authenticate = () => setAuth(authenticatedAuth);

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
