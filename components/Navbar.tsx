"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import useAuthStore from "@/stores/useAuth";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/#pricing" },
];

export default function Navbar() {
  const { user, isUserLoading } = useAuthStore();
  const dashboardHref = user?.role === "ADMIN" ? "/admin" : user?.role === "BRAND" ? "/brand" : "/creator";

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-muted border-b border-gray-200">
      <nav>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-1">
                <Image
                  src="/download.png"
                  width={72}
                  height={72}
                  alt="Logo"
                  priority
                />
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              {!isUserLoading &&
                (user ? (
                  <Link href={dashboardHref}>
                    <Button className="rounded-lg px-5">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="secondary" className="rounded-lg px-4">
                        Login
                      </Button>
                    </Link>

                    <Link href="/signup">
                      <Button className="rounded-lg px-5 shadow-sm">
                        Signup
                      </Button>
                    </Link>
                  </>
                ))}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-lg">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-[280px] p-4">
                  {/* ✅ Required for accessibility */}
                  <SheetHeader>
                    <SheetTitle className="sr-only">
                      Navigation Menu
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-8 flex flex-col gap-6">
                    {/* Links */}
                    <div className="flex flex-col gap-2">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    {/* Auth */}
                    {!isUserLoading &&
                      (user ? (
                        <Link href={dashboardHref}>
                          <Button className="w-full rounded-lg">
                            Dashboard
                          </Button>
                        </Link>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <Link href="/login">
                            <Button variant="secondary" className="w-full rounded-lg">
                              Login
                            </Button>
                          </Link>

                          <Link href="/signup">
                            <Button className="w-full rounded-lg">
                              Signup
                            </Button>
                          </Link>
                        </div>
                      ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
