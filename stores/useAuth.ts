import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";
import { useAuthStoreType } from "@/lib/types";
import { queryClient } from "@/lib/utils";

const useAuthStore = create<useAuthStoreType>((set) => ({
  user: null,
  isUserLoading: true,
  logout: async (router) => {
    set({ user: null, isUserLoading: false });
    try {
      const res = await axios.post("/api/auth/logout");
      if (res.status === 200) {
        queryClient.clear();
        toast.success(res.data.msg);
        router.push("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.msg ||
          "Something went wrong. Please try again.";
        toast.error(errorMsg);
      } else {
        toast.error("An unexpected error occurred.");
        router.push("/login");
      }
    }
  },
  signup: async (data, router) => {
    try {
      const res = await axios.post("/api/auth/signup", data);

      if (res.status === 200) {
        queryClient.clear();
        toast.success("Account created successfully");

        set({ user: res.data, isUserLoading: false });
        if (res.data.role === "BRAND") {
          router.push("/onboarding/brand");
        } else {
          router.push("/onboarding/creator");
        }
      }

      toast.error("Failed to create account");
      return null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.msg ||
          "Something went wrong. Please try again.";
        toast.error(errorMsg);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  },

  login: async (data, router) => {
    try {
      const res = await axios.post("/api/auth/login", data);

      if (res.status === 200) {
        queryClient.clear();
        toast.success("You’re now logged in.");
        const user = res.data;
        set({ user, isUserLoading: false });
        // redirect logic
        if (user.role === "BRAND" && !user.brandProfile) {
          router.replace("/onboarding/brand");
          return;
        }

        if (user.role === "CREATOR" && !user.creatorProfile) {
          router.replace("/onboarding/creator");
          return;
        }

        // normal dashboards
        router.replace(user.role === "CREATOR" ? "/creator" : "/brand");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.msg ||
          "Something went wrong. Please try again.";
        toast.error(errorMsg);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  },

  setUser: (user) => set({ user }),
  setIsUserLoading: (value) => set({ isUserLoading: value }),
}));

export default useAuthStore;
