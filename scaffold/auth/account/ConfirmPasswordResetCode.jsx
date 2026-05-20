import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormErrors } from "openbase-auth-client";
import { useAuthStatus } from "openbase-auth-client/auth";
import { Flows, getPasswordReset } from "openbase-auth-client/allauth";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { AuthShell } from "../components/AuthShell";

export default function ConfirmPasswordResetCode() {
  const [, authInfo] = useAuthStatus();
  const [code, setCode] = useState("");
  const [response, setResponse] = useState({ fetching: false, content: null });

  function submit(event) {
    event.preventDefault();
    setResponse((current) => ({ ...current, fetching: true }));
    getPasswordReset(code)
      .then((content) => {
        setResponse((current) => ({ ...current, content }));
      })
      .catch((error) => {
        console.error(error);
        window.alert(error);
      })
      .then(() => {
        setResponse((current) => ({ ...current, fetching: false }));
      });
  }

  if (
    response.content?.status === 409 ||
    authInfo.pendingFlow?.id !== Flows.PASSWORD_RESET_BY_CODE
  ) {
    return <Navigate to="/account/password/reset" />;
  }

  if (response.content?.status === 200) {
    return (
      <Navigate
        state={{ resetKey: code, resetKeyResponse: response.content }}
        to="/account/password/reset/complete"
      />
    );
  }

  return (
    <AuthShell
      title="Enter reset code"
      description="Paste the code from your email to finish resetting your password."
      footer={
        <Link
          to="/account/password/reset"
          className="font-medium text-foreground transition-colors hover:text-primary"
        >
          Start over
        </Link>
      }
    >
      <FormErrors errors={response.content?.errors} />

      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="code">Code</Label>
          <Input
            id="code"
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="123456"
            disabled={response.fetching}
          />
          <FormErrors param="key" errors={response.content?.errors} />
        </div>

        <Button type="submit" disabled={response.fetching} className="w-full">
          {response.fetching ? "Checking..." : "Continue"}
        </Button>
      </form>
    </AuthShell>
  );
}
