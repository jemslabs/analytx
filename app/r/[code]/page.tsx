"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function RedirectPage() {
  const { code }: { code: string } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    const trackAndRedirect = async () => {
      try {
        const res = await axios.post("/api/event/click", { referralCode: code });
        const redirectUrl = res.data.redirectUrl;

        if (redirectUrl) {
          const url = new URL(redirectUrl);
          url.searchParams.set("ref", code); // adds or overwrites ?ref=code
          window.location.href = url.toString();
        } else {
          setError("No redirect URL found");
          setLoading(false);
        }
      } catch (err: any) {
        setError(err.response?.data?.msg || "Something went wrong");
        setLoading(false);
      }
    };

    trackAndRedirect();
  }, [code]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
        {loading && (
          <>
            <p className="text-lg font-medium">Redirecting…</p>
            <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-black animate-progress-indeterminate" />
            </div>
          </>
        )}

        {error && (
          <>
            <p className="text-red-500 font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 rounded bg-black text-white "
            >
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  );
}
