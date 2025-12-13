"use client";

import { trpc } from "@/app/_trpc/trpc";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

function ReferralCodes({ campaignMemberId }: { campaignMemberId: number }) {
  const [open, setOpen] = useState(false);
  type PlatformType =
    | "INSTAGRAM"
    | "YOUTUBE"
    | "X"
    | "LINKEDIN"
    | "FACEBOOK"
    | "WHATSAPP"
    | "TELEGRAM"
    | "WEBSITE";

  const [platform, setPlatform] = useState<PlatformType>("INSTAGRAM");


  const { data, isLoading, error, refetch } =
    trpc.campaign.getMyReferralCodes.useQuery({ campaignMemberId }, {
      staleTime: 1000 * 30,
    });
  const generateReferralCode = trpc.campaign.generateReferralCode.useMutation({
    onSuccess: (res) => {
      toast.success(res.message || "Referral Code Generated");
      refetch()
      setOpen(false);
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });
  const handleGenerate = () => {
    generateReferralCode.mutate({
      campaignMemberId,
      platform,
    });

  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Manage and generate referral codes for this campaign.
          </p>
        </div>

        <Button
          className="flex items-center gap-2 rounded-xl shadow-sm"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Generate New Code
        </Button>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Generate Referral Code</DialogTitle>
            <DialogDescription>Select a platform to generate a unique referral code.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium">Platform</label>
              <Select onValueChange={(v) => setPlatform(v as PlatformType)}>

                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                  <SelectItem value="YOUTUBE">YouTube</SelectItem>
                  <SelectItem value="X">X (Twitter)</SelectItem>
                  <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                  <SelectItem value="FACEBOOK">Facebook</SelectItem>
                  <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                  <SelectItem value="TELEGRAM">Telegram</SelectItem>
                  <SelectItem value="WEBSITE">Website / Blog</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleGenerate}
              disabled={generateReferralCode.isPending}
              className="rounded-xl"
            >
              {generateReferralCode.isPending ? "Generating..." : "Generate Code"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* REFERRAL CODES TABLE */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-black">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Created
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={4} className="px-6 py-4">
                    <Skeleton className="h-4 w-full" />
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-red-600">
                  {error.message}
                </td>
              </tr>
            ) : !data?.referralCodes?.length ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No referral codes generated yet.
                </td>
              </tr>
            ) : (
              data.referralCodes.map((ref) => (
                <tr key={ref.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    {ref.platform}
                  </td>
                  <td className="px-6 py-4 text-left text-sm text-gray-900 font-mono">
                    {ref.code}
                  </td>
                  <td className="px-6 py-4 text-left text-sm text-gray-900">
                    {new Date(ref.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    {/* Copy Button */}
                    <button
                      onClick={() => {
                        const referralUrl = `${window.location.origin}/r/${ref.code}`;
                        navigator.clipboard.writeText(referralUrl);
                        toast.success("Referral URL copied!");
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                    >
                      <Copy className="h-4 w-4" />
                    </button>

                    {/* Open Link Button */}
                    <a
                      href={`${window.location.origin}/r/${ref.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-gray-100 transition"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


    </div>
  );
}

export default ReferralCodes;
