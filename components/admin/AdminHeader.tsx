// src/components/admin/AdminHeader.tsx
"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { useSidebar } from "../ui/sidebar";
import { Menu } from "lucide-react";
import { ThemeToggle } from "../portfolio/ThemeToggle";

function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <>
      <Menu onClick={toggleSidebar} cursor={"pointer"} />
    </>
  );
}

export function AdminHeader() {
  const { user } = useUser();

  return (
    <header className="h-16 border-b-2 border-black bg-white  flex items-center justify-between font-mono sticky top-0 z-10 p-3">
      <div className="flex items-center gap-3 p-2">
        <CustomTrigger />

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 border border-black text-[11px] font-bold text-emerald-900 uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Server: Synced
        </span>
        <span className="hidden md:inline-block text-xs text-zinc-500">
          / {user?.primaryEmailAddress?.emailAddress}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox:
                "border-2 border-black shadow-[2px_2px_0px_0px_#000] w-8 h-8 rounded-none",
            },
          }}
        />
      </div>
    </header>
  );
}
