"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/app/_trpc/trpc";
import useAuthStore from "@/stores/useAuth";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

function TrackingSetup() {
    const { user, setUser } = useAuthStore();
    const queryClient = useQueryClient();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [generatedKey, setGeneratedKey] = useState("");

    const generateKey = trpc.profile.generateAPIKey.useMutation({
        onSuccess: async (res) => {
            setGeneratedKey(res.apiKey);
            setDialogOpen(true);

            await queryClient.invalidateQueries({ queryKey: ["user"] });

            if (user?.brandProfile) {
                setUser({
                    ...user,
                    brandProfile: {
                        ...user.brandProfile,
                        apiKey: res.apiKey,
                    },
                });
            }
        },
        onError: (err) => {
            toast.error(err.message || "Something went wrong");
        },
    });

    const maskedKey = user?.brandProfile?.apiKey ? "•".repeat(28) : "";

    const scriptSnippet = `<script src="https://tryanalytx.com/tracker.js" data-api-key="YOUR_API_KEY"></script>`;

    const trackSnippet = `Analytx.trackSale({
    skuId: "SKU-001",
    salePrice: 499
    });`;

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Tracking Setup
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Add one script and track real sales from your creators.
                </p>
            </div>

            {/* STEP 1: API KEY */}
            <div className="p-5 rounded-xl space-y-4 bg-white shadow-sm">
                <h2 className="text-lg font-semibold text-gray-700">
                    Step 1: Generate API Key
                </h2>

                <p className="text-sm text-gray-500">
                    This key connects your website with Analytx.
                </p>

                <div className="flex gap-3">
                    <Input
                        disabled
                        value={maskedKey}
                        placeholder="No API key generated"
                        className="bg-gray-50"
                    />

                    <Button
                        onClick={() => generateKey.mutate()}
                        disabled={generateKey.isPending}
                    >
                        {generateKey.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : user?.brandProfile?.apiKey ? (
                            "Regenerate"
                        ) : (
                            "Generate"
                        )}
                    </Button>
                </div>
            </div>

            {/* STEP 2: ADD SCRIPT */}
            <div className="p-5 rounded-xl space-y-4 bg-white shadow-sm">
                <h2 className="text-lg font-semibold text-gray-700">
                    Step 2: Add Script to Website
                </h2>

                <p className="text-sm text-gray-500">
                    Paste this inside your website’s global layout or &lt;head&gt;.
                </p>

                <div className="flex gap-2">
                    <Input readOnly value={scriptSnippet} className="bg-gray-50" />
                    <Button
                        size="icon"
                        onClick={() => {
                            navigator.clipboard.writeText(scriptSnippet);
                            toast.success("Copied");
                        }}
                    >
                        <Copy className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* STEP 3: TRACK SALE */}
            <div className="p-5 rounded-xl space-y-4 bg-white shadow-sm">
                <h2 className="text-lg font-semibold text-gray-700">
                    Step 3: Track Sale
                </h2>

                <p className="text-sm text-gray-500">
                    Call this after a successful purchase (thank-you page).
                </p>

                <div className="flex gap-2">
                    <Input readOnly value={trackSnippet} className="bg-gray-50" />
                    <Button
                        size="icon"
                        onClick={() => {
                            navigator.clipboard.writeText(trackSnippet);
                            toast.success("Copied");
                        }}
                    >
                        <Copy className="w-4 h-4" />
                    </Button>
                </div>

                <ul className="text-sm text-gray-500 list-disc ml-5">
                    <li>Call only after payment success</li>
                    <li>Call once per order</li>
                    <li>Use correct SKU and final price</li>
                </ul>
            </div>

            {/* DIALOG */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Your API Key</DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-gray-500">
                        Copy this key. It will not be shown again.
                    </p>

                    <div className="flex gap-2 mt-3">
                        <Input value={generatedKey} readOnly />
                        <Button
                            size="icon"
                            onClick={() => {
                                navigator.clipboard.writeText(generatedKey);
                                toast.success("Copied");
                            }}
                        >
                            <Copy className="w-4 h-4" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default TrackingSetup;