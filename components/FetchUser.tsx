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

    // set global store
    if (!user && serverUser) {
      setUser(serverUser);
    }

    setIsUserLoading(false);

    // If NOT logged in
    if (!user && !serverUser) {
      const isPublicPage =
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup") ||
        pathname === "/" ||
        pathname.startsWith("/pricing") ||
        pathname.startsWith("/docs") ||
        pathname.startsWith("/r/"); // ← added this

      if (!isPublicPage) {
        router.replace("/login");
      }

      return;
    }

    // logged in → do nothing here
  }, [user, serverUser, isLoading, pathname, router]);

  return null;
}
