import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";
import { useAuthStoreType } from "@/lib/types";

const useAuthStore = create<useAuthStoreType>((set) => ({
  user: null,
  signup: async (data) => {
    try {
      const res = await axios.post("/api/auth/signup", data);
      if (res.status === 200) {
        toast.success(res.data.msg);
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
  login: async (data) => {
    try {
      const res = await axios.post("/api/auth/login", data);
      if (res.status === 200) {
        set({ user: res.data });
        toast.success("You’re now logged in.");
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
  fetchUser: async () => {
    try {
      const res = await axios.get("/api/auth/user");
      if (res.status === 200) {
        set({ user: res.data });
      } else {
        set({ user: null });
      }
    } catch {
      set({ user: null });
    }
  },
}));

export default useAuthStore;
