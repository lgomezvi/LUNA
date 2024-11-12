import { auth } from "../../lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome {session.user.name}</h1>
      <p>This is a protected route.</p>
    </div>
  );
}
