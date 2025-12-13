"use client"
import { trpc } from "@/app/_trpc/trpc";

import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

function Campaigns() {
  const router = useRouter();
  const { data, isLoading, error } =
      trpc.campaign.getMyCampaigns.useQuery(undefined, {
        staleTime: 1000 * 60,
      });

  return (
     <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Campaigns</h1>
                    <p className="text-sm text-gray-500">
                        View and manage all your joined campaigns.
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-black">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                                Campaign
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                                Payout
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                                Created
                            </th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={6} className="px-6 py-4">
                                        <Skeleton className="h-4 w-full" />
                                    </td>
                                </tr>
                            ))
                        ) : error ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-red-600">
                                    {error.message}
                                </td>
                            </tr>
                        ) : data?.campaigns.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                    No campaigns found.
                                </td>
                            </tr>
                        ) : (
                            data?.campaigns.map((c) => {
                                const cpsText =
                                    (c.campaign.payoutModel === "CPS" || c.campaign.payoutModel === "BOTH")
                                        ? c.campaign.cpsCommissionType === "PERCENTAGE"
                                            ? `${c.campaign.cpsValue}% CPS`
                                            : `₹${c.campaign.cpsValue} CPS`
                                        : null;

                                const cpcText =
                                    (c.campaign.payoutModel === "CPC" || c.campaign.payoutModel === "BOTH")
                                        ? `₹${c.campaign.cpcValue} CPC`
                                        : null;

                                return (
                                    <tr
                                        key={c.campaign.id}
                                        className="hover:bg-gray-50 transition cursor-pointer"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{c.campaign.name}</span>
                                                <span
                                                    className={
                                                        c.campaign.status === "ACTIVE"
                                                            ? "text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                                                            : c.campaign.status === "DRAFT"
                                                                ? "text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
                                                                : "text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                                                    }
                                                >
                                                    {c.campaign.status}
                                                </span>
                                            </div>
                                        </td>

                                        {/* PAYOUT */}
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            {cpsText && cpcText
                                                ? `${cpsText} + ${cpcText}`
                                                : cpsText || cpcText}
                                        </td>

                                        {/* CREATED DATE */}
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {new Date(c.campaign.createdAt).toLocaleDateString()}
                                        </td>

                                        {/* ARROW */}
                                        <td
                                            className="px-6 py-4 text-center"
                                            onClick={() => router.push(`/creator/campaign/${c.id}`)}
                                        >
                                            <div className="inline-flex items-center justify-center gap-2 text-blue-500 hover:text-gray-700 cursor-pointer">
                                                <span>View</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </td>

                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
  )
}

export default Campaigns