"use client";

import { CharacterStat, StatInfo } from "@/types/maple";
import { useState } from "react";
import CharacterConvertedStat from "./CharacterConvertedStat";

interface Props {
  data: CharacterStat;
  hexaStat?: unknown;
}

const IMPORTANT_STATS = [
  "최소 스탯공격력",
  "최대 스탯공격력",
  "데미지",
  "보스 몬스터 데미지",
  "최종 데미지",
  "방어율 무시",
  "크리티컬 확률",
  "크리티컬 데미지",
  "STR",
  "DEX",
  "INT",
  "LUK",
  "HP",
  "MP",
  "공격력",
  "마력",
  "방어력",
  "이동속도",
  "점프력",
  "아이템 드롭률",
  "메소 획득량",
  "버프 지속시간",
];

const STAT_GROUPS: { label: string; keys: string[] }[] = [
  {
    label: "전투",
    keys: [
      "최소 스탯공격력", "최대 스탯공격력", "데미지", "보스 몬스터 데미지",
      "최종 데미지", "방어율 무시", "크리티컬 확률", "크리티컬 데미지",
      "일반 몬스터 데미지", "상태이상 데미지",
    ],
  },
  {
    label: "기본 스탯",
    keys: ["STR", "DEX", "INT", "LUK", "HP", "MP", "HP 최대치", "MP 최대치"],
  },
  {
    label: "전투력",
    keys: [
      "공격력", "마력", "방어력", "스타포스", "아케인포스", "어센틱포스",
    ],
  },
  {
    label: "기타",
    keys: [
      "이동속도", "점프력", "버프 지속시간", "아이템 드롭률", "메소 획득량",
      "소환수 지속시간 증가", "재사용 대기시간 감소 (%)","재사용 대기시간 감소 (초)",
    ],
  },
];

export default function CharacterStatsPanel({ data, hexaStat }: Props) {
  const [activeGroup, setActiveGroup] = useState("전투");

  const statMap = new Map<string, string>(
    data.final_stat
      .filter((s) => s.stat_value !== null)
      .map((s) => [s.stat_name, s.stat_value as string])
  );

  const currentGroup = STAT_GROUPS.find((g) => g.label === activeGroup) ?? STAT_GROUPS[0];

  const displayStats = currentGroup.keys
    .map((key) => ({ name: key, value: statMap.get(key) }))
    .filter((s) => s.value !== undefined && s.value !== "0");

  return (
    <div className="space-y-4">
      {/* 환산 주스탯 */}
      <CharacterConvertedStat charClass={data.character_class} stats={statMap} hexaStat={hexaStat as Parameters<typeof CharacterConvertedStat>[0]["hexaStat"]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">최종 스탯</h2>
        <span className="text-xs text-[#8888aa]">{data.character_class}</span>
      </div>

      {/* Group Tabs */}
      <div className="flex gap-2 flex-wrap">
        {STAT_GROUPS.map((g) => (
          <button
            key={g.label}
            onClick={() => setActiveGroup(g.label)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${activeGroup === g.label
                ? "bg-gradient-to-r from-[#ff6b2b] to-[#ff8c42] text-white shadow-[0_0_15px_rgba(255,107,43,0.3)]"
                : "bg-[#13132a] border border-[#2a2a4a] text-[#8888aa] hover:border-[#ff6b2b] hover:text-white"
              }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {displayStats.length > 0 ? (
          displayStats.map((stat) => (
            <StatItem
              key={stat.name}
              name={stat.name}
              value={stat.value!}
              isImportant={IMPORTANT_STATS.includes(stat.name)}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-[#4a4a7a] py-8">
            해당 항목의 스탯 정보가 없습니다.
          </p>
        )}
      </div>

      {/* Remain AP */}
      {data.remain_ap > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30">
          <span className="text-[#ffd700] text-sm font-medium">잔여 AP</span>
          <span className="text-white font-bold">{data.remain_ap}</span>
        </div>
      )}
    </div>
  );
}

function StatItem({ name, value, isImportant }: { name: string; value: string; isImportant: boolean }) {
  const numValue = parseFloat(value.replace(/,/g, ""));
  const isPercent = value.includes("%");

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200
      hover:border-[#ff6b2b]/50
      ${isImportant
        ? "bg-[#1a0d2e] border-[#7c3aed]/30"
        : "bg-[#13132a] border-[#2a2a4a]"
      }`}
    >
      <span className="text-[#8888aa] text-sm truncate flex-1 mr-2">{name}</span>
      <span className={`font-bold text-sm tabular-nums whitespace-nowrap
        ${isImportant ? "text-[#c878ff]" : "text-white"}`}
      >
        {isNaN(numValue) ? value : numValue.toLocaleString()}{isPercent ? "%" : ""}
      </span>
    </div>
  );
}
