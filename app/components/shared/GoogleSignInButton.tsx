"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import Box from "@mui/material/Box";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

type CredentialResponse = {
  credential?: string;
};

type GoogleAccountsId = {
  initialize: (config: {
    client_id: string;
    callback: (response: CredentialResponse) => void;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: { theme?: string; size?: string; width?: number; text?: string; locale?: string }
  ) => void;
};

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
  }
}

type GoogleSignInButtonProps = {
  onCredential: (idToken: string) => void;
  onError: () => void;
  locale?: string;
};

// Renders Google's own "Sign in with Google" button via Google Identity Services (GIS).
// GIS hands us an ID token directly (no redirect flow needed) which the backend then
// verifies and exchanges for our own app JWT at POST /api/auth/google.
export default function GoogleSignInButton({ onCredential, onError, locale }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    function render() {
      const google = window.google;
      if (!google || !buttonRef.current) return;

      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID as string,
        callback: (response) => {
          if (response.credential) {
            onCredential(response.credential);
          } else {
            onError();
          }
        },
      });
      google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 352,
        text: "continue_with",
        locale,
      });
    }

    if (window.google) {
      render();
      return;
    }

    // The gsi/client script loads async; poll briefly until it's ready since there's
    // no load-event hook exposed for the `google` global itself.
    const interval = window.setInterval(() => {
      if (window.google) {
        window.clearInterval(interval);
        render();
      }
    }, 100);
    return () => window.clearInterval(interval);
  }, [onCredential, onError, locale]);

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      <Box ref={buttonRef} sx={{ display: "flex", justifyContent: "center", width: "100%" }} />
    </>
  );
}
