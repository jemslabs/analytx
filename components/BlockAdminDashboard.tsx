"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuth";

export default function BlockAdminDashboard() {
  const { user, isUserLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "ADMIN") {
        router.push("/");
      }
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return null; // Or a loading spinner
  }

  if (!user || user.role !== "ADMIN") {
    return null; // Will redirect
  }

  return null; // Allow access
}