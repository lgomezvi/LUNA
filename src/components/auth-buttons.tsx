"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, ArrowRight } from "lucide-react"; // Import icons
import { useSession } from "next-auth/react";

export function LoginButton() {
  return (
    <Button
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      size="lg"
      className="bg-purple-600 hover:bg-purple-700 text-white"
    >
      <LogIn className="mr-2 h-4 w-4" />
      Log in now
    </Button>
  );
}
export function LogoutButton() {
  return (
    <Button
      variant="outline"
      onClick={() => signOut()}
      size="sm"
      className="ml-2"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </Button>
  );
}

export function AuthStatus() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex flex-col md:flex-row items-center gap-2">
        <Button
          variant="link"
          onClick={() => (window.location.href = "/dashboard")}
          className="text-lg text-purple-700 hover:text-purple-800"
        >
          Welcome back {session.user?.name?.split(" ")[0]}, go to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <span className="italic">or</span>
        <LogoutButton />
      </div>
    );
  }

  return <LoginButton />;
}
