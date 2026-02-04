"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Branding */}
        <div className="space-y-4">
          <Image src={'/download.png'} width={100}
            height={100}
            alt="Logo" />
          <p className="text-sm text-muted-foreground max-w-md">
            AnalytX tracks real clicks and sales across creator campaigns, showing which creators drive results and defining payouts based on performance.
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
