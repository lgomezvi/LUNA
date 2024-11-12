// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardContent } from "@/components/dashboard-content";
import { UserData } from "@/types";

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/");
            return;
          }
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  // Get user session from userData
  const user = {
    name: userData?.name,
    email: userData?.email,
    image: userData?.image,
  };

  return <DashboardContent user={user} userData={userData} />;
}
