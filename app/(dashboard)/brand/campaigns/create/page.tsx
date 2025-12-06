"use client";

import { useState } from "react";
import { trpc } from "@/app/_trpc/trpc";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronLeft, Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useRouter } from "next/navigation";
import { sanitizePrice } from "@/lib/sanitizePrice";

export default function CreateCampaign() {
    const router = useRouter();
    const [data, setData] = useState<{
        name: string,
        description: string,
        redirectUrl: string,
        payoutModel: "BOTH" | "CPS" | "CPC",
        cpsCommissionType: "PERCENTAGE" | "FIXED",
        cpsValue: string,
        cpcValue: string
    }>({
        name: "",
        description: "",
        redirectUrl: "",
        payoutModel: "BOTH", // CPS | CPC | BOTH
        cpsCommissionType: "PERCENTAGE", // PERCENTAGE | FIXED
        cpsValue: "",
        cpcValue: ""
    });


    const updateField = (key: string, value: string) => {
        // Add any numeric fields here
        const numericFields = ["cpsValue", "cpcValue"];

        if (numericFields.includes(key)) {
            setData(prev => ({
                ...prev,
                [key]: sanitizePrice(value)
            }));
        } else {
            setData(prev => ({
                ...prev,
                [key]: value
            }));
        }
    };

    const createCampaign = trpc.campaign.createCampaign.useMutation({
        onSuccess: (res) => {
            toast.success(res.message || "Campaign Created");
        },
        onError: (err) => {
            toast.error(err.message || "Something went wrong");
        }
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        try {
            new URL(data.redirectUrl);
        } catch {
            toast.error("Please enter a valid redirect URL");
            return;
        }

        const formData = {
            ...data,
            cpsValue: Number(data.cpsValue),
            cpcValue: Number(data.cpcValue),
        };

        createCampaign.mutate(formData);
    };

    return (
        <div>

            <Button
                type="button"
                variant="ghost"
                className="p-0 flex items-center gap-1 text-gray-600"
                onClick={() => router.push("/brand/campaigns")}
            >
                <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <div className="mb-3">

                <h1 className="text-2xl font-semibold tracking-tight">Create Campaign</h1>
                <p className="text-sm text-gray-500">Fill out all details to create a campaign</p>
            </div>

            <form
                className="p-5 rounded-xl space-y-6 bg-white shadow-sm"
                onSubmit={onSubmit}
            >
                {/* BASIC INFO */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <Label>
                            Campaign Name <span className="text-red-600">*</span>
                        </Label>
                        <Input
                            value={data.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            placeholder="Example: Summer Sale 2025"
                            required
                            className="h-12 rounded-xl border-gray-300"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>
                            Description <span className="text-red-600">*</span>
                        </Label>
                        <Textarea
                            value={data.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            placeholder="Short description of the campaign"
                            required
                            className="rounded-xl border border-gray-300"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>
                            Redirect URL <span className="text-red-600">*</span>
                        </Label>
                        <Input
                            value={data.redirectUrl}
                            onChange={(e) => updateField("redirectUrl", e.target.value)}
                            placeholder="https://brand.com"
                            required
                            className="h-12 rounded-xl border-gray-300"
                        />
                        <p className="text-xs text-gray-500">
                            Users visiting the creator’s link will be redirected here.
                        </p>
                    </div>
                </div>

                {/* PAYOUT MODEL */}
                <div className="space-y-2">
                    <Label>Payout Model</Label>
                    <Select
                        value={data.payoutModel}
                        onValueChange={(value) => updateField("payoutModel", value)}
                    >
                        <SelectTrigger className="h-12 border-gray-300">
                            <SelectValue placeholder="Select payout model" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CPS">CPS (Cost Per Sale)</SelectItem>
                            <SelectItem value="CPC">CPC (Cost Per Click)</SelectItem>
                            <SelectItem value="BOTH">Both (CPS + CPC)</SelectItem>
                        </SelectContent>
                    </Select>

                    <p className="text-xs text-gray-500">
                        <span className="font-semibold">CPS:</span> Pay creators when a sale happens.
                        <span className="font-semibold ml-2">CPC:</span> Pay creators per valid click.
                    </p>
                </div>

                {/* SETTINGS ACCORDION */}
                <Accordion type="single" collapsible className="w-full">

                    {(data.payoutModel === "CPS" || data.payoutModel === "BOTH") && (
                        <AccordionItem value="cps">
                            <AccordionTrigger className="font-semibold  cursor-pointer">
                                CPS Settings
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-3 mt-2 p-3 bg-gray-50 border rounded-lg">
                                    <p className="text-xs text-gray-500">
                                        Reward creators when they generate a sale.
                                    </p>

                                    <div className="space-y-2">
                                        <Label>Commission Type</Label>
                                        <Select
                                            value={data.cpsCommissionType}
                                            onValueChange={(value) =>
                                                updateField("cpsCommissionType", value)
                                            }
                                        >
                                            <SelectTrigger className="h-10 border-gray-300">
                                                <SelectValue placeholder="Select commission type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                                                <SelectItem value="FIXED">Fixed Amount (INR)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <Label>
                                            CPS Value <span className="text-red-600">*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            value={data.cpsValue}
                                            onChange={(e) =>
                                                updateField("cpsValue", e.target.value)
                                            }
                                            placeholder={
                                                data.cpsCommissionType === "PERCENTAGE"
                                                    ? "Commission % (e.g., 10)"
                                                    : "Fixed INR amount (e.g., 50)"
                                            }
                                            required
                                            className="h-12 rounded-xl border-gray-300"
                                        />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {(data.payoutModel === "CPC" || data.payoutModel === "BOTH") && (
                        <AccordionItem value="cpc">
                            <AccordionTrigger className="font-semibold cursor-pointer">
                                CPC Settings
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-3 mt-2 p-3 bg-gray-50 border rounded-lg">
                                    <p className="text-xs text-gray-500">
                                        Reward creators when they bring traffic.
                                    </p>

                                    <div className="space-y-1">
                                        <Label>
                                            CPC Value (INR) <span className="text-red-600">*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            value={data.cpcValue}
                                            onChange={(e) => updateField("cpcValue", e.target.value)}
                                            placeholder="Cost per click (INR)"
                                            required
                                            className="h-12 rounded-xl border-gray-300"
                                        />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                </Accordion>
                <Button
                    type="submit"
                    disabled={createCampaign.isPending}
                >
                    {createCampaign.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        "Create Campaign"
                    )}
                </Button>
            </form>
        </div>


    );
}
