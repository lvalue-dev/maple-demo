"use client";

import { useState, useRef, FormEvent } from "react";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const name = value.trim();
    if (!name) return;
    setLoading(true);
    router.push(`/character/${encodeURIComponent(name)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-[#ff6b2b]">
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Search size={20} />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="캐릭터 이름을 입력하세요..."
          className="w-full pl-12 pr-32 py-4 rounded-xl text-lg
            bg-[#13132a] border border-[#2a2a4a] text-white
            placeholder-[#4a4a7a]
            focus:outline-none focus:border-[#ff6b2b] focus:shadow-[0_0_20px_rgba(255,107,43,0.3)]
            transition-all duration-300"
          disabled={loading}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="absolute right-2 px-6 py-2.5 rounded-lg font-semibold text-sm
            bg-gradient-to-r from-[#ff6b2b] to-[#ff8c42]
            hover:from-[#ff8c42] hover:to-[#ffa052]
            disabled:opacity-40 disabled:cursor-not-allowed
            text-white transition-all duration-200
            shadow-[0_0_15px_rgba(255,107,43,0.3)]"
        >
          검색
        </button>
      </div>
    </form>
  );
}
