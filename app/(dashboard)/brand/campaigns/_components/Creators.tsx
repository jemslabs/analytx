"use client";

import { trpc } from "@/app/_trpc/trpc";
import { ArrowRight, User } from "lucide-react";
import { useRouter } from "next/navigation";

function Creators({ campaignId }: { campaignId: number }) {
  const { data, isLoading } = trpc.campaign.getCampaignCreators.useQuery(
    { campaignId },
    { staleTime: 1000 * 30 }
  );

  const router = useRouter();

  const creators = data?.creators ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-gray-700 text-sm font-medium">
          {creators.length} creators in this campaign
        </p>
      </div>

      <div className="border border-gray-200 bg-white overflow-x-auto rounded-xl">
        {isLoading ? (
          /* Skeleton */
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 w-full rounded-xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : creators.length === 0 ? (
          /* Empty State */
          <div className="py-12 flex flex-col items-center justify-center text-center text-gray-500 space-y-2">
            <User className="h-8 w-8 text-gray-400" />
            <p className="font-medium">No creators yet</p>
            <p className="text-xs">Start inviting creators to show them here</p>
          </div>
        ) : (
          /* Table */
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white text-left text-xs border-b bg-black">
                <th className="py-3 px-4 font-medium">CREATOR</th>
                <th className="py-3 px-4 font-medium">NICHE</th>
                <th className="py-3 px-4 font-medium">Joined At</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>

            <tbody>
              {creators.map((c) => (
                <tr
                  key={c.id}
                  className="border-b last:border-none hover:bg-gray-50/50 transition"
                >
                  <td className="py-3 px-4">
                    <span className="font-medium">{c.creator.name}</span>
                  </td>

                  <td className="py-3 px-4 text-gray-600">
                    {c.creator.niche}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(c.createdAt).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td
                    className="px-3 py-4 text-center cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/brand/campaigns/${campaignId}/creator/${c.id}`
                      )
                    }
                  >
                    <div className="inline-flex items-center justify-center gap-2 text-blue-500 hover:text-gray-700">
                      <span>View Analytics</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Creators;
