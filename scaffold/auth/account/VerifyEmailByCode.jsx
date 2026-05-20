import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormErrors } from "openbase-auth-client";
import { verifyEmail } from "openbase-auth-client/allauth";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { AuthShell } from "../components/AuthShell";

export default function VerifyEmailByCode() {
  const [code, setCode] = useState("");
  const [response, setResponse] = useState({ fetching: false, content: null });

  function submit(event) {
    event.preventDefault();
    setResponse((current) => ({ ...current, fetching: true }));
    verifyEmail(code)
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

  if ([200, 401].includes(response.content?.status)) {
    return <Navigate to="/account/email" />;
  }

  return (
    <AuthShell
      title="Confirm your email"
      description="Enter the confirmation code from your inbox to verify this email address."
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
          {response.fetching ? "Confirming..." : "Confirm email"}
        </Button>
      </form>
    </AuthShell>
  );
}
