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
const Products = dynamic(() => import("../_components/Products"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin w-5 h-5" />
        </div>
    ),
});
const Invites = dynamic(() => import("../_components/Invites"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin w-5 h-5" />
        </div>
    ),
});
const Creators = dynamic(() => import("../_components/Creators"), {
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
            <div>
            <Button
                type="button"
                variant="ghost"
                className="p-0 flex items-center gap-1 text-gray-600"
                onClick={() => router.push("/brand/campaigns")}
            >
                <ChevronLeft className="w-4 h-4" /> Back to Campaigns
            </Button>


                <Tabs className="mt-2" defaultValue="overview">
                    <TabsList className="gap-2 ">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="products">Products</TabsTrigger>
                        <TabsTrigger value="creators">Creators</TabsTrigger>
                        <TabsTrigger value="invites">Invites</TabsTrigger>
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <Overview campaignId={campaignId} />
                    </TabsContent>
                    <TabsContent value="products">
                        <Products campaignId={campaignId}/>
                    </TabsContent>
                    <TabsContent value="invites">
                        <Invites campaignId={campaignId}/>
                    </TabsContent>
                    <TabsContent value="creators">
                        <Creators campaignId={campaignId}/>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default BrandCampaign;
