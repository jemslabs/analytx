"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/stores/useAuth";

export default function FetchUser() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, setIsUserLoading } = useAuthStore();

  const { data: serverUser, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get("/api/auth/user");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    // Wait until query finishes
    if (isLoading) return;

    // Sync Zustand
    if (!user && serverUser) setUser(serverUser);
    setIsUserLoading(false);

    // 1️⃣ Not logged in
    if (!user && !serverUser) {
      if (!pathname.startsWith("/login") && !pathname.startsWith("/signup")) {
        router.replace("/login");
      }
      return;
    }

    const currentUser = user || serverUser;

    // 2️⃣ Skip login/signup pages
    if (pathname.startsWith("/login") || pathname.startsWith("/signup")) return;

    // 3️⃣ BRAND logic
    if (currentUser.role === "BRAND") {
      if (!currentUser.brandProfile && !pathname.startsWith("/onboarding/brand")) {
        router.replace("/onboarding/brand");
        return;
      }
      if (currentUser.brandProfile && !pathname.startsWith("/dashboard")) {
        router.replace("/dashboard");
        return;
      }
    }

    // 4️⃣ CREATOR logic
    if (currentUser.role === "CREATOR") {
      if (!currentUser.creatorProfile && !pathname.startsWith("/onboarding/creator")) {
        router.replace("/onboarding/creator");
        return;
      }
      if (currentUser.creatorProfile && !pathname.startsWith("/dashboard")) {
        router.replace("/dashboard");
        return;
      }
    }
  }, [user, serverUser, isLoading, pathname, router]);

  return null;
}
