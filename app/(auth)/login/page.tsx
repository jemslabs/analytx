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
    <div className="min-h-screen flex">
      <div className="flex w-full text-center">
        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center space-y-8 w-full md:w-1/2 px-4 md:px-20 bg-primary/10">
          <div className="space-y-3 mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Welcome Back
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Enter your details to access your account.
            </p>
          </div>

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
                  setEmailError(validateEmail(email) ? "" : "Please enter a valid email address");
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
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
                "Login"
              )}
            </Button>

            <p className="text-md">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium underline text-blue-500"
              >
                Signup
              </Link>
            </p>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-primary text-white">
          <p className="text-lg font-medium">Welcome to our platform</p>
        </div>
      </div>
    </div>
  );
}
