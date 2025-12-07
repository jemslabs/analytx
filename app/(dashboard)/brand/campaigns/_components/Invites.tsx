"use client";

import { trpc } from "@/app/_trpc/trpc";
import { useState } from "react";
import { Plus, Mail, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function Invites({ campaignId }: { campaignId: number }) {
    const { data, isLoading, refetch } =
        trpc.campaign.getCampaignInvites.useQuery(
            { campaignId },
            {
                staleTime: 1000 * 30
            }
        );

    const sendInvite = trpc.campaign.sendCampaignInvite.useMutation({
        onSuccess: (res) => {
            toast.success(res.message);
            setEmail("");
            setOpen(false);
            refetch();
        },
        onError: (err) => {
            toast.error(err.message || "Something went wrong");
        },
    });

    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");

    const invites = data?.invites ?? [];

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <p className="text-gray-700 text-sm font-medium">
                    {invites.length} invites sent
                </p>

                <Button
                    className="flex items-center gap-2 rounded-xl shadow-sm"
                    onClick={() => setOpen(true)}
                    disabled={isLoading}
                >
                    <Plus className="h-4 w-4" />
                    Send Invite
                </Button>
            </div>

            {/* TABLE */}
            <div className="border border-gray-200 bg-white overflow-x-auto rounded-xl ">
                {isLoading ? (
                    <div className="p-6 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 w-full rounded-xl bg-gray-100 animate-pulse" />
                        ))}
                    </div>
                ) : invites.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center text-gray-500 space-y-2">
                        <Mail className="h-8 w-8 text-gray-400" />
                        <p className="font-medium">No invites yet</p>
                        <p className="text-xs">Start sending invites to show them here</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-white text-left text-xs border-b bg-black">
                                <th className="py-3 px-5 font-semibold tracking-wide">CREATOR</th>
                                <th className="py-3 px-5 font-semibold tracking-wide">STATUS</th>
                                <th className="py-3 px-5 font-semibold tracking-wide">SENT ON</th>
                                <th className="py-3 px-5"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {invites.map((inv) => (
                                <tr
                                    key={inv.id}
                                    className="border-b last:border-none hover:bg-gray-50 transition-colors"
                                >
                                    {/* CREATOR */}
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-full flex items-center justify-center">
                                                <Mail className="h-4 w-4 text-gray-600" />
                                            </div>

                                            <span className="text-sm font-medium text-gray-800">
                                                {inv.email}
                                            </span>
                                        </div>
                                    </td>

                                    {/* STATUS */}
                                    <td className="py-4 px-5">
                                        {inv.status === "PENDING" ? (
                                            <span className="text-[11px] bg-yellow-100 text-yellow-700 px-3 py-[5px] rounded-full flex items-center gap-1 w-fit font-medium">
                                                <span className="h-2 w-2 bg-yellow-500 rounded-full" />
                                                Pending
                                            </span>
                                        ) : (
                                            <span className="text-[11px] bg-green-100 text-green-700 px-3 py-[5px] rounded-full flex items-center gap-1 w-fit font-medium">
                                                <span className="h-2 w-2 bg-green-500 rounded-full" />
                                                Accepted
                                            </span>
                                        )}
                                    </td>

                                    {/* SENT DATE */}
                                    <td className="py-4 px-5 text-gray-600 whitespace-nowrap">
                                        {new Date(inv.createdAt).toLocaleDateString("en-US", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>

                                    <td className="px-5"></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                )}
            </div>


            {/* SEND INVITE MODAL */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Send Campaign Invite</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Creator Email</p>
                            <Input
                                type="email"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={sendInvite.isPending}
                            />
                        </div>

                        <Button
                            className={cn(
                                "w-full rounded-xl",
                                sendInvite.isPending && "opacity-70 cursor-not-allowed"
                            )}
                            disabled={sendInvite.isPending || !email}
                            onClick={() =>
                                sendInvite.mutate({
                                    campaignId,
                                    email,
                                })
                            }
                        >
                            {sendInvite.isPending ? "Sending..." : "Send Invite"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
