"use client"
import { trpc } from "@/app/_trpc/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreatorNicheType } from "@/lib/types";
import useAuthStore from "@/stores/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function CreatorOnboarding() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient();
  const router = useRouter();
  useEffect(() => {
    if (!user) return;
  }, [user]);
  const [data, setData] = useState<{
    name: string;
    bio: string;
    niche: CreatorNicheType
  }>({
    name: "",
    bio: "",
    niche: "OTHER"
  });
  const createCreatorProfile = trpc.profile.createCreatorProfile.useMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push(`/creator`);
    },
    onError: (err) => {

      toast.error(err.message || "Something went wrong");
    },
  });
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCreatorProfile.mutate(data)
  }
  return (
    <><div className="min-h-screen w-full flex items-center justify-center px-4 py-16 bg-primary/10">
      <div className="w-full max-w-3xl bg-white/30 rounded-3xl border p-10 md:p-14 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Set Up Your Creator Profile
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Enter your information to continue.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-12">
          <div className="space-y-6">
            <div className="flex flex-col">
              <Label className="text-sm font-medium mb-2">Your Name</Label>
              <Input
                className="h-12 rounded-xl border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary transition"
                placeholder="Enter your name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col">
              <Label className="text-sm font-medium mb-2">Your Bio</Label>
              <Textarea
                className="min-h-[130px] rounded-xl border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary transition"
                placeholder="Write a short introduction about yourself..."
                value={data.bio}
                onChange={(e) => setData({ ...data, bio: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col">
              <Label className="text-sm font-medium mb-2">Your Niche</Label>
              <Select
                value={data.niche}
                onValueChange={(niche: CreatorNicheType) => setData({ ...data, niche })}

              >
                <SelectTrigger className="min-h-12 rounded-xl border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary transition">
                  <SelectValue placeholder="Select your niche" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-auto">
                  <SelectItem value="FASHION">Fashion</SelectItem>
                  <SelectItem value="BEAUTY">Beauty</SelectItem>
                  <SelectItem value="TECH">Tech</SelectItem>
                  <SelectItem value="GAMING">Gaming</SelectItem>
                  <SelectItem value="FITNESS">Fitness</SelectItem>
                  <SelectItem value="LIFESTYLE">Lifestyle</SelectItem>
                  <SelectItem value="FOOD">Food</SelectItem>
                  <SelectItem value="TRAVEL">Travel</SelectItem>
                  <SelectItem value="EDUCATION">Education</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>

                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-2xl bg-primary text-white font-medium hover:bg-primary-dark transition flex items-center justify-center gap-2"
            disabled={createCreatorProfile.isPending}
          >
            {createCreatorProfile.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Complete Onboarding"
            )}
          </Button>
        </form>
      </div>

    </div>
    </>
  )
}

export default CreatorOnboarding