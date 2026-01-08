"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import useAuthStore from "@/stores/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signup } = useAuthStore();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setData({ ...data, email });
    setEmailError(validateEmail(email) ? "" : "Enter a valid work email");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setData({ ...data, password });
    setPasswordError(
      password.length < 6 ? "Password must be at least 6 characters" : ""
    );
  };

  const handleSignup = async () => {
    if (emailError || passwordError) return;
    if (!data.role) {
      toast.error("Please select an account type");
      return;
    }

    try {
      setIsLoading(true);
      await signup(data, router);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 pt-16">
      {/* Left marketing panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-black to-zinc-900 text-white">
        <div>
          {/* Logo */}
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
            One platform to track
            campaigns and performance
          </h1>

          {/* Subtext */}
          <p className="mt-4 text-zinc-300 max-w-md">
            AnalytX helps brands see what truly drives results in creator marketing — with accurate attribution, actionable analytics, and reliable data at scale.
          </p>
        </div>
      </div>


      {/* Right signup form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Create your AnalytX account
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your details to create your account.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!validateEmail(data.email)) {
                setEmailError("Enter a valid work email");
                return;
              }
              handleSignup();
            }}
            className="space-y-5"
          >
            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                placeholder="name@example.com"
                value={data.email}
                onChange={handleEmailChange}
                className="h-12"
              />
              {emailError && (
                <p className="text-red-500 text-xs">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  className="h-12 pr-10"
                  value={data.password}
                  onChange={handlePasswordChange}
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
                <p className="text-red-500 text-xs">{passwordError}</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label>Account type</Label>
              <Select
                value={data.role}
                onValueChange={(role) => setData({ ...data, role })}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRAND">Brand / Agency</SelectItem>
                  <SelectItem value="CREATOR">Creator</SelectItem>
                </SelectContent>
              </Select>
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
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Create account"
              )}
            </Button>

            <p className=" text-center text-muted-foreground">
              Already using Analytx?{" "}
              <Link href="/login" className="font-medium underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
