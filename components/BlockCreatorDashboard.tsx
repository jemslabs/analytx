"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuth";

export default function BlockCreatorDashboard() {
  const { user, isUserLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "CREATOR") {
        router.push("/");
      }
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return null; // Or a loading spinner
  }

  if (!user || user.role !== "CREATOR") {
    return null; // Will redirect
  }

  return null; // Allow access
}