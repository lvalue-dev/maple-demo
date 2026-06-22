"use client";

import { useState } from "react";
import { BarChart2, Shield, Zap, Trophy, Sword, Star } from "lucide-react";
import CharacterStatsPanel from "./CharacterStats";
import CharacterEquipmentPanel from "./CharacterEquipment";
import CharacterUnionPanel from "./CharacterUnion";
import type { CharacterStat, CharacterEquipment, UnionInfo, UnionRaider } from "@/types/maple";

interface Props {
  stat: unknown;
  equipment: unknown;
  union: unknown;
  unionRaider: unknown;
  dojang: unknown;
  ability: unknown;
}

interface AbilityInfo {
  ability_grade: string;
  ability_value: string;
}

interface DojangInfo {
  character_class: string;
  world_name: string;
  dojang_best_floor: number;
  date_dojang_record: string;
  dojang_best_time: number;
}

const TABS = [
  { id: "stat", label: "스탯", icon: <BarChart2 size={15} /> },
  { id: "equipment", label: "장비", icon: <Sword size={15} /> },
  { id: "union", label: "유니온", icon: <Shield size={15} /> },
  { id: "ability", label: "어빌리티", icon: <Star size={15} /> },
  { id: "dojang", label: "무릉도장", icon: <Trophy size={15} /> },
];

export default function CharacterTabs({ stat, equipment, union, unionRaider, dojang, ability }: Props) {
  const [active, setActive] = useState("stat");

  return (
    <div className="rounded-2xl border border-[#2a2a4a] bg-[#13132a] overflow-hidden">
      {/* Tab Bar */}
      <div className="flex border-b border-[#2a2a4a] overflow-x-auto scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap
              border-b-2 transition-all duration-200 flex-shrink-0
              ${active === tab.id
                ? "border-[#ff6b2b] text-[#ff6b2b] bg-[#ff6b2b]/5"
                : "border-transparent text-[#8888aa] hover:text-white hover:bg-[#0d0d1a]/40"
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {active === "stat" && (
          stat
            ? <CharacterStatsPanel data={stat as CharacterStat} />
            : <EmptyState message="스탯 정보를 불러올 수 없습니다." />
        )}

        {active === "equipment" && (
          equipment
            ? <CharacterEquipmentPanel data={equipment as CharacterEquipment} />
            : <EmptyState message="장비 정보를 불러올 수 없습니다." />
        )}

        {active === "union" && (
          union
            ? <CharacterUnionPanel union={union as UnionInfo} raider={unionRaider as UnionRaider | undefined} />
            : <EmptyState message="유니온 정보를 불러올 수 없습니다." />
        )}

        {active === "ability" && (
          ability
            ? <AbilityPanel data={ability as { ability_info: AbilityInfo[]; ability_grade: string; remain_fame: number }} />
            : <EmptyState message="어빌리티 정보를 불러올 수 없습니다." />
        )}

        {active === "dojang" && (
          dojang
            ? <DojangPanel data={dojang as DojangInfo} />
            : <EmptyState message="무릉도장 정보를 불러올 수 없습니다." />
        )}
      </div>
    </div>
  );
}

function AbilityPanel({ data }: {
  data: { ability_info: AbilityInfo[]; ability_grade: string; remain_fame: number }
}) {
  const GRADE_COLORS: Record<string, string> = {
    레전드리: "text-[#00dc64] border-[#00dc64]/40 bg-[#00dc64]/10",
    유니크: "text-[#ffdc00] border-[#ffdc00]/40 bg-[#ffdc00]/10",
    에픽: "text-[#c878ff] border-[#c878ff]/40 bg-[#c878ff]/10",
    레어: "text-[#61b8ff] border-[#61b8ff]/40 bg-[#61b8ff]/10",
    노말: "text-white border-[#4a4a7a] bg-[#2a2a4a]/20",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">어빌리티</h2>
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-[#ffd700]" />
          <span className="text-xs text-[#8888aa]">명성치 {data.remain_fame?.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-2">
        {data.ability_info?.map((ab, i) => {
          const colors = GRADE_COLORS[ab.ability_grade] ?? GRADE_COLORS["노말"];
          return (
            <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${colors}`}>
              <span className="text-sm">{ab.ability_value}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${colors}`}>{ab.ability_grade}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DojangPanel({ data }: { data: DojangInfo }) {
  const minutes = Math.floor((data.dojang_best_time ?? 0) / 60);
  const seconds = (data.dojang_best_time ?? 0) % 60;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">무릉도장</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatBox label="최고 층수" value={`${data.dojang_best_floor}층`} color="text-[#ff6b2b]" />
        <StatBox
          label="최고 기록"
          value={`${minutes}분 ${seconds}초`}
          color="text-[#ffd700]"
        />
        <StatBox
          label="기록 날짜"
          value={data.date_dojang_record ? data.date_dojang_record.slice(0, 10) : "-"}
          color="text-[#8888aa]"
        />
      </div>

      {data.dojang_best_floor >= 100 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#ff6b2b]/20 to-[#ffd700]/20
          border border-[#ff6b2b]/30 text-center">
          <Trophy className="mx-auto text-[#ffd700] mb-2" size={28} />
          <p className="text-[#ffd700] font-bold text-lg">{data.dojang_best_floor}층 달성!</p>
          <p className="text-[#8888aa] text-xs mt-1">최고 등급 도전자</p>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="p-4 rounded-xl bg-[#0d0d1a] border border-[#2a2a4a] text-center">
      <div className="text-xs text-[#8888aa] mb-1">{label}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-12 text-center">
      <p className="text-[#4a4a7a]">{message}</p>
    </div>
  );
}
