import { trpc } from '@/app/_trpc/trpc';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
    CalendarDays,
    Megaphone,
    Play,
    Pen,
    Check,
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
export default function Settings({ campaignId }: { campaignId: number }) {

    const { data, isLoading, refetch } = trpc.campaign.getCampaignDetails.useQuery(
        { campaignId },
        { staleTime: 1000 * 30 }
    );


    const startCampaign = trpc.campaign.startCampaign.useMutation({
        onSuccess: (res) => {
            toast.success(res.message);
            refetch();
        },
        onError: (err) => toast.error(err.message),
    });

    const completeCampaign = trpc.campaign.completeCampaign.useMutation({
        onSuccess: (res) => {
            toast.success(res.message);
            refetch();
        },
        onError: (err) => toast.error(err.message),
    });
    const updateCampaign = trpc.campaign.updateCampaign.useMutation({
        onSuccess: (res) => {
            toast.success(res.message);
            refetch();
        },
        onError: (err) => toast.error(err.message),
    });


    const [editOpen, setEditOpen] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedUrl, setEditedUrl] = useState("");
    useEffect(() => {
        if (data) {
            const campaign = data.campaign;
            setEditedName(campaign.name);
            setEditedUrl(campaign.redirectUrl);
        }
    }, [data]);
    if (isLoading) {
        return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Left Card */}
            <Card className="rounded-3xl border border-gray-200 p-6 bg-white/80 backdrop-blur">
                <Skeleton className="h-5 w-40 mb-6" />
                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2 pb-3 border-b">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </div>
            </Card>

            {/* Right Card */}
            <Card className="rounded-3xl border border-gray-200 p-6 bg-white/80 backdrop-blur">
                <Skeleton className="h-5 w-32 mb-6" />
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-2 pb-3 border-b">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    ))}

                    <div className="flex gap-3 pt-4">
                        <Skeleton className="h-9 w-32 rounded-xl" />
                        <Skeleton className="h-9 w-40 rounded-xl" />
                    </div>
                </div>
            </Card>

        </div>
        )
    }
    if (!data) return <div>No data found.</div>;
    const campaign = data.campaign;

    return (
        <div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campaign Details */}
                <Card
                    className={cn(
                        "rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-xl",
                        "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]"
                    )}
                >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-5">
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                Campaign Details
                            </CardTitle>
                            <Button
                                onClick={() => {
                                    setEditedName(campaign.name);
                                    setEditedUrl(campaign.redirectUrl);
                                    setEditOpen(true);
                                }}
                                className="px-3 py-1"
                            >
                                <Pen size={16} />
                                Edit
                            </Button>
                        </div>

                        <Megaphone className="h-5 w-5 text-gray-800" />
                    </CardHeader>



                    <CardContent className="text-sm space-y-5 text-gray-700">
                        <Detail label="Name" value={campaign.name} />

                        <Detail
                            label="Redirect URL"
                            value={
                                <a
                                    href={campaign.redirectUrl}
                                    target="_blank"
                                    className="underline text-blue-600"
                                >
                                    {campaign.redirectUrl}
                                </a>
                            }
                        />

                        <Detail label="Payout Model" value={campaign.payoutModel} />

                        <Detail
                            label="Commission Structure"
                            value={(() => {
                                const cps =
                                    (campaign.payoutModel === "CPS" ||
                                        campaign.payoutModel === "BOTH") &&
                                    (campaign.cpsCommissionType === "PERCENTAGE"
                                        ? `${campaign.cpsValue}% CPS`
                                        : `₹${campaign.cpsValue} CPS`);

                                const cpc =
                                    (campaign.payoutModel === "CPC" ||
                                        campaign.payoutModel === "BOTH") &&
                                    `₹${campaign.cpcValue} CPC`;

                                return cps && cpc ? `${cps} • ${cpc}` : cps || cpc || "--";
                            })()}
                        />
                    </CardContent>
                </Card>

                {/* Timeline */}
                <Card
                    className={cn(
                        "rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-xl",
                        "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]"
                    )}
                >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            Timeline
                        </CardTitle>
                        <CalendarDays className="h-5 w-5 text-gray-800" />
                    </CardHeader>

                    <CardContent className="text-sm space-y-5 text-gray-700">
                        <Detail
                            label="Created"
                            value={new Date(campaign.createdAt).toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        />

                        <Detail
                            label="Started"
                            value={
                                campaign.startedAt
                                    ? new Date(campaign.startedAt).toLocaleDateString("en-US", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })
                                    : "Not started"
                            }
                        />

                        <Detail
                            label="Completed"
                            value={
                                campaign.completedAt
                                    ?
                                    new Date(campaign.completedAt).toLocaleDateString("en-US", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })

                                    : "Not completed"
                            }
                        />

                        {/* ACTION BUTTONS */}
                        <div className="pt-4 flex gap-3">
                            <Button
                                onClick={() => startCampaign.mutate({ campaignId })}
                                disabled={Boolean(campaign.startedAt)}
                                className={cn("px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2")}
                            >
                                {startCampaign.isPending ? (
                                    "Starting..."
                                ) : (
                                    <>
                                        <Play size={16} />
                                        Start
                                    </>
                                )}
                            </Button>

                            {campaign.startedAt && (
                                <Button
                                    onClick={() => completeCampaign.mutate({ campaignId })}
                                    disabled={Boolean(campaign.completedAt)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2"
                                    )}
                                >
                                    {completeCampaign.isPending ? (
                                        "Completing..."
                                    ) : (
                                        <>
                                            <Check size={16} />
                                            Complete
                                        </>
                                    )}
                                </Button>
                            )}

                        </div>
                    </CardContent>
                </Card>

            </div>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Campaign</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-2">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Campaign Name</p>
                            <Input
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                placeholder="Campaign Name"
                            />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-700">Redirect URL</p>
                            <Input
                                value={editedUrl}
                                onChange={(e) => setEditedUrl(e.target.value)}
                                placeholder="https://example.com"
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-4 flex gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setEditOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={() => {
                                updateCampaign.mutate({
                                    campaignId,
                                    name: editedName,
                                    redirectUrl: editedUrl,
                                });

                                setEditOpen(false);
                            }}
                            disabled={updateCampaign.isPending}
                        >
                            {updateCampaign.isPending ? "Updating..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function Detail({ label, value }: { label: string; value: any }) {
    return (
        <div className="space-y-1 pb-3 border-b last:border-none">
            <p className="font-semibold text-gray-800">{label}</p>
            <p className="text-gray-600">{value}</p>
        </div>
    );
}
