"use client";

import { useState } from "react";
import { BarChart2, Shield, Zap, Trophy, Sword, Star, AlertCircle, Layers, Target, TrendingUp, Link2 } from "lucide-react";
import CharacterStatsPanel from "./CharacterStats";
import CharacterEquipmentPanel from "./CharacterEquipment";
import CharacterUnionPanel from "./CharacterUnion";
import CharacterSymbolPanel from "./CharacterSymbol";
import CharacterBoss from "./CharacterBoss";
import CharacterHyperStat from "./CharacterHyperStat";
import CharacterLinkSkill from "./CharacterLinkSkill";
import type { CharacterStat, CharacterEquipment, UnionInfo, UnionRaider } from "@/types/maple";
import type { SlotResult } from "@/app/character/[name]/page";

interface Props {
  stat: SlotResult;
  hexaStat: SlotResult;
  equipment: SlotResult;
  setEffect: SlotResult;
  union: SlotResult;
  unionRaider: SlotResult;
  dojang: SlotResult;
  ability: SlotResult;
  symbolEquipment: SlotResult;
  hyperStat: SlotResult;
  linkSkill: SlotResult;
  characterLevel: number;
}

interface AbilityInfo {
  ability_grade: string;
  ability_value: string;
}

interface DojangInfo {
  dojang_best_floor: number;
  date_dojang_record: string;
  dojang_best_time: number;
}

interface SetEffectInfo {
  set_name: string;
  total_set_count: number;
  set_effect_info: { set_count: number; set_option: string }[];
  set_option_full: { set_count: number; set_option: string }[];
}

const TABS = [
  { id: "stat",      label: "스탯",      icon: <BarChart2 size={14} /> },
  { id: "equip",     label: "장비",      icon: <Sword size={14} /> },
  { id: "symbol",    label: "심볼",      icon: <Layers size={14} /> },
  { id: "union",     label: "유니온",    icon: <Shield size={14} /> },
  { id: "hyperstat", label: "하이퍼스탯", icon: <TrendingUp size={14} /> },
  { id: "linkskill", label: "링크스킬",  icon: <Link2 size={14} /> },
  { id: "boss",      label: "보스",      icon: <Target size={14} /> },
  { id: "ability",   label: "어빌리티",  icon: <Star size={14} /> },
  { id: "dojang",    label: "무릉",      icon: <Trophy size={14} /> },
];

export default function CharacterTabs(props: Props) {
  const { stat, hexaStat, equipment, setEffect, union, unionRaider, dojang, ability, symbolEquipment, hyperStat, linkSkill, characterLevel } = props;
  const [active, setActive] = useState("stat");

  // max stat attack power for boss panel
  const statData = stat.data as CharacterStat | null;
  const maxStatAtk = statData
    ? parseFloat(
        (statData.final_stat?.find(s => s.stat_name === "최대 스탯공격력")?.stat_value ?? "0").replace(/,/g, "")
      )
    : 0;

  return (
    <div className="rounded-2xl border border-[#2a2a4a] bg-[#13132a] overflow-hidden">
      <div className="flex border-b border-[#2a2a4a] overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap
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

      <div className="p-5">
        {active === "stat" && (
          stat.data
            ? <CharacterStatsPanel data={stat.data as CharacterStat} hexaStat={hexaStat.data} />
            : <ErrorState message={stat.error} />
        )}

        {active === "equip" && (
          equipment.data
            ? <CharacterEquipmentPanel data={equipment.data as CharacterEquipment} setEffect={setEffect.data as SetEffectInfo[] | null} />
            : <ErrorState message={equipment.error} />
        )}

        {active === "symbol" && (
          symbolEquipment.data
            ? <CharacterSymbolPanel data={symbolEquipment.data as Parameters<typeof CharacterSymbolPanel>[0]["data"]} />
            : <ErrorState message={symbolEquipment.error} />
        )}

        {active === "union" && (
          union.data
            ? <CharacterUnionPanel union={union.data as UnionInfo} raider={unionRaider.data as UnionRaider | undefined} />
            : <ErrorState message={union.error} />
        )}

        {active === "hyperstat" && (
          hyperStat.data
            ? <CharacterHyperStat data={hyperStat.data as Parameters<typeof CharacterHyperStat>[0]["data"]} />
            : <ErrorState message={hyperStat.error} />
        )}

        {active === "linkskill" && (
          linkSkill.data
            ? <CharacterLinkSkill data={linkSkill.data as Parameters<typeof CharacterLinkSkill>[0]["data"]} />
            : <ErrorState message={linkSkill.error} />
        )}

        {active === "boss" && (
          <CharacterBoss characterLevel={characterLevel} maxStatAtk={maxStatAtk} />
        )}

        {active === "ability" && (
          ability.data
            ? <AbilityPanel data={ability.data as { ability_info: AbilityInfo[]; remain_fame: number }} />
            : <ErrorState message={ability.error} />
        )}

        {active === "dojang" && (
          dojang.data
            ? <DojangPanel data={dojang.data as DojangInfo} />
            : <ErrorState message={dojang.error} />
        )}
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string | null }) {
  const isPermission = message?.includes("403") || message?.includes("OPENAPI") || message?.includes("권한");
  return (
    <div className="py-10 flex flex-col items-center gap-3">
      <AlertCircle size={32} className="text-[#ff4444]" />
      <p className="text-white font-medium">정보를 불러올 수 없습니다</p>
      {message && (
        <p className="text-[#8888aa] text-sm text-center max-w-md bg-[#0d0d1a] px-4 py-2 rounded-lg">
          {message}
        </p>
      )}
      {isPermission && (
        <p className="text-xs text-[#4a4a7a] text-center max-w-sm">
          Nexon Open API 포털에서 해당 API 서비스가 활성화되어 있는지 확인하세요.
        </p>
      )}
    </div>
  );
}

function AbilityPanel({ data }: { data: { ability_info: AbilityInfo[]; remain_fame: number } }) {
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
        <StatBox label="최고 기록" value={`${minutes}분 ${seconds}초`} color="text-[#ffd700]" />
        <StatBox label="기록 날짜" value={data.date_dojang_record?.slice(0, 10) ?? "-"} color="text-[#8888aa]" />
      </div>
      {data.dojang_best_floor >= 100 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#ff6b2b]/20 to-[#ffd700]/20
          border border-[#ff6b2b]/30 text-center">
          <Trophy className="mx-auto text-[#ffd700] mb-2" size={28} />
          <p className="text-[#ffd700] font-bold text-lg">{data.dojang_best_floor}층 달성!</p>
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
