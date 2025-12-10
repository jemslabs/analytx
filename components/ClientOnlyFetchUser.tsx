"use client";

import FetchUser from "./FetchUser";
import { usePathname } from "next/navigation";

export default function ClientOnlyFetchUser() {
  const pathname = usePathname();

  // Skip auth on /r/:code pages
  if (pathname.startsWith("/r/")) return null;

  return <FetchUser />;
}
