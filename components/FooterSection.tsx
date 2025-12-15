"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Branding */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">AnalytX</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            AnalytX helps brands see what truly drives results in creator marketing — with accurate attribution, actionable analytics, and reliable data at scale.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="w-full md:w-auto text-center text-sm text-muted-foreground mt-6 md:mt-0">
          &copy; {new Date().getFullYear()} Powered by{" "}
          <Link href="https://instagram.com/jems.labs" target="_blank" className="text-primary font-medium">
            Jems Labs
          </Link>
          . All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
