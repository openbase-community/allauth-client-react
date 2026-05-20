import { Button } from "@/components/ui/button";
import { Link, Navigate, useLoaderData } from "react-router-dom";
import { useState } from "react";
import {
  getEmailVerification,
  verifyEmail,
} from "openbase-auth-client/allauth";
import { AuthShell } from "../components/AuthShell";

export async function loader({ params }) {
  const key = params.key;
  const resp = await getEmailVerification(key);
  return { key, verification: resp };
}

export default function VerifyEmail() {
  const { key, verification } = useLoaderData();
  const [response, setResponse] = useState({ fetching: false, content: null });

  function submit() {
    setResponse((current) => ({ ...current, fetching: true }));
    verifyEmail(key)
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

  let body = null;
  if (verification.status === 200) {
    body = (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Confirm that{" "}
          <a
            href={`mailto:${verification.data.email}`}
            className="font-medium text-foreground underline underline-offset-4"
          >
            {verification.data.email}
          </a>{" "}
          belongs to {verification.data.user.str}.
        </p>
        <Button onClick={submit} disabled={response.fetching} className="w-full">
          {response.fetching ? "Confirming..." : "Confirm email"}
        </Button>
      </div>
    );
  } else if (!verification.data?.email) {
    body = (
      <p className="text-sm text-muted-foreground">
        This verification link is invalid or has expired.
      </p>
    );
  } else {
    body = (
      <p className="text-sm text-muted-foreground">
        {verification.data.email} is already confirmed. You can return to your account.
      </p>
    );
  }

  return (
    <AuthShell
      title="Confirm your email"
      description="Verify your email address to finish setting up access."
      footer={
        <Link
          to="/account/login"
          className="font-medium text-foreground transition-colors hover:text-primary"
        >
          Return to sign in
        </Link>
      }
    >
      {body}
    </AuthShell>
  );
}
