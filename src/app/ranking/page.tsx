import { getOverallRanking, getApiDate } from "@/lib/maple-api";
import { Trophy, Crown, Medal } from "lucide-react";
import Link from "next/link";
import type { RankingEntry, RankingResponse, WorldName } from "@/types/maple";
import SearchBar from "@/components/SearchBar";
import WorldSelector from "@/components/WorldSelector";

const WORLDS: WorldName[] = [
  "스카니아", "베라", "루나", "제니스", "크로아", "유니온",
  "엘리시움", "이노시스", "레드", "오로라", "아케인", "노바",
  "리부트", "리부트2",
];

interface PageProps {
  searchParams: Promise<{ world?: string; page?: string }>;
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown size={18} className="text-[#ffd700]" />;
  if (rank === 2) return <Medal size={16} className="text-[#c0c0c0]" />;
  if (rank === 3) return <Medal size={16} className="text-[#cd7f32]" />;
  return <span className="text-[#8888aa] font-mono text-sm w-6 text-center">{rank}</span>;
}

function formatExp(exp: number): string {
  if (exp >= 1_000_000_000_000) return `${(exp / 1_000_000_000_000).toFixed(1)}조`;
  if (exp >= 100_000_000) return `${(exp / 100_000_000).toFixed(1)}억`;
  if (exp >= 10_000) return `${(exp / 10_000).toFixed(0)}만`;
  return exp.toLocaleString();
}

export default async function RankingPage({ searchParams }: PageProps) {
  const { world, page } = await searchParams;
  const selectedWorld = world as WorldName | undefined;
  const currentPage = parseInt(page ?? "1", 10);

  let ranking: RankingEntry[] = [];
  let error: string | null = null;

  try {
    const data = await getOverallRanking({
      date: getApiDate(),
      world_name: selectedWorld,
      page: currentPage,
    }) as RankingResponse;
    ranking = data.ranking ?? [];
  } catch (e) {
    error = e instanceof Error ? e.message : "랭킹을 불러올 수 없습니다.";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
          bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-sm font-medium">
          <Trophy size={14} />
          전체 캐릭터 랭킹
        </div>
        <h1 className="text-3xl font-black text-white">랭킹</h1>
      </div>

      <SearchBar />

      {/* World Selector */}
      <WorldSelector worlds={WORLDS} selectedWorld={selectedWorld} />

      {/* Ranking Table */}
      {error ? (
        <div className="p-8 text-center rounded-xl bg-[#13132a] border border-[#2a2a4a]">
          <p className="text-[#ff4444]">{error}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-[#2a2a4a] bg-[#13132a] overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[60px_1fr_120px_120px_100px] gap-2 px-5 py-3
            bg-[#0d0d1a] border-b border-[#2a2a4a] text-xs text-[#8888aa] font-medium">
            <span className="text-center">순위</span>
            <span>캐릭터</span>
            <span className="text-right">레벨</span>
            <span className="text-right hidden sm:block">경험치</span>
            <span className="text-right hidden md:block">서버</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#2a2a4a]">
            {ranking.length === 0 ? (
              <div className="py-16 text-center text-[#4a4a7a]">
                {selectedWorld
                  ? `${selectedWorld} 서버 랭킹 정보가 없습니다.`
                  : "랭킹 정보가 없습니다."
                }
              </div>
            ) : (
              ranking.map((entry) => (
                <RankingRow key={`${entry.ranking}-${entry.character_name}`} entry={entry} />
              ))
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {!error && ranking.length > 0 && (
        <Pagination currentPage={currentPage} world={selectedWorld} />
      )}
    </div>
  );
}

function RankingRow({ entry }: { entry: RankingEntry }) {
  const isTopThree = entry.ranking <= 3;
  return (
    <Link
      href={`/character/${encodeURIComponent(entry.character_name)}`}
      className={`grid grid-cols-[60px_1fr_120px_120px_100px] gap-2 px-5 py-3.5 items-center
        hover:bg-[#0d0d1a]/60 transition-colors group
        ${isTopThree ? "bg-[#ffd700]/5" : ""}`}
    >
      <div className="flex justify-center">
        {getRankIcon(entry.ranking)}
      </div>

      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <div className="font-semibold text-white text-sm truncate group-hover:text-[#ff6b2b] transition-colors">
            {entry.character_name}
          </div>
          <div className="text-xs text-[#8888aa] truncate">
            {entry.class_name}
            {entry.character_guildname && (
              <span className="text-[#ffd700]/70 ml-1">[{entry.character_guildname}]</span>
            )}
          </div>
        </div>
      </div>

      <div className="text-right">
        <span className={`font-bold text-sm
          ${entry.character_level >= 280 ? "text-[#ff6b2b]" :
            entry.character_level >= 260 ? "text-[#ffd700]" :
            entry.character_level >= 240 ? "text-[#c878ff]" : "text-white"
          }`}>
          Lv.{entry.character_level}
        </span>
      </div>

      <div className="text-right hidden sm:block text-xs text-[#8888aa]">
        {formatExp(entry.character_exp)}
      </div>

      <div className="text-right hidden md:block">
        <span className="text-xs text-[#61b8ff]">{entry.world_name}</span>
      </div>
    </Link>
  );
}

function Pagination({
  currentPage,
  world,
}: {
  currentPage: number;
  world?: string;
}) {
  const buildUrl = (p: number) => {
    const params = new URLSearchParams();
    if (world) params.set("world", world);
    params.set("page", String(p));
    return `/ranking?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="px-4 py-2 rounded-lg text-sm bg-[#13132a] border border-[#2a2a4a]
            text-[#8888aa] hover:text-white hover:border-[#ff6b2b] transition-all"
        >
          ← 이전
        </Link>
      )}
      <span className="text-sm text-[#8888aa]">
        {currentPage} 페이지
      </span>
      <Link
        href={buildUrl(currentPage + 1)}
        className="px-4 py-2 rounded-lg text-sm bg-[#13132a] border border-[#2a2a4a]
          text-[#8888aa] hover:text-white hover:border-[#ff6b2b] transition-all"
      >
        다음 →
      </Link>
    </div>
  );
}
