import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormErrors } from "openbase-auth-client";
import { useAuthStatus } from "openbase-auth-client/auth";
import { confirmLoginCode, Flows } from "openbase-auth-client/allauth";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { AuthShell } from "../components/AuthShell";

export default function ConfirmLoginCode() {
  const [, authInfo] = useAuthStatus();
  const [code, setCode] = useState("");
  const [response, setResponse] = useState({ fetching: false, content: null });

  function submit(event) {
    event.preventDefault();
    setResponse((current) => ({ ...current, fetching: true }));
    confirmLoginCode(code)
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
    authInfo.pendingFlow?.id !== Flows.LOGIN_BY_CODE
  ) {
    return <Navigate to="/account/login/code" />;
  }

  return (
    <AuthShell
      title="Enter sign-in code"
      description="The code expires quickly, so enter it as soon as it arrives."
      footer={
        <Link
          to="/account/login/code"
          className="font-medium text-foreground transition-colors hover:text-primary"
        >
          Send a new code
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
            inputMode="numeric"
          />
          <FormErrors param="code" errors={response.content?.errors} />
        </div>

        <Button type="submit" disabled={response.fetching} className="w-full">
          {response.fetching ? "Checking..." : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
