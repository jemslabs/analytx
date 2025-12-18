"use client";

import {
  LayoutDashboard,
  ShoppingBag,
  Settings,
  PanelLeftOpen,
  PanelLeftClose,
  ChevronsUpDown,
  LogOut,
  Key,
  Megaphone,
} from "lucide-react";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import useAuthStore from "@/stores/useAuth";
import { Avatar, AvatarFallback } from "./ui/avatar";
import SubscribeButton from "./SubscribeButton";

export default function BrandSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false);
  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: `/brand` },
    { label: "Campaigns", icon: Megaphone, href: `/brand/campaigns` },
    { label: "Products", icon: ShoppingBag, href: `/brand/products` },
    { label: "API Access", icon: Key, href: `/brand/api-access` },
    { label: "Settings", icon: Settings, href: `/brand/settings` },
  ];



  return (
    <aside
      className={cn(
        "h-screen bg-white/90 backdrop-blur-xl border-r border-gray-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-3xl flex flex-col transition-all duration-300 py-6 m-2",
        collapsed ? "w-20 px-3" : "w-64 px-4"
      )}
    >

      <nav className={cn("flex flex-col gap-2", collapsed && "items-center")}>
        {navItems.map((item) => {
          const Icon = item.icon;

          // Fix: match exact route OR first segment
          const pathSegment = pathname.split("/")[2] ?? "";
          const itemSegment = item.href.split("/")[2] ?? "";

          const active =
            pathname === item.href || pathSegment === itemSegment;

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2 rounded-xl text-[15px] font-medium transition-all",
                "cursor-pointer group w-full",
                active
                  ? "bg-black text-white shadow-sm scale-[1.02]"
                  : "text-gray-700 hover:bg-primary/10",
                collapsed && "justify-center px-0"
              )}
            >
              <span
                className={cn(
                  "p-2 rounded-lg transition-all flex items-center justify-center",
                  active ? "bg-white/20" : "bg-gray-200 group-hover:bg-gray-300",
                  collapsed && "p-2"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-all",
                    active ? "text-white" : "text-gray-600"
                  )}
                />
              </span>

              {!collapsed && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 -right-3 z-10 p-2 rounded-full shadow-md border bg-white hover:bg-gray-100 transition cursor-pointer"
        )}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-4 w-4 text-gray-700" />
        ) : (
          <PanelLeftClose className="h-4 w-4 text-gray-700" />
        )}
      </button>
      {!collapsed &&
        <SubscribeButton />}
      <div
        className={cn(
          "mt-auto",
          collapsed && "flex justify-center"
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "group flex items-center px-3 py-2 rounded-xl text-[15px] font-medium cursor-pointer",
              "bg-gray-100 hover:bg-gray-200 transition-all w-full",
              collapsed && "justify-center px-2"
            )}
          >
            {/* Left Section */}
            <div className="flex items-center gap-3 min-w-0 h-12">
              <Avatar>
                <AvatarFallback className="bg-black text-white">{user?.email[0]}</AvatarFallback>
              </Avatar>

              {!collapsed && (
                <span className="text-gray-800 truncate max-w-[140px] group-hover:text-gray-900">
                  {user?.email}
                </span>
              )}
            </div>

            {/* Right Icon */}
            {!collapsed && (
              <ChevronsUpDown className="h-4 w-4 text-gray-600 shrink-0" />
            )}
          </DropdownMenuTrigger>




          <DropdownMenuContent
            side="right"
            align="start"
            className="w-48 mt-1 p-2 rounded-xl shadow-lg border bg-white"
          >

            <DropdownMenuItem
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium  hover:bg-red-50 transition cursor-pointer"
              onClick={async () => {
                await logout(router);
              }}

            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </aside>
  );
}
