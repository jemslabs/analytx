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
  const { signup } = useAuthStore()
  // Simple email regex validation
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setData({ ...data, email });
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setData({ ...data, password });

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };

  const handleSignup = async () => {
    if (emailError || passwordError) return;
    if (!data.role) {
      toast.error("Please select a role");
      return;
    }
    try {

      setIsLoading(true);

      await signup(data, router);

    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-muted px-4">
  <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
    {/* Header */}
    <div className="space-y-3 mb-6 text-center">
      <h2 className="text-3xl font-semibold tracking-tight">Create Your Account</h2>
      <p className="text-muted-foreground text-sm">
        Enter your details to create your account.
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
        handleSignup();
      }}
      className="space-y-6"
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
          <p className="text-red-500 text-sm text-left">{passwordError}</p>
        )}
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label>Role</Label>
        <Select
          value={data.role}
          onValueChange={(role) => setData({ ...data, role })}
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BRAND">Brand</SelectItem>
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
        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Create Account"}
      </Button>

      {/* Login Link */}
      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium underline text-blue-500">
          Login
        </Link>
      </p>
    </form>
  </div>
</div>


  );
}
