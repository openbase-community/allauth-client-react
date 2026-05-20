import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormErrors,
  ProviderList,
  useConfig,
  useLogin,
  WebAuthnLoginButton,
} from "openbase-auth-client";
import { Link } from "react-router-dom";
import { AuthDivider, AuthShell } from "../components/AuthShell";

export default function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    isLoading,
    errors,
  } = useLogin();
  const config = useConfig();
  const hasProviders = config?.data?.socialaccount?.providers?.length > 0;

  function onSubmit(event) {
    event.preventDefault();
    handleSubmit();
  }

  return (
    <AuthShell
      title="Sign in"
      description="Use your email and password, a one-time sign-in code, or a passkey."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            to="/account/signup"
            className="font-medium text-foreground transition-colors hover:text-primary"
          >
            Sign up
          </Link>
        </>
      }
    >
      <FormErrors errors={errors} />

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            disabled={isLoading}
          />
          <FormErrors param="email" errors={errors} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            disabled={isLoading}
          />
          <FormErrors param="password" errors={errors} />
          <div className="flex justify-end">
            <Link
              to="/account/password/reset"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {config?.data?.account?.login_by_code_enabled ? (
        <Button variant="outline" className="w-full" asChild>
          <Link to="/account/login/code">Send me a sign-in code</Link>
        </Button>
      ) : null}

      <WebAuthnLoginButton className="w-full">
        Sign in with a passkey
      </WebAuthnLoginButton>

      {hasProviders ? (
        <div className="space-y-4">
          <AuthDivider />
          <ProviderList callbackURL="/account/provider/callback" />
        </div>
      ) : null}
    </AuthShell>
  );
}
