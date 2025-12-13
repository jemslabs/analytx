"use client"

import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
function CreatorCampaign() {
    const { id } = useParams();
    const router = useRouter();

    const campaignMemberId = Number(id);
    const ReferralCodes = dynamic(() => import("../../_components/ReferralCodes"), {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin w-5 h-5" />
            </div>
        ),
    });

    const Overview = dynamic(() => import("../../_components/Overview"), {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin w-5 h-5" />
            </div>
        ),
    })
    return (
        <div>
            <div>
                <Button
                    type="button"
                    variant="ghost"
                    className="p-0 flex items-center gap-1 text-gray-600"
                    onClick={() => router.push("/creator")}
                >
                    <ChevronLeft className="w-4 h-4" /> Back to Campaigns
                </Button>
            </div>

            <Tabs className="mt-2" defaultValue="overview">
                <TabsList className="gap-2 ">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="referralCodes">Referral Codes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                        <Overview campaignMemberId={campaignMemberId} />
                    </TabsContent>
                <TabsContent value="referralCodes">
                    <ReferralCodes campaignMemberId={campaignMemberId} />
                </TabsContent>

            </Tabs>
        </div>
    )
}

export default CreatorCampaign