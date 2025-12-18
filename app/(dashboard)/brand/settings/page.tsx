"use client";

import { trpc } from "@/app/_trpc/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IndustryCategoryType } from "@/lib/types";
import useAuthStore from "@/stores/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function BrandSettings() {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [data, setData] = useState<{
        name: string;
        websiteUrl: string;
        industry: IndustryCategoryType;
        description: string;
        contactEmail: string;
    }>({
        name: user?.brandProfile?.name ?? "",
        websiteUrl: user?.brandProfile?.websiteUrl ?? "",
        industry: user?.brandProfile?.industry ?? "OTHER",
        description: user?.brandProfile?.description ?? "",
        contactEmail: user?.brandProfile?.contactEmail ?? "",
    });
    useEffect(() => {
    if (!user?.brandProfile) return;

    setData({
        name: user.brandProfile.name ?? "",
        websiteUrl: user.brandProfile.websiteUrl ?? "",
        industry: user.brandProfile.industry ?? "OTHER",
        description: user.brandProfile.description ?? "",
        contactEmail: user.brandProfile.contactEmail ?? "",
    });
}, [user?.brandProfile]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };


    const updateBrandProfile = trpc.profile.updateBrandProfile.useMutation({
        onSuccess: async (data) => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            toast.success(data.message)
        },
        onError: (err) => {

            toast.error(err.message || "Something went wrong");
        },
    })
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.contactEmail)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        // URL validation (basic)
        try {
            new URL(data.websiteUrl);
        } catch {
            toast.error("Please enter a valid website URL.");
            return;
        }

        // If validations pass, send API request
        updateBrandProfile.mutate(data);
    }
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Profile Settings
                    </h1>
                    <p className="text-sm text-gray-500">
                        Update your brand information and account details.
                    </p>
                </div>
            </div>

            <form className="space-y-5 p-5 rounded-xl bg-white shadow-sm" onSubmit={onSubmit}>
                <div>
                    <Label className="text-sm font-medium mb-2">Name</Label>
                    <Input
                        className="h-12 rounded-xl border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary transition"
                        name="name"
                        type="text"
                        placeholder="Update your brand name"
                        value={data.name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label className="text-sm font-medium mb-2">Description</Label>

                    <Textarea
                        name="description"
                        className="min-h-[130px] rounded-xl border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary transition"
                        placeholder="Explain what your brand does..."
                        value={data.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label className="text-sm font-medium mb-2">Industry</Label>
                    <Select
                        value={data.industry}
                        onValueChange={(industry: IndustryCategoryType) => setData({ ...data, industry })}

                    >
                        <SelectTrigger className="min-h-12 rounded-xl border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary transition">
                            <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-auto">
                            <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                            <SelectItem value="CONSUMER_GOODS">Consumer Goods</SelectItem>
                            <SelectItem value="FOOD_AND_HEALTH">Food & Health</SelectItem>
                            <SelectItem value="ENTERTAINMENT">Entertainment</SelectItem>
                            <SelectItem value="TRAVEL_AND_HOSPITALITY">Travel & Hospitality</SelectItem>
                            <SelectItem value="FINANCE">Finance</SelectItem>
                            <SelectItem value="AUTOMOTIVE">Automotive</SelectItem>
                            <SelectItem value="EDUCATION">Education</SelectItem>
                            <SelectItem value="REAL_ESTATE">Real Estate</SelectItem>
                            <SelectItem value="PARENTING">Parenting</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="text-sm font-medium mb-2">Website URL</Label>
                    <Input
                        className="h-12 rounded-xl border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary transition"
                        name="websiteUrl"
                        type="text"
                        placeholder="Update your website URL"
                        value={data.websiteUrl}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label className="text-sm font-medium mb-2">Contact Email</Label>
                    <Input
                        className="h-12 rounded-xl border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary transition"
                        name="contactEmail"
                        type="text"
                        placeholder="Update your contact email"
                        value={data.contactEmail}
                        onChange={handleChange}
                    />
                </div>

                <Button type="submit" disabled={updateBrandProfile.isPending}>
                    {updateBrandProfile.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />

                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </form>
        </div>
    );
}

export default BrandSettings;
