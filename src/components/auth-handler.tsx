// src/components/auth-handler.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GirlySpinner } from "@/components/girly-spinner";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function AuthHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleAuth = async () => {
      // Prevent multiple simultaneous attempts
      if (isProcessing || status === "loading") return;
      if (!session?.user?.email) return;

      setIsProcessing(true);
      let retryCount = 0;

      while (retryCount < MAX_RETRIES) {
        try {
          console.log("Attempting to save user data, attempt:", retryCount + 1);

          // Send user data to API
          const response = await fetch("/api/user", {
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

          const data = await response.json();

          if (!response.ok) {
            console.error("Server response not OK:", data);
            throw new Error(data.error || "Failed to save user data");
          }

          console.log("User data saved successfully:", data);

          // Always redirect to dashboard - the dashboard will handle showing the form if needed
          router.push("/dashboard");
          return; // Success - exit the function
        } catch (error) {
          console.error(`Attempt ${retryCount + 1} failed:`, error);
          retryCount++;

          if (retryCount === MAX_RETRIES) {
            console.error("All retry attempts failed");
            // You might want to show an error to the user here
            break;
          }

          // Wait before retrying
          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_DELAY * retryCount)
          );
        }
      }

      setIsProcessing(false);
    };

    handleAuth();
  }, [session, router, status, isProcessing]);

  // You might want to add a loading indicator
  if (status === "loading" || isProcessing) {
    <div className="p-8 w-full h-full flex items-center justify-center">
      <GirlySpinner />
    </div>;
  }

  return null;
}
