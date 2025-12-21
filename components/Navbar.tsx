"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/useAuth";
import Image from "next/image";


const navLinks = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/#pricing" },
];

export default function Navbar() {
  const { user, isUserLoading } = useAuthStore();
  const dashboardHref = user?.role === "BRAND" ? "/brand" : "/creator";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-muted`}
    >
      <nav>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-12">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-1">
                <Image src={'/download.png'} width={80}
                  height={80}
                  alt="Logo" />
              </Link>

              {/* Navigation */}
              <div className="hidden md:flex items-center gap-1 px-2 py-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-background/70"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">

              {!isUserLoading && (
                user ? (
                  <Link href={dashboardHref}>
                    <Button className="px-6 rounded-xl ">Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login">
                      <Button
                        variant="secondary"
                        className="px-5 rounded-xl hover:bg-white"
                      >
                        Login
                      </Button>
                    </Link>

                    <Link href="/signup">
                      <Button className="group px-6 rounded-xl shadow-sm inline-flex items-center justify-center gap-2">
                        <span className="leading-none">Signup</span>
                      </Button>
                    </Link>
                  </>
                )
              )}

            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
