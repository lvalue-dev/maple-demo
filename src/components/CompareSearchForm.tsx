"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Swords } from "lucide-react";

export default function CompareSearchForm({
  defaultA = "",
  defaultB = "",
}: {
  defaultA?: string;
  defaultB?: string;
}) {
  const [a, setA] = useState(defaultA);
  const [b, setB] = useState(defaultB);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nameA = a.trim();
    const nameB = b.trim();
    if (!nameA || !nameB) return;
    setLoading(true);
    router.push(`/compare?a=${encodeURIComponent(nameA)}&b=${encodeURIComponent(nameB)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="캐릭터 A"
          className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-[#13132a] border border-[#2a2a4a] text-white
            placeholder-[#4a4a7a] focus:outline-none focus:border-[#ff6b2b]
            focus:shadow-[0_0_15px_rgba(255,107,43,0.3)] transition-all duration-300"
          disabled={loading}
          autoComplete="off"
          spellCheck={false}
        />
        <div className="flex-shrink-0 text-[#ff6b2b]">
          <Swords size={20} />
        </div>
        <input
          type="text"
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="캐릭터 B"
          className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-[#13132a] border border-[#2a2a4a] text-white
            placeholder-[#4a4a7a] focus:outline-none focus:border-[#7c3aed]
            focus:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all duration-300"
          disabled={loading}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={loading || !a.trim() || !b.trim()}
          className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm
            bg-gradient-to-r from-[#ff6b2b] to-[#7c3aed]
            hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed
            text-white transition-all duration-200
            shadow-[0_0_15px_rgba(255,107,43,0.25)]"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "대결"}
        </button>
      </div>
    </form>
  );
}
