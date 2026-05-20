import { Link } from "react-router-dom";
import { AuthShell } from "../components/AuthShell";

export default function VerificationEmailSent() {
  return (
    <AuthShell
      title="Confirm your email"
      description="We sent a verification link to your inbox. Open it to finish activating your account."
      footer={
        <>
          Wrong address?{" "}
          <Link
            to="/account/signup"
            className="font-medium text-foreground transition-colors hover:text-primary"
          >
            Create another account
          </Link>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">
        After verifying your email, come back here and sign in.
      </p>
    </AuthShell>
  );
}
