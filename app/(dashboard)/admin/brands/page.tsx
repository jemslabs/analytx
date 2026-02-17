"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Brand {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  subscription: {
    usedFreeTrial: boolean;
  } | null;
}

const fetchBrands = async (): Promise<Brand[]> => {
  const res = await axios.get("/api/admin/fetch-brands", {
    withCredentials: true,
  });
  return res.data;
};

function ListOfBrands() {
  const { data: brands, isLoading, isError, error } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: fetchBrands,
    staleTime: 1000 * 60
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>All Registered Brands</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading brands...
          </div>
        )}

        {isError && (
          <p className="text-sm text-red-600">
            {(error as any)?.response?.data?.msg ||
              "Failed to load brands."}
          </p>
        )}

        {!isLoading && !isError && (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Free Trial</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {brands?.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-sm text-muted-foreground"
                    >
                      No brands found.
                    </TableCell>
                  </TableRow>
                )}

                {brands?.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell className="font-medium">
                      {brand.id}
                    </TableCell>

                    <TableCell>{brand.name}</TableCell>

                    <TableCell>
                      {new Date(brand.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      {brand.subscription?.usedFreeTrial ? (
                        <Badge variant="destructive">Used</Badge>
                      ) : (
                        <Badge variant="secondary">Not Used</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ListOfBrands;
