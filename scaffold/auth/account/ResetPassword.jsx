import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormErrors } from "openbase-auth-client";
import {
  getPasswordReset,
  resetPassword,
} from "openbase-auth-client/allauth";
import {
  Link,
  Navigate,
  useLoaderData,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import { AuthShell } from "../components/AuthShell";

export async function resetPasswordByLinkLoader({ params }) {
  const key = params.key;
  const resp = await getPasswordReset(key);
  return { resetKey: key, resetKeyResponse: resp };
}

function ResetPassword({ resetKey, resetKeyResponse }) {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [password2Errors, setPassword2Errors] = useState([]);
  const [response, setResponse] = useState({ fetching: false, content: null });

  function submit(event) {
    event.preventDefault();
    if (password2 !== password1) {
      setPassword2Errors([
        { param: "password2", message: "Passwords do not match." },
      ]);
      return;
    }
    setPassword2Errors([]);
    setResponse((current) => ({ ...current, fetching: true }));
    resetPassword({ key: resetKey, password: password1 })
      .then((resp) => {
        setResponse((current) => ({ ...current, content: resp }));
      })
      .catch((error) => {
        console.error(error);
        window.alert(error);
      })
      .then(() => {
        setResponse((current) => ({ ...current, fetching: false }));
      });
  }

  if ([200, 401].includes(response.content?.status)) {
    return <Navigate to="/account/login" />;
  }

  let body = null;
  if (resetKeyResponse.status !== 200) {
    body = <FormErrors param="key" errors={resetKeyResponse.errors} />;
  } else if (response.content?.errors?.some((error) => error.param === "key")) {
    body = <FormErrors param="key" errors={response.content?.errors} />;
  } else {
    body = (
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password1}
            onChange={(event) => setPassword1(event.target.value)}
            placeholder="Enter a new password"
            disabled={response.fetching}
          />
          <FormErrors param="password" errors={response.content?.errors} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password2">Confirm new password</Label>
          <Input
            id="password2"
            type="password"
            value={password2}
            onChange={(event) => setPassword2(event.target.value)}
            placeholder="Repeat your new password"
            disabled={response.fetching}
          />
          <FormErrors param="password2" errors={password2Errors} />
        </div>

        <Button type="submit" disabled={response.fetching} className="w-full">
          {response.fetching ? "Resetting..." : "Reset password"}
        </Button>
      </form>
    );
  }

  return (
    <AuthShell
      title="Choose a new password"
      description="Create a new password for your account."
      footer={
        <>
          Remembered it?{" "}
          <Link
            to="/account/login"
            className="font-medium text-foreground transition-colors hover:text-primary"
          >
            Back to login
          </Link>
        </>
      }
    >
      {body}
    </AuthShell>
  );
}

export function ResetPasswordByLink() {
  const { resetKey, resetKeyResponse } = useLoaderData();
  return <ResetPassword resetKey={resetKey} resetKeyResponse={resetKeyResponse} />;
}

export function ResetPasswordByCode() {
  const { state } = useLocation();
  if (!state || !state.resetKey || !state.resetKeyResponse) {
    return <Navigate to="/account/password/reset" />;
  }
  return (
    <ResetPassword
      resetKey={state.resetKey}
      resetKeyResponse={state.resetKeyResponse}
    />
  );
}
