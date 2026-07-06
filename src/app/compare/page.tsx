import { getOcid, getCharacterBasic, getCharacterStat } from "@/lib/maple-api";
import { computeConvertedStat, type ConvertedStatSummary } from "@/lib/converted-stat";
import CharacterBasicCard from "@/components/CharacterBasic";
import CompareSearchForm from "@/components/CompareSearchForm";
import { ErrorCard } from "@/components/LoadingSpinner";
import type { CharacterBasic, StatInfo as ApiStatInfo } from "@/types/maple";
import { Swords, Crown } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { a, b } = await searchParams;
  return {
    title: a && b ? `${a} vs ${b} - MapleInfo` : "캐릭터 비교 - MapleInfo",
    description: "두 캐릭터의 스탯과 전투력을 나란히 비교해보세요.",
  };
}

interface FetchResult {
  error: string | null;
  basic: CharacterBasic | null;
  summary: ConvertedStatSummary | null;
}

async function fetchOne(name: string): Promise<FetchResult> {
  try {
    const { ocid } = await getOcid(name);
    const [basic, stat] = await Promise.all([
      getCharacterBasic(ocid) as Promise<CharacterBasic>,
      getCharacterStat(ocid) as Promise<{ character_class: string; final_stat: ApiStatInfo[] }>,
    ]);
    const statMap = new Map<string, string>(
      stat.final_stat.filter((s) => s.stat_value !== null).map((s) => [s.stat_name, s.stat_value as string])
    );
    const summary = computeConvertedStat(stat.character_class, statMap);
    return { error: null, basic, summary };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "캐릭터를 찾을 수 없습니다.", basic: null, summary: null };
  }
}

export default async function ComparePage({ searchParams }: PageProps) {
  const { a, b } = await searchParams;

  let resultA: FetchResult | null = null;
  let resultB: FetchResult | null = null;

  if (a && b) {
    [resultA, resultB] = await Promise.all([fetchOne(a), fetchOne(b)]);
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
          bg-[#ff6b2b]/10 border border-[#ff6b2b]/30 text-[#ff6b2b] text-sm font-medium">
          <Swords size={14} />
          캐릭터 대결
        </div>
        <h1 className="text-3xl font-black text-white">캐릭터 비교</h1>
        <p className="text-[#8888aa] max-w-md mx-auto text-sm">
          두 캐릭터를 검색해 전투력, 환산 스탯, 데미지 지표를 나란히 비교하세요.
        </p>
      </div>

      <CompareSearchForm defaultA={a} defaultB={b} />

      {a && b && (
        <>
          {resultA?.error || resultB?.error ? (
            <ErrorCard
              message={
                [resultA?.error && `${a}: ${resultA.error}`, resultB?.error && `${b}: ${resultB.error}`]
                  .filter(Boolean)
                  .join(" / ") || "정보를 불러올 수 없습니다."
              }
            />
          ) : resultA?.basic && resultB?.basic && resultA.summary && resultB.summary ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CharacterBasicCard data={resultA.basic} />
                <CharacterBasicCard data={resultB.basic} />
              </div>

              <div className="rounded-2xl border border-[#2a2a4a] bg-[#13132a] p-5 space-y-4">
                <p className="text-sm font-bold text-white">스탯 대결</p>

                <CompareRow
                  label="전투력"
                  valueA={resultA.summary.battlePower}
                  valueB={resultB.summary.battlePower}
                  format={(v) => v.toLocaleString()}
                />
                <CompareRow
                  label="환산 주스탯"
                  valueA={resultA.summary.converted}
                  valueB={resultB.summary.converted}
                  format={(v) => v.toLocaleString()}
                />
                <CompareRow
                  label="헥사환산(380)"
                  valueA={resultA.summary.hexaConverted380}
                  valueB={resultB.summary.hexaConverted380}
                  format={(v) => v.toLocaleString()}
                />
                <CompareRow
                  label="최대 스탯공격력"
                  valueA={resultA.summary.maxStatAtk}
                  valueB={resultB.summary.maxStatAtk}
                  format={(v) => v.toLocaleString()}
                />
                <CompareRow
                  label="보스 몬스터 데미지"
                  valueA={resultA.summary.bossDmg}
                  valueB={resultB.summary.bossDmg}
                  format={(v) => `${v}%`}
                />
                <CompareRow
                  label="최종 데미지"
                  valueA={resultA.summary.finalDmg}
                  valueB={resultB.summary.finalDmg}
                  format={(v) => `${v}%`}
                />
                <CompareRow
                  label="방어율 무시"
                  valueA={resultA.summary.ignoreDef}
                  valueB={resultB.summary.ignoreDef}
                  format={(v) => `${v}%`}
                />
                <CompareRow
                  label="크리티컬 데미지"
                  valueA={resultA.summary.critDmg}
                  valueB={resultB.summary.critDmg}
                  format={(v) => `${v}%`}
                />
              </div>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}

function CompareRow({
  label,
  valueA,
  valueB,
  format,
}: {
  label: string;
  valueA: number;
  valueB: number;
  format: (v: number) => string;
}) {
  const total = valueA + valueB;
  const rawPct = total > 0 ? (valueA / total) * 100 : 50;
  const pct = Math.min(94, Math.max(6, rawPct));
  const winner = valueA === valueB ? null : valueA > valueB ? "a" : "b";

  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
        <span className={`font-bold text-right flex items-center justify-end gap-1
          ${winner === "a" ? "text-[#ff6b2b]" : "text-white"}`}>
          {winner === "a" && <Crown size={12} className="text-[#ffd700]" />}
          {format(valueA)}
        </span>
        <span className="text-[10px] text-[#4a4a7a] px-2 whitespace-nowrap">{label}</span>
        <span className={`font-bold text-left flex items-center gap-1
          ${winner === "b" ? "text-[#c878ff]" : "text-white"}`}>
          {format(valueB)}
          {winner === "b" && <Crown size={12} className="text-[#ffd700]" />}
        </span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden bg-[#2a2a4a]">
        <div
          className="h-full bg-gradient-to-r from-[#ff6b2b] to-[#ff8c42] transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
        <div
          className="h-full bg-gradient-to-r from-[#7c3aed] to-[#c878ff] transition-all duration-700"
          style={{ width: `${100 - pct}%` }}
        />
      </div>
    </div>
  );
}
