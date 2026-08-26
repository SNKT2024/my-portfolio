// src/components/admin/LinkManager.tsx
"use client";

import { useState } from "react";

import { LinkModal } from "@/components/admin/LinkModal";
import { DynamicIcon } from "@/components/admin/DynamicIcon";
import { deleteSocialLink } from "@/actions/linkActions";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Star,
  Copy,
  Check,
  Link2,
} from "lucide-react";
import { SocialLink } from "@/app/generated/prisma/client";

interface LinkManagerProps {
  initialLinks: SocialLink[];
}

export function LinkManager({ initialLinks }: LinkManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<SocialLink | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setSelectedLink(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (link: SocialLink) => {
    setSelectedLink(link);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete link for "${title}"?`)) return;
    setIsDeletingId(id);
    await deleteSocialLink(id);
    setIsDeletingId(null);
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Action Control Bar */}
      <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link2 className="size-4 text-black" />
          <span className="text-xs font-black uppercase text-black">
            Universal Social Profiles & Documents
          </span>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-purple-300 text-black text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-purple-200 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all shrink-0"
        >
          <Plus className="size-4" />
          <span>Add New Link</span>
        </button>
      </div>

      {/* Grid of Link Cards */}
      {initialLinks.length === 0 ? (
        <div className="border-2 border-black bg-white p-12 text-center text-xs font-bold uppercase text-zinc-500 shadow-[4px_4px_0px_0px_#000]">
          No universal links found. Click &quot;Add New Link&quot; to begin.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {initialLinks.map((link) => (
            <div
              key={link.id}
              className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000] p-4 flex flex-col justify-between space-y-4 hover:bg-amber-50/40 transition-colors"
            >
              {/* Card Header & Badges */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2 border-b-2 border-black pb-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-8 border-2 border-black bg-yellow-300 flex items-center justify-center shadow-[1px_1px_0px_0px_#000] shrink-0">
                      <DynamicIcon
                        iconKey={link.iconKey}
                        className="size-4 text-black"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-black uppercase truncate text-black">
                        {link.title}
                      </h3>
                      <span className="text-[10px] text-zinc-500 font-bold">
                        Key: {link.iconKey}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(link)}
                      className="p-1.5 border border-black bg-white hover:bg-cyan-200 shadow-[1px_1px_0px_0px_#000] transition"
                      title="Edit Link"
                    >
                      <Pencil className="size-3.5 text-black" />
                    </button>
                    <button
                      type="button"
                      disabled={isDeletingId === link.id}
                      onClick={() => handleDelete(link.id, link.title)}
                      className="p-1.5 border border-black bg-white hover:bg-red-200 text-red-600 shadow-[1px_1px_0px_0px_#000] transition disabled:opacity-50"
                      title="Delete Link"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Target URL with Copy Button */}
                <div className="flex items-center gap-1.5 bg-zinc-50 border border-black p-1.5">
                  <span className="text-[11px] text-zinc-700 font-medium truncate flex-1 select-all">
                    {link.url}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(link.id, link.url)}
                    className="p-1 text-zinc-600 hover:text-black border border-black bg-white shrink-0 shadow-[1px_1px_0px_0px_#000]"
                    title="Copy URL"
                  >
                    {copiedId === link.id ? (
                      <Check className="size-3 text-emerald-600" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Card Footer Indicators & Test Link */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-[10px] font-bold uppercase">
                <div className="flex items-center gap-2">
                  <span className="bg-zinc-100 border border-black px-1.5 py-0.5">
                    Order: {link.order}
                  </span>
                  {link.isPrimary && (
                    <span className="bg-purple-200 border border-black px-1.5 py-0.5 text-purple-950 font-black inline-flex items-center gap-0.5">
                      <Star className="size-2.5 fill-black text-black" />
                      Primary CTA
                    </span>
                  )}
                </div>

                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline font-bold"
                >
                  Visit <ExternalLink className="size-2.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Link CRUD Modal */}
      <LinkModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        linkToEdit={selectedLink}
      />
    </div>
  );
}
