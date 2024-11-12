// src/components/auth-handler.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function AuthHandler() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      // Send user data to API
      fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          googleId: session.user.id,
        }),
      });
    }
  }, [session]);

  return null;
}
