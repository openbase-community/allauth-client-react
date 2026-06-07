# allauth-client-react

React helpers and screens for Django allauth headless authentication.

This repository is named `allauth-client-react`. The package currently exports as
`openbase-auth-client` for OpenBase workspace compatibility.

## What It Provides

- React context and route guards for allauth session state.
- Account screens for login, signup, email verification, password reset, logout,
  provider callback/signup, login by code, and passkey signup.
- MFA and WebAuthn helpers.
- A direct allauth API client exposed from `openbase-auth-client/allauth`.
- A scaffold generator for copying auth screens into a React app.

## Install

```sh
pnpm add openbase-auth-client
```

The package expects the host app to provide these peer dependencies:

```sh
pnpm add react react-dom react-router-dom
```

React is kept as a peer dependency so the package can be used by regular React
SPAs and can remain compatible with Next.js-style host apps.

## Basic SPA Usage

Wrap your routes with the auth context and redirector:

```tsx
import {
  AuthChangeRedirector,
  AuthContextProvider,
  AuthenticatedRoute,
} from "openbase-auth-client/auth";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <AuthChangeRedirector>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <AuthenticatedRoute>
                  <Dashboard />
                </AuthenticatedRoute>
              }
            />
          </Routes>
        </AuthChangeRedirector>
      </AuthContextProvider>
    </BrowserRouter>
  );
}
```

Use the exported account screens directly when you want a bundled SPA flow:

```tsx
import {
  Login,
  Signup,
  RequestPasswordReset,
  ResetPasswordByCode,
  VerifyEmailByCode,
} from "openbase-auth-client";
```

For complete route wiring, see `scaffold/auth/AuthRoutes.jsx`.

## Direct allauth API Usage

Low-level allauth calls are available from the `allauth` subpath:

```ts
import { getAuth, login, logout, signUp } from "openbase-auth-client/allauth";

const auth = await getAuth();
await login({ email, password });
await signUp({ email, password });
await logout();
```

If your allauth API is not served from the same origin, configure the client:

```ts
import { Client, setup } from "openbase-auth-client/allauth";

setup(Client.BROWSER, "https://api.example.com", true);
```

## Scaffold Auth Screens

Copy the scaffolded auth screens into a host app:

```sh
pnpm --filter openbase-auth-client generate-auth-screens -- --target ../web
```

Use `--overwrite` to replace existing generated screens:

```sh
pnpm --filter openbase-auth-client generate-auth-screens -- --target ../web --overwrite
```

The scaffold assumes a React Router app and shadcn-style UI imports such as
`@/components/ui/button`.

## Exports

- `openbase-auth-client`: account screens, shared components, hooks, and common
  helpers.
- `openbase-auth-client/auth`: auth context, auth state hooks, route guards, and
  redirect helpers.
- `openbase-auth-client/allauth`: direct Django allauth headless API client.

## Development

```sh
pnpm install
pnpm --filter openbase-auth-client build
```

The package is TypeScript-built from `src` into `dist`.
