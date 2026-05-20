import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormErrors } from "openbase-auth-client";
import { useAuthStatus } from "openbase-auth-client/auth";
import * as allauth from "openbase-auth-client/allauth";
import { Flows } from "openbase-auth-client/allauth";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import {
  create,
  parseCreationOptionsFromJSON,
} from "@github/webauthn-json/browser-ponyfill";
import { AuthShell } from "../components/AuthShell";

export default function CreateSignupPasskey() {
  const [, authInfo] = useAuthStatus();
  const [name, setName] = useState("");
  const [response, setResponse] = useState({ fetching: false, content: null });

  async function submit(event) {
    event.preventDefault();
    setResponse((current) => ({ ...current, fetching: true }));
    try {
      const optResp = await allauth.getWebAuthnCreateOptionsAtSignup(true);
      if (optResp.status === 200) {
        const options = parseCreationOptionsFromJSON(
          optResp.data.creation_options
        );
        const credential = await create(options);
        const signupResp = await allauth.signupWebAuthnCredential(
          name,
          credential
        );
        setResponse((current) => ({ ...current, content: signupResp }));
      } else {
        setResponse((current) => ({ ...current, content: optResp }));
      }
    } catch (error) {
      console.error(error);
      window.alert(error);
    }
    setResponse((current) => ({ ...current, fetching: false }));
  }

  if (
    response.content?.status === 409 ||
    authInfo.pendingFlow?.id !== Flows.MFA_WEBAUTHN_SIGNUP
  ) {
    return <Navigate to="/account/signup/passkey" />;
  }

  return (
    <AuthShell
      title="Name this passkey"
      description="Give this device a recognizable label so you can find it later if you add more passkeys."
    >
      <FormErrors errors={response.content?.errors} />

      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Passkey name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="MacBook Pro"
            disabled={response.fetching}
          />
          <FormErrors param="code" errors={response.content?.errors} />
        </div>

        <Button type="submit" disabled={response.fetching} className="w-full">
          {response.fetching ? "Creating..." : "Create passkey"}
        </Button>
      </form>
    </AuthShell>
  );
}
