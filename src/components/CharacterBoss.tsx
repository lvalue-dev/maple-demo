"use client";

import { useState } from "react";
import { Lock, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface Difficulty {
  name: string;
  reqLevel: number;
  reqStatAtk: number; // 최대 스탯공격력 권장 (만 단위)
  meso: string; // 결정석 메소
  resetType: "일간" | "주간";
}

interface BossInfo {
  name: string;
  category: "일간" | "주간";
  difficulties: Difficulty[];
}

const BOSS_LIST: BossInfo[] = [
  // ── 일간 ──────────────────────────────────
  { name: "자쿰", category: "일간", difficulties: [
    { name: "이지", reqLevel: 50,  reqStatAtk: 0,       meso: "약 220만",   resetType: "일간" },
    { name: "일반", reqLevel: 80,  reqStatAtk: 0,       meso: "약 660만",   resetType: "일간" },
    { name: "카오스",reqLevel: 100, reqStatAtk: 3_000,   meso: "약 1,300만", resetType: "일간" },
  ]},
  { name: "혼테일", category: "일간", difficulties: [
    { name: "일반", reqLevel: 120, reqStatAtk: 0,       meso: "약 220만",   resetType: "일간" },
    { name: "카오스",reqLevel: 130, reqStatAtk: 5_000,   meso: "약 1,300만", resetType: "일간" },
  ]},
  { name: "핑크빈", category: "일간", difficulties: [
    { name: "이지", reqLevel: 130, reqStatAtk: 0,       meso: "약 360만",   resetType: "일간" },
    { name: "일반", reqLevel: 150, reqStatAtk: 3_000,   meso: "약 1,100만", resetType: "일간" },
    { name: "카오스",reqLevel: 170, reqStatAtk: 20_000,  meso: "약 3,400만", resetType: "일간" },
  ]},
  { name: "파풀라투스", category: "일간", difficulties: [
    { name: "이지", reqLevel: 170, reqStatAtk: 0,       meso: "약 330만",   resetType: "일간" },
    { name: "일반", reqLevel: 170, reqStatAtk: 5_000,   meso: "약 990만",   resetType: "일간" },
    { name: "카오스",reqLevel: 190, reqStatAtk: 30_000,  meso: "약 4,800만", resetType: "일간" },
  ]},
  // ── 주간 ──────────────────────────────────
  { name: "매그너스", category: "주간", difficulties: [
    { name: "이지", reqLevel: 155, reqStatAtk: 0,       meso: "약 1,000만", resetType: "주간" },
    { name: "하드", reqLevel: 180, reqStatAtk: 10_000,  meso: "약 6,000만", resetType: "주간" },
  ]},
  { name: "힐라", category: "주간", difficulties: [
    { name: "이지", reqLevel: 200, reqStatAtk: 5_000,   meso: "약 2,300만", resetType: "주간" },
    { name: "하드", reqLevel: 200, reqStatAtk: 50_000,  meso: "약 1.4억",   resetType: "주간" },
  ]},
  { name: "더스크", category: "주간", difficulties: [
    { name: "이지", reqLevel: 210, reqStatAtk: 10_000,  meso: "약 3,000만", resetType: "주간" },
    { name: "일반", reqLevel: 210, reqStatAtk: 40_000,  meso: "약 9,000만", resetType: "주간" },
  ]},
  { name: "루시드", category: "주간", difficulties: [
    { name: "이지", reqLevel: 220, reqStatAtk: 5_000,   meso: "약 2,600만", resetType: "주간" },
    { name: "일반", reqLevel: 220, reqStatAtk: 20_000,  meso: "약 7,900만", resetType: "주간" },
    { name: "하드", reqLevel: 230, reqStatAtk: 80_000,  meso: "약 2.0억",   resetType: "주간" },
  ]},
  { name: "윌", category: "주간", difficulties: [
    { name: "이지", reqLevel: 220, reqStatAtk: 5_000,   meso: "약 2,600만", resetType: "주간" },
    { name: "일반", reqLevel: 225, reqStatAtk: 20_000,  meso: "약 7,900만", resetType: "주간" },
    { name: "하드", reqLevel: 235, reqStatAtk: 100_000, meso: "약 2.1억",   resetType: "주간" },
  ]},
  { name: "데미안", category: "주간", difficulties: [
    { name: "이지", reqLevel: 220, reqStatAtk: 5_000,   meso: "약 2,600만", resetType: "주간" },
    { name: "일반", reqLevel: 225, reqStatAtk: 20_000,  meso: "약 7,900만", resetType: "주간" },
    { name: "하드", reqLevel: 230, reqStatAtk: 80_000,  meso: "약 1.8억",   resetType: "주간" },
  ]},
  { name: "가루다", category: "주간", difficulties: [
    { name: "이지", reqLevel: 250, reqStatAtk: 60_000,  meso: "약 9,500만", resetType: "주간" },
    { name: "일반", reqLevel: 250, reqStatAtk: 150_000, meso: "약 2.8억",   resetType: "주간" },
    { name: "하드", reqLevel: 255, reqStatAtk: 300_000, meso: "약 5.3억",   resetType: "주간" },
  ]},
  { name: "진 힐라", category: "주간", difficulties: [
    { name: "이지", reqLevel: 260, reqStatAtk: 100_000, meso: "약 1.4억",   resetType: "주간" },
    { name: "하드", reqLevel: 265, reqStatAtk: 350_000, meso: "약 6.0억",   resetType: "주간" },
  ]},
  { name: "검은 마법사", category: "주간", difficulties: [
    { name: "하드", reqLevel: 260, reqStatAtk: 450_000, meso: "약 10억",    resetType: "주간" },
  ]},
  { name: "사이크", category: "주간", difficulties: [
    { name: "이지", reqLevel: 260, reqStatAtk: 100_000, meso: "약 1.4억",   resetType: "주간" },
    { name: "일반", reqLevel: 260, reqStatAtk: 250_000, meso: "약 3.8억",   resetType: "주간" },
    { name: "하드", reqLevel: 265, reqStatAtk: 500_000, meso: "약 8.0억",   resetType: "주간" },
  ]},
  { name: "카링", category: "주간", difficulties: [
    { name: "이지", reqLevel: 260, reqStatAtk: 100_000, meso: "약 1.4억",   resetType: "주간" },
    { name: "일반", reqLevel: 265, reqStatAtk: 300_000, meso: "약 5.0억",   resetType: "주간" },
    { name: "하드", reqLevel: 270, reqStatAtk: 700_000, meso: "약 12억",    resetType: "주간" },
  ]},
  { name: "발키리", category: "주간", difficulties: [
    { name: "이지", reqLevel: 265, reqStatAtk: 200_000, meso: "약 3.0억",   resetType: "주간" },
    { name: "일반", reqLevel: 270, reqStatAtk: 500_000, meso: "약 8.0억",   resetType: "주간" },
    { name: "하드", reqLevel: 275, reqStatAtk: 900_000, meso: "약 15억",    resetType: "주간" },
  ]},
];

const DIFF_COLORS: Record<string, string> = {
  이지: "bg-[#00dc64]/10 border-[#00dc64]/40 text-[#00dc64]",
  일반: "bg-[#61b8ff]/10 border-[#61b8ff]/40 text-[#61b8ff]",
  하드: "bg-[#ff6b2b]/10 border-[#ff6b2b]/40 text-[#ff6b2b]",
  카오스: "bg-[#c878ff]/10 border-[#c878ff]/40 text-[#c878ff]",
};

function getAccessState(
  diff: Difficulty,
  charLevel: number,
  maxStatAtk: number
): "clear" | "possible" | "level_locked" | "stat_locked" {
  if (charLevel < diff.reqLevel) return "level_locked";
  if (diff.reqStatAtk > 0 && maxStatAtk < diff.reqStatAtk * 0.7) return "stat_locked";
  if (diff.reqStatAtk > 0 && maxStatAtk < diff.reqStatAtk) return "possible";
  return "clear";
}

interface Props {
  characterLevel: number;
  maxStatAtk: number;
}

export default function CharacterBoss({ characterLevel, maxStatAtk }: Props) {
  const [category, setCategory] = useState<"전체" | "일간" | "주간">("전체");

  const filtered = BOSS_LIST.filter(b => category === "전체" || b.category === category);

  const accessibleCount = BOSS_LIST.flatMap(b => b.difficulties)
    .filter(d => getAccessState(d, characterLevel, maxStatAtk) !== "level_locked").length;

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-white">보스 진행도</h2>
          <p className="text-xs text-[#8888aa] mt-0.5">
            레벨 기준 입장 가능 {accessibleCount}개 난이도 · 스탯공격력 {(maxStatAtk / 10000).toFixed(0)}만
          </p>
        </div>
        <div className="flex gap-1.5">
          {(["전체", "일간", "주간"] as const).map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${category === c
                  ? "bg-gradient-to-r from-[#ff6b2b] to-[#ff8c42] text-white"
                  : "bg-[#0d0d1a] border border-[#2a2a4a] text-[#8888aa] hover:text-white"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 범례 */}
      <div className="flex gap-3 flex-wrap text-xs">
        <LegendItem color="text-[#00dc64]" icon={<CheckCircle size={12}/>} label="클리어 가능" />
        <LegendItem color="text-[#ffd700]" icon={<AlertCircle size={12}/>} label="스탯 부족 (입장 가능)" />
        <LegendItem color="text-[#8888aa]" icon={<Lock size={12}/>} label="레벨 잠금" />
      </div>

      {/* 보스 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(boss => (
          <BossCard
            key={boss.name}
            boss={boss}
            charLevel={characterLevel}
            maxStatAtk={maxStatAtk}
          />
        ))}
      </div>

      <p className="text-xs text-[#4a4a7a] text-center pt-2">
        스탯공격력 기준은 커뮤니티 권장치 (솔플 기준) · 실제 클리어와 다를 수 있습니다
      </p>
    </div>
  );
}

function LegendItem({ color, icon, label }: { color: string; icon: React.ReactNode; label: string }) {
  return (
    <div className={`flex items-center gap-1 ${color}`}>
      {icon}
      <span className="text-[#8888aa]">{label}</span>
    </div>
  );
}

function BossCard({ boss, charLevel, maxStatAtk }: {
  boss: BossInfo;
  charLevel: number;
  maxStatAtk: number;
}) {
  const bestAccessible = [...boss.difficulties]
    .reverse()
    .find(d => getAccessState(d, charLevel, maxStatAtk) !== "level_locked");

  return (
    <div className="p-4 rounded-xl bg-[#13132a] border border-[#2a2a4a] space-y-3">
      {/* Boss header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">{boss.name}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded border
            ${boss.category === "일간"
              ? "text-[#00dc64] border-[#00dc64]/40 bg-[#00dc64]/10"
              : "text-[#ff6b2b] border-[#ff6b2b]/40 bg-[#ff6b2b]/10"
            }`}>
            {boss.category}
          </span>
        </div>
        {bestAccessible && (
          <div className="flex items-center gap-1 text-xs">
            <Clock size={11} className="text-[#8888aa]" />
            <span className="text-[#8888aa]">{bestAccessible.resetType} 리셋</span>
          </div>
        )}
      </div>

      {/* Difficulties */}
      <div className="space-y-1.5">
        {boss.difficulties.map(diff => {
          const state = getAccessState(diff, charLevel, maxStatAtk);
          return (
            <DifficultyRow
              key={diff.name}
              diff={diff}
              state={state}
            />
          );
        })}
      </div>
    </div>
  );
}

function DifficultyRow({ diff, state }: {
  diff: Difficulty;
  state: "clear" | "possible" | "level_locked" | "stat_locked";
}) {
  const diffColor = DIFF_COLORS[diff.name] ?? DIFF_COLORS["일반"];
  const locked = state === "level_locked";
  const statLocked = state === "stat_locked";

  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-lg
      transition-opacity ${locked ? "opacity-35" : "opacity-100"}
      bg-[#0d0d1a] border border-[#2a2a4a]`}>
      <div className="flex items-center gap-2.5">
        {/* 상태 아이콘 */}
        {locked ? (
          <Lock size={13} className="text-[#4a4a7a]" />
        ) : state === "clear" ? (
          <CheckCircle size={13} className="text-[#00dc64]" />
        ) : (
          <AlertCircle size={13} className="text-[#ffd700]" />
        )}

        {/* 난이도 뱃지 */}
        <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${diffColor}`}>
          {diff.name}
        </span>

        {/* 레벨 요건 */}
        <span className="text-xs text-[#4a4a7a]">Lv.{diff.reqLevel}+</span>
      </div>

      <div className="flex items-center gap-3">
        {/* 스탯공격력 요건 */}
        {diff.reqStatAtk > 0 && (
          <span className={`text-[11px] font-mono
            ${statLocked ? "text-[#ff4444]" : locked ? "text-[#4a4a7a]" : "text-[#8888aa]"}`}>
            {(diff.reqStatAtk / 10000).toFixed(0)}만+
          </span>
        )}
        {/* 메소 */}
        <span className="text-[11px] text-[#ffd700]">{diff.meso}</span>
      </div>
    </div>
  );
}
