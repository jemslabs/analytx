"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function AdminPanel() {
  const [brandId, setBrandId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const grantFreeTrial = async () => {
    if (!brandId) return;

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await axios.post(
        "/api/admin/free-trial",
        {
          brandId: Number(brandId),
        },
        {
          withCredentials: true,
        }
      );

      setSuccess(res.data?.msg || "14-day trial has been activated for this brand.");
      setBrandId("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<{ msg?: string }>;

        setError(
          error.response?.data?.msg ||
          error.message ||
          "Something went wrong"
        );
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Grant 14-Day Free Trial Access</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Manually activate a 14-day trial for a brand account. This will
          override the current subscription status if one exists.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="number"
            placeholder="Enter Brand ID"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Ensure the Brand ID is correct before proceeding.
          </p>
        </div>


        <Button
          onClick={grantFreeTrial}
          disabled={!brandId || loading}
          className="w-full"
        >
          {loading ? "Activating..." : "Activate Trial"}
        </Button>

        {success && (
          <p className="text-sm text-green-600">{success}</p>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default AdminPanel;
