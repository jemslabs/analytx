"use client"
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

function BrandCampaigns() {
    const router = useRouter();
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
                    <p className="text-sm text-gray-500">
                        View, create, and manage all your brand campaigns.
                    </p>

                </div>

                <Button onClick={()=>router.push("/brand/campaigns/create")}><Plus />Create Campaign</Button>
            </div>
        </div>
    );
}

export default BrandCampaigns;