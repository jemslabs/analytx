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
    retry: 1,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isLoading) return;

    if (!user && serverUser) setUser(serverUser);
    setIsUserLoading(false);

    // Not logged in → redirect to login
    // Not logged in → allow login & signup pages
    if (!user && !serverUser) {
      if (
        !pathname.startsWith("/login") &&
        !pathname.startsWith("/signup")
      ) {
        router.replace("/login");
      }
      return;
    }


    const currentUser = user || serverUser;

    // Allow public pages
    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname === "/" ||
      pathname.startsWith("/pricing") ||
      pathname.startsWith("/docs")
    ) {
      return;
    }

    // BRAND
    if (currentUser.role === "BRAND") {
      if (!currentUser.brandProfile) {
        if (!pathname.startsWith("/onboarding/brand")) {
          router.replace("/onboarding/brand");
        }
        return;
      }

      const base = `/brand/${currentUser.brandProfile.slug}`;
      if (!pathname.startsWith(base)) {
        router.replace(base);
      }
      return;
    }

    // CREATOR
    if (currentUser.role === "CREATOR") {
      if (!currentUser.creatorProfile) {
        if (!pathname.startsWith("/onboarding/creator")) {
          router.replace("/onboarding/creator");
        }
        return;
      }

      const base = `/creator/${currentUser.creatorProfile.slug}`;
      if (!pathname.startsWith(base)) {
        router.replace(base);
      }
      return;
    }

  }, [user, serverUser, isLoading, pathname, router]);

  return null;
}
