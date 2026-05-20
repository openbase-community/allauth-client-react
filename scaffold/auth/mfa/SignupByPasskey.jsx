import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormErrors } from "openbase-auth-client";
import { signUpByPasskey } from "openbase-auth-client/allauth";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AuthShell } from "../components/AuthShell";

export default function SignupByPasskey() {
  const [email, setEmail] = useState("");
  const [response, setResponse] = useState({ fetching: false, content: null });

  function submit(event) {
    event.preventDefault();
    setResponse((current) => ({ ...current, fetching: true }));
    signUpByPasskey({ email })
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

  return (
    <AuthShell
      title="Create account with a passkey"
      description="Use your email first, then create a passkey on the next screen."
      footer={
        <>
          Prefer a password?{" "}
          <Link
            to="/account/signup"
            className="font-medium text-foreground transition-colors hover:text-primary"
          >
            Sign up with email
          </Link>
        </>
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
          {response.fetching ? "Continuing..." : "Continue with passkey"}
        </Button>
      </form>
    </AuthShell>
  );
}
