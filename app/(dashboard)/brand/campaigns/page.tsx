"use client";

import { trpc } from "@/app/_trpc/trpc";
import { Button } from "@/components/ui/button";
import { Plus, Users, Package, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

function BrandCampaigns() {
    const router = useRouter();
    const { data, isLoading, error } = trpc.campaign.getAllCampaigns.useQuery(undefined, {
        staleTime: 1000 * 60
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Campaigns</h1>
                    <p className="text-sm text-gray-500">
                        View, create, and manage all your brand campaigns.
                    </p>
                </div>

                <Button onClick={() => router.push("/brand/campaigns/create")}>
                    <Plus className="h-4 w-4" /> Create Campaign
                </Button>
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
                                Products
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                                Creators
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
                        ) : data?.data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    No campaigns found.
                                </td>
                            </tr>
                        ) : (
                            data?.data.map((campaign) => {
                                const cpsText =
                                    (campaign.payoutModel === "CPS" || campaign.payoutModel === "BOTH")
                                        ? campaign.cpsCommissionType === "PERCENTAGE"
                                            ? `${campaign.cpsValue}% CPS`
                                            : `₹${campaign.cpsValue} CPS`
                                        : null;

                                const cpcText =
                                    (campaign.payoutModel === "CPC" || campaign.payoutModel === "BOTH")
                                        ? `₹${campaign.cpcValue} CPC`
                                        : null;

                                return (
                                    <tr
                                        key={campaign.id}
                                        className="hover:bg-gray-50 transition cursor-pointer"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{campaign.name}</span>
                                                <span
                                                    className={
                                                        campaign.status === "ACTIVE"
                                                            ? "text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                                                            : campaign.status === "DRAFT"
                                                                ? "text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
                                                                : "text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                                                    }
                                                >
                                                    {campaign.status}
                                                </span>
                                            </div>
                                        </td>

                                        {/* PAYOUT */}
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            {cpsText && cpcText
                                                ? `${cpsText} + ${cpcText}`
                                                : cpsText || cpcText}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <div className="flex items-center gap-1 text-gray-700">
                                                <Package className="h-4 w-4" /> 0
                                            </div>

                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">

                                            <div className="flex items-center gap-1 text-gray-700">
                                                <Users className="h-4 w-4" /> 0
                                            </div>
                                        </td>

                                        {/* CREATED DATE */}
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {new Date(campaign.createdAt).toLocaleDateString()}
                                        </td>

                                        {/* ARROW */}
                                        <td
                                            className="px-6 py-4 text-center"
                                            onClick={() => router.push(`/brand/campaigns/${campaign.id}`)}
                                        >
                                            <div className="inline-flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer">
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
    );
}

export default BrandCampaigns;
