"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sanitizePrice } from "@/lib/sanitizePrice";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/trpc";
import { Loader2 } from "lucide-react";

export default function AddProduct() {
    const [data, setData] = useState({
        name: "",
        basePrice: "" as string | number,
        skuId: "",
        productUrl: ""
    });
    const utils = trpc.useContext();
    const updateField = (key: string, value: string) => {
        if (key === "basePrice") {
            setData(prev => ({ ...prev, [key]: sanitizePrice(value) }));
        } else {
            setData(prev => ({ ...prev, [key]: value }));
        }
    };

    const addProduct = trpc.product.createProduct.useMutation({
        onSuccess: (data) => {
            toast.success(data.message || "Product Added")
            utils.product.getProducts.invalidate();
        },
        onError: (err) => {

            toast.error(err.message || "Something went wrong");
        },
    })
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            new URL(data.productUrl);
        } catch {
            toast.error("Please enter a valid product URL.");
            return;
        }
        const formData = {
            ...data,
            basePrice: Number(data.basePrice)
        };



        addProduct.mutate(formData);
    };

    return (
        <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-1">
                <Label>
                    Product Name <span className="text-red-600">*</span>
                </Label>
                <Input
                    value={data.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Example: Wireless Earbuds"
                    required
                />
            </div>

            <div className="space-y-1">
                <Label>
                    Base Price (INR) <span className="text-red-600">*</span>
                </Label>
                <Input
                    type="text"
                    value={data.basePrice}
                    onChange={(e) => updateField("basePrice", e.target.value)}
                    placeholder="499"
                    min={0}
                    required
                />
            </div>

            <div className="space-y-1">
                <Label>
                    SKU ID <span className="text-red-600">*</span>
                </Label>
                <Input
                    className="bg-red-50/40"
                    value={data.skuId}
                    onChange={(e) => updateField("skuId", e.target.value)}
                    placeholder="Unique SKU for this product"
                    required
                />
                <p className="text-xs text-red-600 font-medium">
                    Once added, the SKU ID cannot be edited. It must be unique and is used to track product performance.
                </p>
            </div>

            <div className="space-y-1">
                <Label>
                    Product URL <span className="text-red-600">*</span>
                </Label>
                <Input
                    value={data.productUrl}
                    onChange={(e) => updateField("productUrl", e.target.value)}
                    placeholder="https://brand.com/products/your-product"
                    required
                />
            </div>


            <Button type="submit" className="w-full py-2 rounded-xl" disabled={addProduct.isPending}>
                {addProduct.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    "Add Product"
                )}
            </Button>
        </form>
    );
}
