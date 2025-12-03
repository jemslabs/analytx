"use client";

import useAuthStore from "@/stores/useAuth";

export function GlobalUserLoader() {
  const { isUserLoading } = useAuthStore();

  if (!isUserLoading) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/70 backdrop-blur-md ">
      <div className="flex flex-col items-center gap-4 px-8 py-6 rounded-xl shadow-lg bg-white border border-black/10">

        <p className="text-sm font-medium">Loading your account…</p>

        <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-black animate-progress-indeterminate" />
        </div>
      </div>
    </div>
  );
}
