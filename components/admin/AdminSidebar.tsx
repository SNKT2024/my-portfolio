"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  ExternalLink,
  FolderGit2,
  LayoutDashboard,
  Link2,
  Milestone,
  Settings,
  Sparkles,
} from "lucide-react";

import Link from "next/link";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Hero & About",
    href: "/admin/hero-about",
    icon: Settings,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: FolderGit2,
  },
  {
    label: "Skills",
    href: "/admin/skills",
    icon: Sparkles,
  },
  {
    label: "Experience / Education",
    href: "/admin/experience-education",
    icon: Milestone,
  },
  {
    label: "Universal Links",
    href: "/admin/links",
    icon: Link2,
  },
];

function Header() {
  return (
    <div
      className="
        h-16
        px-4
        bg-yellow-300
        flex
        items-center
        justify-between
        border-b-2
        border-black
        group-data-[collapsible=icon]:justify-center
      "
    >
      {/* Traffic Lights */}
      <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
        <div className="w-3 h-3 bg-red-500 border border-black rounded-full" />
        <div className="w-3 h-3 bg-yellow-500 border border-black rounded-full" />
        <div className="w-3 h-3 bg-green-500 border border-black rounded-full" />
      </div>

      {/* Logo / Title */}
      <span className="text-xs font-bold uppercase tracking-wider text-black group-data-[collapsible=icon]:hidden">
        ADMIN_OS v1.0
      </span>
    </div>
  );
}

function Footer() {
  return (
    <div className="p-3 bg-white border-t-2 items-center  border-black">
      <SidebarMenu className="items-center ">
        <SidebarMenuItem className="group-data-[collapsible=icon]:w-fit w-full">
          <SidebarMenuButton
            tooltip="Live Portfolio"
            className="
              h-10
              w-full
              rounded-none
              border-2
              border-black
              bg-emerald-400
              p-0
              text-black

              font-mono
              font-bold
              uppercase
              text-xs

              shadow-[2px_2px_0px_0px_#000]

              hover:bg-emerald-300
              hover:text-black
              hover:shadow-none
              hover:translate-x-0.5
              hover:translate-y-0.5

              transition-all

              group-data-[collapsible=icon]:justify-center
            "
          >
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full"
            >
              <span className="group-data-[collapsible=icon]:hidden">
                Live Portfolio
              </span>

              <ExternalLink className="size-3.5 shrink-0" />
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}

function Navigation() {
  return (
    <SidebarMenu className="gap-2 p-2 justify-center flex ">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;

        return (
          <SidebarMenuItem
            key={item.label}
            className="items-center group-data-[collapsible=icon]:w-fit w-full"
          >
            <SidebarMenuButton
              tooltip={item.label}
              className="
                h-10
                rounded-none
                border-2
                border-black
                bg-white
                text-black
                

                font-mono
                font-bold
                uppercase
                tracking-wide
               

                shadow-[2px_2px_0px_0px_#000]

                hover:bg-yellow-300
                hover:text-black
                hover:shadow-none
                hover:translate-x-0.5
                hover:translate-y-0.5

                transition-all

                group-data-[collapsible=icon]:justify-center
              "
            >
              <Link
                href={item.href}
                className="flex flex-row  gap-3 w-full group-data-[collapsible=icon]:justify-center"
              >
                <Icon className="size-3.5 shrink-0" />

                <span className="truncate group-data-[collapsible=icon]:hidden">
                  {item.label}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function AdminSidebar() {
  return (
    <>
      <Sidebar
        collapsible="icon"
        variant="sidebar"
        className="border-r-2 border-black font-mono"
      >
        {/* Header */}
        <SidebarHeader className="p-0">
          <Header />
        </SidebarHeader>

        {/* Navigation */}
        <SidebarContent className="bg-amber-50/50">
          <Navigation />
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="p-0">
          <Footer />
        </SidebarFooter>

        {/* Resize / Collapse Rail */}
        <SidebarRail />
      </Sidebar>
    </>
  );
}
