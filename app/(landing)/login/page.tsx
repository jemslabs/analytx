"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import useAuthStore from "@/stores/useAuth";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const router = useRouter();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if (emailError || passwordError) return;

    try {
      setIsLoading(true);
      await login(data, router);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 pt-16">
      {/* Left side (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-black to-zinc-900 text-white">
        <div>
          <div className="mb-10">
                      <Image
                        src="/AnalytX-black.png"
                        width={140}
                        height={140}
                        alt="Analytx Logo"
                        className="w-auto h-auto"
                      />
                    </div>

          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm mb-6">
            Track Campaign Performance
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-semibold leading-tight">
            Welcome back to Analytx
          </h1>

          {/* Subtext */}
          <p className="mt-4 text-zinc-300 max-w-md">
            AnalytX helps brands see what truly drives results in creator marketing — with accurate attribution, actionable analytics, and reliable data at scale.
          </p>
        </div>
      </div>

      {/* Right side (login form) */}
      <div className="flex items-center justify-center px-6 py-12 bg-muted">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="space-y-3 mb-8 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Log in to AnalytX
            </h2>
            <p className="text-muted-foreground text-sm">
              Enter your details to access your account.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!validateEmail(data.email)) {
                setEmailError("Please enter a valid email address");
                return;
              }
              handleLogin();
            }}
            className="space-y-6"
          >
            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                placeholder="name@example.com"
                value={data.email}
                onChange={(e) => {
                  const email = e.target.value;
                  setData({ ...data, email });
                  setEmailError(
                    validateEmail(email)
                      ? ""
                      : "Please enter a valid email address"
                  );
                }}
                className="h-12"
              />
              {emailError && (
                <p className="text-red-500 text-sm text-left">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-12 pr-10"
                  value={data.password}
                  onChange={(e) => {
                    const password = e.target.value;
                    setData({ ...data, password });
                    setPasswordError(
                      password.length < 6
                        ? "Password must be at least 6 characters"
                        : ""
                    );
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm text-left">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={
                isLoading ||
                !data.email ||
                !!emailError ||
                !data.password ||
                !!passwordError
              }
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                "Log in"
              )}
            </Button>

            {/* Signup Link */}
            <p className=" text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium underline">
                Signup
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
