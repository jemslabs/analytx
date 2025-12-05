"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/app/_trpc/trpc";
import useAuthStore from "@/stores/useAuth";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

function BrandAPIAccess() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");
  const generateKey = trpc.profile.generateAPIKey.useMutation({
    onSuccess: async (res) => {
      setGeneratedKey(res.apiKey);
      setDialogOpen(true);

      await queryClient.invalidateQueries({ queryKey: ["user"] });
      // Update Zustand instantly
      if (user?.brandProfile) {
        setUser({
          ...user,
          brandProfile: {
            ...user.brandProfile,
            apiKey: res.apiKey,
          },
        });
      }

      // Background refresh
    },
  });

  const maskedKey = user?.brandProfile?.apiKey ? "•".repeat(28) : "";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">API Access</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your API credentials and webhook integrations.
        </p>
      </div>

      {/* API KEY BOX */}
      <div className="p-5 rounded-xl space-y-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-gray-700 font-semibold text-lg">API Key</h1>


          <Link
            href="/docs"
            className="text-sm text-primary underline hover:opacity-75 transition"
          >
            Learn more
          </Link>
        </div>

        <p className="text-sm text-gray-500">
          Your API key allows secure programmatic access to your brand
          resources.
        </p>

        <div className="flex gap-3">
          <Input
            type="text"
            disabled
            value={maskedKey}
            placeholder="No API key generated"
            className="border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary transition bg-gray-50"
          />

          <Button
            onClick={() => generateKey.mutate()}
            disabled={generateKey.isPending}
            className="min-w-[140px]"
          >
            {generateKey.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : user?.brandProfile?.apiKey ? (
              "Regenerate"
            ) : (
              "Generate API Key"
            )}
          </Button>
        </div>
      </div>

      {/* DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Your New API Key</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600">
            Copy this key now. It will only be shown once for security reasons.
          </p>

          <div className="mt-4 flex items-center gap-2">
            <Input value={generatedKey} readOnly className="bg-gray-50" />

            <Button
              size="icon"
              variant="outline"
              className="h-9 w-9 bg-black text-white hover:bg-black/90"
              onClick={() => {
                navigator.clipboard.writeText(generatedKey);
                toast.success("Copied to clipboard");
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* WEBHOOKS */}
      <div className="p-5 rounded-xl space-y-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-gray-700 font-semibold text-lg">Webhook</h1>

          <Link
            href="/docs"
            className="text-sm text-primary underline hover:opacity-75 transition"
          >
            Learn more
          </Link>
        </div>

        <p className="text-sm text-gray-500">
          Webhooks notify your server whenever specific events occur.
        </p>

        <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden">
          <thead className="bg-black">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Access
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 text-sm text-gray-900">
                https://tranzo.com/api/event/sale
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">Sale Event</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BrandAPIAccess;
