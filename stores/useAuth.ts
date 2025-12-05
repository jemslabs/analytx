import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";
import { useAuthStoreType } from "@/lib/types";

const useAuthStore = create<useAuthStoreType>((set) => ({
  user: null,
  isUserLoading: true,
  logout: async () => {
    try {
      const res = await axios.post("/api/auth/logout");
      if (res.status === 200) {
        toast.success(res.data.msg);
        set({
          user: null,
          isUserLoading: false, // recommended
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.msg ||
          "Something went wrong. Please try again.";
        toast.error(errorMsg);
        return null;
      } else {
        toast.error("An unexpected error occurred.");
        return null;
      }
    }
  },
  signup: async (data) => {
    try {
      const res = await axios.post("/api/auth/signup", data);

      if (res.status === 200) {
        toast.success("Account created successfully");

        set({ user: res.data, isUserLoading: false });
        return res.data;
      }

      toast.error("Failed to create account");
      return null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.msg ||
          "Something went wrong. Please try again.";
        toast.error(errorMsg);
        return null;
      } else {
        toast.error("An unexpected error occurred.");
        return null;
      }
    }
  },

  login: async (data) => {
    try {
      const res = await axios.post("/api/auth/login", data);

      if (res.status === 200) {
        toast.success("You’re now logged in.");

        // Immediately update user state
        const user = res.data;
        set({ user, isUserLoading: false });

        return user;
      }

      return null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.msg ||
          "Something went wrong. Please try again.";
        toast.error(errorMsg);
        return null;
      } else {
        toast.error("An unexpected error occurred.");
        return null;
      }
    }
  },

  setUser: (user) => set({ user }),
  setIsUserLoading: (value) => set({ isUserLoading: value }),
}));

export default useAuthStore;
