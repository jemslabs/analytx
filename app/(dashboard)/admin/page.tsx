"use client";

import { useState } from "react";
import axios from "axios";
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
      const res = await axios.post("/api/admin/free-trial", {
        brandId: Number(brandId),
      }, {
        withCredentials: true
      });

      setSuccess(res.data.msg);
      setBrandId("");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Grant Free Trial</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          type="number"
          placeholder="Brand ID"
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
        />

        <Button
          onClick={grantFreeTrial}
          disabled={!brandId || loading}
          className="w-full"
        >
          {loading ? "Granting..." : "Grant Free Trial"}
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
