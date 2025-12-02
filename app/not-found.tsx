"use client";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound404() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="text-center space-y-10">
        
        <div className="space-y-6">
          <h1 className="text-9xl font-bold text-primary">404</h1>

          <h2 className="text-3xl font-semibold text-foreground">
            Page Not Found
          </h2>

          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Link href="/">
            <Button className="gap-3">
              <Home className="h-5 w-5" />
              Go Home
            </Button>
          </Link>

          <Button
            variant="outline"
            className="gap-3 hover:bg-primary-foreground"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
