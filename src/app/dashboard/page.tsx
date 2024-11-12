// src/app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { getUserData } from "@/lib/actions/user";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth-buttons";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  try {
    const userData = await getUserData(session.user.email!);

    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Welcome {session.user.name}</h1>
          <LogoutButton />
        </div>
        <div>
          <h2>Your Profile</h2>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1>Error loading profile {String(error)}</h1>
      </div>
    );
  }
}
