"use client";

import AddProduct from "@/components/AddProduct";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { trpc } from "@/app/_trpc/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";


export default function BrandProducts() {
  const utils = trpc.useContext();

  const { data, isLoading, error } = trpc.product.getProducts.useQuery();

  const updateStatus = trpc.product.updateProduct.useMutation({
    onSuccess: (_, { status }) => {
      toast.success(`Status updated to ${status}`);
      utils.product.getProducts.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update status");
    },
  });

  const handleStatusToggle = (productId: number, currentStatus: string) => {
    const newStatus = currentStatus === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";
    updateStatus.mutate({ productId, status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-gray-500">
            Manage your product catalog for campaigns.
          </p>
        </div>

        <Dialog>
          <DialogTrigger className="bg-black text-white rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-black/90 transition cursor-pointer font-semibold">
            <Plus className="h-4 w-4" />
            Add Product
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add a product</DialogTitle>
              <DialogDescription>
                Add a new product to your catalog.
              </DialogDescription>
            </DialogHeader>

            <AddProduct />
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-black">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                SKU ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading
              ? Array.from({ length: 3 }).map((_, idx) => (
                <tr key={idx}>
                  <td colSpan={5} className="px-6 py-4">
                    <Skeleton className="h-4 w-full" />
                  </td>
                </tr>
              ))
              : error
                ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-red-600 text-center">
                      {error.message}
                    </td>
                  </tr>
                )
                : data?.products?.length === 0
                  ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-gray-500 text-center">
                        No products found. Add your first product!
                      </td>
                    </tr>
                  )
                  : data?.products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.skuId}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">₹{product.basePrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 wrap-break-word max-w-xs">
                        <a href={product.productUrl} target="_blank" className="underline hover:text-black">
                          {product.productUrl}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={product.status === "AVAILABLE"}
                            onCheckedChange={() => handleStatusToggle(product.id, product.status)}
                            disabled={updateStatus.isPending}
                            className="cursor-pointer"
                          />
                          <span className={product.status === "AVAILABLE"
                            ? "text-xs font-semibold bg-green-100 text-green-800 rounded-full px-2 py-1"
                            : "text-xs font-semibold bg-red-100 text-red-800 rounded-full px-2 py-1"
                          }>
                            {product.status === "AVAILABLE" ? "AVAILABLE" : "UNAVAILABLE"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
