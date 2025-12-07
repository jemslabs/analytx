"use client";

import { trpc } from "@/app/_trpc/trpc";
import { useState } from "react";
import { Package, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Products({ campaignId }: { campaignId: number }) {
    const { data, isLoading, refetch } = trpc.campaign.getCampaignProducts.useQuery({ campaignId });
    const { data: allProducts, isLoading: isLoadingProducts } =
        trpc.product.getProducts.useQuery();

    const addProduct = trpc.campaign.addProductInCampaign.useMutation({
        onSuccess: () => {
            setOpen(false);
            refetch();
        },
        onError: (err) => {
            toast.error(err.message || "Something went wrong");
        }
    });

    const removeProduct = trpc.campaign.removeProductFromCampaign.useMutation({
        onSuccess: (data) => {
            toast.success(data.message);
            refetch();
        },
        onError: (err) => {
            toast.error(err.message || "Something went wrong");
        }
    })
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-gray-700 text-sm font-medium">
                    {data?.products?.length ?? 0} products in this campaign
                </p>

                <Button
                    className="flex items-center gap-2 rounded-xl shadow-sm"
                    onClick={() => setOpen(true)}
                    disabled={isLoading}
                >
                    <Plus className="h-4 w-4" />
                    Add Product
                </Button>
            </div>

            {/* TABLE */}
            <div className="border border-gray-200 bg-white overflow-x-auto rounded-xl">
                {isLoading ? (
                    <div className="p-6 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-12 w-full rounded-xl bg-gray-100 animate-pulse"
                            />
                        ))}
                    </div>
                ) : data?.products.length === 0 ? (
                    // EMPTY STATE (no header)
                    <div className="py-12 flex flex-col items-center justify-center text-center text-gray-500 space-y-2">
                        <Package className="h-8 w-8 text-gray-400" />
                        <p className="font-medium">No products added yet</p>
                        <p className="text-xs">Start adding products to show them here</p>
                    </div>
                ) : (
                    // TABLE WITH HEADER
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-white text-left text-xs border-b bg-black">
                                <th className="py-3 px-4 font-medium">PRODUCT</th>
                                <th className="py-3 px-4 font-medium">SKU</th>
                                <th className="py-3 px-4 font-medium">PRICE</th>
                                <th className="py-3 px-4"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {data?.products?.map((p) => (
                                <tr
                                    key={p.id}
                                    className="border-b last:border-none hover:bg-gray-50/50 transition"
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <Package className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <span className="font-medium">{p.product.name}</span>
                                        </div>
                                    </td>

                                    <td className="py-3 px-4 text-gray-600">
                                        {p.product.skuId}
                                    </td>

                                    <td className="py-3 px-4">
                                        ₹{p.product.basePrice}
                                    </td>

                                    <td className="py-3 px-4">
                                        <button
                                            className="p-2 rounded-lg cursor-pointer"
                                            disabled={addProduct.isPending}
                                            onClick={() =>
                                                removeProduct.mutate({ campaignProductId: p.id })
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>


            {/* SELECT PRODUCT MODAL */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Select a Product</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 max-h-[400px] overflow-auto">
                        {isLoadingProducts ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="h-14 w-full bg-gray-100 rounded-xl animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : (
                            allProducts?.products?.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() =>
                                        addProduct.mutate({
                                            campaignId,
                                            productId: product.id,
                                        })
                                    }
                                    disabled={addProduct.isPending}
                                    className={cn(
                                        "w-full flex items-center justify-between p-3 rounded-xl border",
                                        "hover:bg-gray-100 transition text-left cursor-pointer",
                                        addProduct.isPending && "opacity-70 cursor-not-allowed"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-200 rounded-lg">
                                            <Package className="h-4 w-4 text-gray-600" />
                                        </div>

                                        <div>
                                            <p className="font-medium text-gray-800">{product.name}</p>
                                            <p className="text-xs text-gray-500">{product.skuId}</p>
                                        </div>
                                    </div>

                                    <p className="font-semibold text-gray-800">₹{product.basePrice}</p>
                                </button>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
