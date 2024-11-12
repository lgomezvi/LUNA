//import Image from "next/image";
import { AuthStatus } from "@/components/auth-buttons";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome</h1>
      <AuthStatus />
    </main>
  );
}
