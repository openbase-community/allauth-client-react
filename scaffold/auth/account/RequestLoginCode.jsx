import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormErrors } from "openbase-auth-client";
import { requestLoginCode } from "openbase-auth-client/allauth";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { AuthShell } from "../components/AuthShell";

export default function RequestLoginCode() {
  const [email, setEmail] = useState("");
  const [response, setResponse] = useState({ fetching: false, content: null });

  function submit(event) {
    event.preventDefault();
    setResponse((current) => ({ ...current, fetching: true }));
    requestLoginCode(email)
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

  if (response.content?.status === 401) {
    return <Navigate to="/account/login/code/confirm" />;
  }

  return (
    <AuthShell
      title="Send sign-in code"
      description="We’ll email you a one-time code so you can sign in without your password."
      footer={
        <Link
          to="/account/login"
          className="font-medium text-foreground transition-colors hover:text-primary"
        >
          Back to login
        </Link>
      }
    >
      <FormErrors errors={response.content?.errors} />

      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            disabled={response.fetching}
          />
          <FormErrors param="email" errors={response.content?.errors} />
        </div>

        <Button type="submit" disabled={response.fetching} className="w-full">
          {response.fetching ? "Sending..." : "Send sign-in code"}
        </Button>
      </form>
    </AuthShell>
  );
}
