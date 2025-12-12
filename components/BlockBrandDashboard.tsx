"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuth";

export default function BlockBrandDashboard() {
  const { user, isUserLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "BRAND") {
        router.push("/");
      }
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return null; // Or a loading spinner
  }

  if (!user || user.role !== "BRAND") {
    return null; // Will redirect
  }

  return null; // Allow access
}