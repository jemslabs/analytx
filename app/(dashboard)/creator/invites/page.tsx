"use client";

import { trpc } from "@/app/_trpc/trpc";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function CreatorInvites() {
  const { data, isLoading, error } =
    trpc.campaign.getMyCampaignInvites.useQuery(undefined, {
      staleTime: 1000 * 60,
    });

  const [loadingId, setLoadingId] = useState<number | null>(null);

  const acceptCampaignInvite = trpc.campaign.acceptCampaignInvite.useMutation({
    onSuccess: (res) => {
      toast.success(res.message || "Campaign Invite Accepted");
      setLoadingId(null);
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
      setLoadingId(null);
    },
  });

  const invites = data?.invites ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Campaign Invites</h1>
        <p className="text-sm text-gray-500">
          View all campaign collaboration invites sent to you.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-black">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Campaign
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Sent On
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={5} className="px-6 py-4">
                    <Skeleton className="h-4 w-full" />
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-red-600">
                  {error.message}
                </td>
              </tr>
            ) : invites.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500 space-y-2"
                >
                  <Mail className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="font-medium">No invites yet</p>
                  <p className="text-xs">You’ll see them here once invited.</p>
                </td>
              </tr>
            ) : (
              invites.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {inv.campaign?.name ?? "Unknown Campaign"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {inv.campaign?.brand?.name ?? "Unknown Brand"}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <span
                      className={
                        inv.status === "PENDING"
                          ? "text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
                          : "text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                      }
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-center">

                    {inv.status === "PENDING" &&
                      <Button
                        variant="ghost"
                        className="text-green-600 hover:text-green-600 transition rounded-full bg-green-500/10"
                        onClick={() => {
                          setLoadingId(inv.id);
                          acceptCampaignInvite.mutate({ campaignInviteId: inv.id });
                        }}
                      >
                        {Number(loadingId) === inv.id ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <Check className="w-5 h-5" />
                        )}
                      </Button>

                    }
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

export default CreatorInvites;
