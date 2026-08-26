// src/app/admin/links/page.tsx
import prisma from "@/lib/prisma";
import { LinkManager } from "@/components/admin/LinkManager";
import { Link2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLinksPage() {
  const links = await prisma.socialLink.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6 font-mono p-5">
      {/* Title Banner */}
      <div className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-300 border-2 border-black px-2 py-0.5 text-xs font-black uppercase shadow-[1px_1px_0px_0px_#000]">
              MODULE_05
            </span>
            <h1 className="text-xl font-black uppercase tracking-tight text-black">
              Universal Links & Social Channels
            </h1>
          </div>
          <p className="text-xs text-zinc-600 mt-1">
            Configure social badges, resume targets, and external profile
            destinations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold bg-purple-100 border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_#000] self-start md:self-auto">
          <Link2 className="size-3.5 text-black" />
          <span>{links.length} DESTINATIONS_CONFIGURED</span>
        </div>
      </div>

      {/* Main Link Manager Interface */}
      <LinkManager initialLinks={links} />
    </div>
  );
}
