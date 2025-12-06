"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const Overview = dynamic(() => import("../_components/Overview"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin w-5 h-5" />
        </div>
    ),
});

function BrandCampaign() {
    const { id } = useParams();
    const router = useRouter();

    const campaignId = Number(id);

    return (
        <div>
            <Button
                type="button"
                variant="ghost"
                className="p-0 flex items-center gap-1 text-gray-600"
                onClick={() => router.push("/brand/campaigns")}
            >
                <ChevronLeft className="w-4 h-4" /> Back to Campaigns
            </Button>

            <div>
                <Tabs className="mt-2" defaultValue="overview">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="products">Products</TabsTrigger>
                        <TabsTrigger value="creators">Creators</TabsTrigger>
                        <TabsTrigger value="invites">Invites</TabsTrigger>
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <Overview campaignId={campaignId} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default BrandCampaign;
