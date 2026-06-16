import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormErrors,
  pathForPendingFlow,
  ProviderList,
  useConfig,
} from "openbase-auth-client";
import { signUp } from "openbase-auth-client/allauth";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthDivider, AuthShell } from "../components/AuthShell";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [password2Errors, setPassword2Errors] = useState([]);
  const [response, setResponse] = useState({ fetching: false, content: null });
  const config = useConfig();
  const navigate = useNavigate();
  const hasProviders = config?.data?.socialaccount?.providers?.length > 0;

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
    signUp({ email, password: password1 })
      .then((content) => {
        setResponse((current) => ({ ...current, content }));
        const path = pathForPendingFlow(content);
        if (path) {
          navigate(path, { replace: true });
        }
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
      title="Create account"
      description="Start with an email and password now, or use a passkey instead."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/account/login"
            className="font-medium text-foreground transition-colors hover:text-primary"
          >
            Sign in
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

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password1}
            onChange={(event) => setPassword1(event.target.value)}
            placeholder="Create a password"
            disabled={response.fetching}
          />
          <FormErrors param="password" errors={response.content?.errors} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password2">Confirm password</Label>
          <Input
            id="password2"
            type="password"
            value={password2}
            onChange={(event) => setPassword2(event.target.value)}
            placeholder="Re-enter your password"
            disabled={response.fetching}
          />
          <FormErrors param="password2" errors={password2Errors} />
        </div>

        <Button type="submit" disabled={response.fetching} className="w-full">
          {response.fetching ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <Button variant="outline" className="w-full" asChild>
        <Link to="/account/signup/passkey">Sign up with a passkey</Link>
      </Button>

      {hasProviders ? (
        <div className="space-y-4">
          <AuthDivider />
          <ProviderList callbackURL="/account/provider/callback" />
        </div>
      ) : null}
    </AuthShell>
  );
}
