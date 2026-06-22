"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { WorldName } from "@/types/maple";

const WORLD_COLORS: Record<string, string> = {
  스카니아: "from-[#ff4444] to-[#ff8888]",
  베라: "from-[#44aaff] to-[#88ccff]",
  루나: "from-[#aa44ff] to-[#cc88ff]",
  제니스: "from-[#ffff44] to-[#ffffaa]",
  크로아: "from-[#44ff88] to-[#88ffaa]",
  유니온: "from-[#ffaa44] to-[#ffcc88]",
  엘리시움: "from-[#44ffff] to-[#88ffff]",
  이노시스: "from-[#ff44aa] to-[#ff88cc]",
  레드: "from-[#ff2222] to-[#ff6666]",
  오로라: "from-[#ff8844] to-[#ffaa88]",
  아케인: "from-[#4488ff] to-[#88aaff]",
  노바: "from-[#ff44ff] to-[#ff88ff]",
  리부트: "from-[#ff6b2b] to-[#ffd700]",
  리부트2: "from-[#7c3aed] to-[#c878ff]",
};

interface Props {
  worlds: WorldName[];
  selectedWorld?: string;
}

export default function WorldSelector({ worlds, selectedWorld }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/ranking"
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${!selectedWorld
            ? "bg-gradient-to-r from-[#ff6b2b] to-[#ff8c42] text-white shadow-[0_0_15px_rgba(255,107,43,0.3)]"
            : "bg-[#13132a] border border-[#2a2a4a] text-[#8888aa] hover:text-white hover:border-[#ff6b2b]"
          }`}
      >
        전체
      </Link>
      {worlds.map((world) => {
        const isSelected = selectedWorld === world;
        const colors = WORLD_COLORS[world] ?? "from-[#61b8ff] to-[#4a4a7a]";
        return (
          <Link
            key={world}
            href={`/ranking?world=${encodeURIComponent(world)}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${isSelected
                ? `bg-gradient-to-r ${colors} text-white shadow-[0_0_12px_rgba(255,107,43,0.25)]`
                : "bg-[#13132a] border border-[#2a2a4a] text-[#8888aa] hover:text-white hover:border-[#ff6b2b]/50"
              }`}
          >
            <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${colors}`} />
            {world}
          </Link>
        );
      })}
    </div>
  );
}
