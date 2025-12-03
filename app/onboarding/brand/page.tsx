"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/app/_trpc/trpc";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { IndustryCategoryType } from "@/lib/types";
import useAuthStore from "@/stores/useAuth";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
export default function BrandOnboarding() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const { user } = useAuthStore()
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!user) return;
  }, [user]);


  const [data, setData] = useState<{
    name: string;
    websiteUrl: string;
    industry: IndustryCategoryType;
    description: string;
    contactEmail: string;
  }>({
    name: "",
    websiteUrl: "",
    industry: "OTHER",
    description: "",
    contactEmail: "",
  });


  const createBrandProfile = trpc.profile.createBrandProfile.useMutation({
    onSuccess: (res) => {
      setApiKey(res.apiKey);
      setDialogOpen(true);
      queryClient.invalidateQueries({ queryKey: ["user"] });

    },
    onError: (err) => {

      toast.error(err.message || "Something went wrong");
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contactEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // URL validation (basic)
    try {
      new URL(data.websiteUrl);
    } catch (err) {
      toast.error("Please enter a valid website URL.");
      return;
    }

    // If validations pass, send API request
    createBrandProfile.mutate(data);
  };


  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center px-4 py-16 bg-primary/10">

        <div className="w-full max-w-3xl bg-white rounded-3xl border p-10 md:p-14 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Set Up Your Brand Profile
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Enter your brand information to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-12">

            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Basic Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <Label className="text-sm font-medium mb-2">Brand Name</Label>
                  <Input
                    className="h-12 rounded-xl border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary transition"
                    placeholder="Your brand name"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <Label className="text-sm font-medium mb-2">Contact Email</Label>
                  <Input
                    className="h-12 rounded-xl border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary transition"
                    placeholder="brand@example.com"
                    value={data.contactEmail}
                    onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Business Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <Label className="text-sm font-medium mb-2">Website URL</Label>
                  <Input
                    className="h-12 rounded-xl border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary transition"
                    placeholder="https://brand.com"
                    value={data.websiteUrl}
                    onChange={(e) => setData({ ...data, websiteUrl: e.target.value })}
                  />
                </div>

                <div className="flex flex-col">
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
              </div>
            </div>

            {/* Brand Description */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Brand Description
              </h3>

              <div className="flex flex-col">
                <Label className="text-sm font-medium mb-2">About Your Brand</Label>
                <Textarea
                  className="min-h-[130px] rounded-xl border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary transition"
                  placeholder="Explain what your brand does..."
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-2xl bg-primary text-white font-medium hover:bg-primary-dark transition flex items-center justify-center gap-2"
              disabled={createBrandProfile.isPending}
            >
              {createBrandProfile.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Complete Onboarding"
              )}
            </Button>
          </form>
        </div>
      </div>




      {/* SUCCESS MODAL WITH API KEY */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Your Brand Profile is Ready</DialogTitle>
            <DialogDescription>
              Copy and store your API key securely.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            <Label>Your API Key</Label>
            <div className="flex items-center gap-2">
              <Input value={apiKey} readOnly className="h-12" />
              <Button
                type="button"
                variant="secondary"
                className="h-12"
                onClick={() => {
                  navigator.clipboard.writeText(apiKey);
                  toast.success("API key copied to clipboard");
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>

            </div>

            <Button
              className="w-full h-12 mt-4"
              onClick={() => {
                setDialogOpen(false);
                window.location.href = "/dashboard";
              }}
            >
              Go to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
