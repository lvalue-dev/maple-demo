"use client";

import { TrendingUp, Hexagon } from "lucide-react";
import { getStat, bossDefRatio, computeConvertedStat } from "@/lib/converted-stat";

interface HexaStatCore {
  slot_id: string;
  main_stat_name: string;
  sub_stat_name_1: string;
  sub_stat_name_2: string;
  main_stat_level: number;
  sub_stat_level_1: number;
  sub_stat_level_2: number;
  stat_grade: number;
}

interface HexaStatData {
  character_hexa_stat_core?: HexaStatCore[];
  preset_hexa_stat_core?: HexaStatCore[];
}

interface Props {
  charClass: string;
  stats: Map<string, string>;
  hexaStat?: HexaStatData | null;
}

// HEXA 스탯 코어 레벨당 % 보너스 (메인 슬롯 2%, 서브 슬롯 1%)
const HEXA_PCT_PER_LEVEL: Record<string, { main: number; sub: number }> = {
  "보스 데미지":      { main: 2, sub: 1 },
  "보스 몬스터 데미지": { main: 2, sub: 1 },
  "크리티컬 데미지":  { main: 2, sub: 1 },
  "데미지":           { main: 2, sub: 1 },
  "방어율 무시":      { main: 2, sub: 1 },
};

interface HexaContrib { boss: number; crit: number; dmg: number }

function calcHexaContrib(cores: HexaStatCore[]): HexaContrib {
  const r: HexaContrib = { boss: 0, crit: 0, dmg: 0 };
  const add = (name: string, level: number, isMain: boolean) => {
    const entry = HEXA_PCT_PER_LEVEL[name];
    if (!entry || level <= 0) return;
    const pct = isMain ? entry.main : entry.sub;
    if (name === "보스 데미지" || name === "보스 몬스터 데미지") r.boss += level * pct;
    else if (name === "크리티컬 데미지") r.crit += level * pct;
    else if (name === "데미지") r.dmg += level * pct;
  };
  for (const c of cores) {
    add(c.main_stat_name, c.main_stat_level, true);
    add(c.sub_stat_name_1, c.sub_stat_level_1, false);
    add(c.sub_stat_name_2, c.sub_stat_level_2, false);
  }
  return r;
}

function formatKorean(n: number): string {
  if (n <= 0) return "0";
  const oku = Math.floor(n / 100_000_000);
  const man = Math.floor((n % 100_000_000) / 10_000);
  const rem = n % 10_000;
  if (oku > 0) {
    const manPart = man > 0 ? ` ${man.toLocaleString()}만` : "";
    return `${oku.toLocaleString()}억${manPart}`;
  }
  if (man > 0 && rem > 0) return `${man.toLocaleString()}만 ${rem.toLocaleString()}`;
  if (man > 0) return `${man.toLocaleString()}만`;
  return n.toLocaleString();
}

export default function CharacterConvertedStat({ charClass, stats, hexaStat }: Props) {
  const {
    info, primary, secondary, converted, hexaConverted380: converted380,
    maxStatAtk, battlePower, damage, bossDmg, finalDmg, ignoreDef, critDmg, critRate,
  } = computeConvertedStat(charClass, stats);

  const attack = getStat(stats, info.attack);
  const minStatAtk = getStat(stats, "최소 스탯공격력");

  // 크리티컬 보정: 기본 크리뎀 35% 포함 (MapleStory 공식)
  const critMulti = 1 + Math.min(critRate, 100) / 100 * (0.35 + critDmg / 100);

  // maplescouter 정의:
  //   환산(380) = 환산주스탯 (= 주스탯 + 부스탯/4), 데미지 배율 없음
  //   헥사환산(380) = 환산주스탯 × bossDefRatio(380, ignoreDef)
  const defRatio300 = bossDefRatio(300, ignoreDef);
  const converted300 = Math.round(converted * defRatio300);

  // 데미지 배율 포함 환산 (참고용)
  const totalDmgMulti = (1 + (damage + bossDmg) / 100) * (1 + finalDmg / 100) * critMulti;
  const dojoMulti = (1 + damage / 100) * (1 + finalDmg / 100) * critMulti;
  const convertedTotal = Math.round(converted * totalDmgMulti);
  const dojoConverted = Math.round(converted * dojoMulti);

  // 헥사환산 = 환산 × bossDefRatio (maplescouter 기준)
  const hexaConverted380 = converted380;
  const hexaConverted300 = converted300;
  const hexaConverted = converted;

  const effectiveDef380 = Math.min(100, 380 * (1 - ignoreDef / 100));
  const effectiveDef300 = Math.min(100, 300 * (1 - ignoreDef / 100));

  return (
    <div className="space-y-4 mb-6">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <TrendingUp size={18} className="text-[#ff6b2b]" />
        <h3 className="text-base font-bold text-white">환산 스탯 분석</h3>
        <span className="text-xs text-[#4a4a7a] ml-1">({charClass})</span>
      </div>

      {/* 핵심 지표: 환산(380) + 헥사환산(380) — HERO */}
      <div className="grid grid-cols-2 gap-3">
        <HeroCard
          label="환산(380)"
          value={converted.toLocaleString()}
          sub="주스탯 + 부스탯÷4"
          gradient="from-[#ff6b2b] to-[#ffd700]"
        />
        <HeroCard
          label="헥사환산(380)"
          value={hexaConverted380.toLocaleString()}
          sub={`실효방어 ${effectiveDef380.toFixed(1)}% 적용`}
          gradient="from-[#c878ff] to-[#7c3aed]"
        />
      </div>

      {/* 보조 지표 */}
      <div className="grid grid-cols-2 gap-3">
        <ConvCard
          label="환산(300)"
          value={converted.toLocaleString()}
          sub="주스탯 + 부스탯÷4"
          gradient="from-[#ff8844] to-[#ffaa44]"
        />
        <ConvCard
          label="헥사환산(300)"
          value={hexaConverted300.toLocaleString()}
          sub={`실효방어 ${effectiveDef300.toFixed(1)}% 적용`}
          gradient="from-[#aa66ff] to-[#6633cc]"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ConvCard
          label="환산 (데미지 포함)"
          value={convertedTotal.toLocaleString()}
          sub="데미지·보공·크리 배율 포함"
          gradient="from-[#61b8ff] to-[#0088cc]"
        />
        <ConvCard
          label="무릉"
          value={dojoConverted.toLocaleString()}
          sub="보스데미지 제외"
          gradient="from-[#00dc64] to-[#00aaaa]"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ConvCard
          label="전투력"
          value={battlePower > 0 ? formatKorean(battlePower) : "-"}
          sub="Nexon API 전투력"
          gradient="from-[#aaaacc] to-[#666688]"
        />
        <ConvCard
          label="헥사환산"
          value={hexaConverted > 0 ? hexaConverted.toLocaleString() : "-"}
          sub="HEXA 코어 기여분"
          gradient="from-[#c878ff] to-[#7c3aed]"
        />
      </div>

      {/* 데미지 구성 칩 */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <DmgChip label="데미지" value={`+${damage}%`} color="text-[#ff8888]" />
        <DmgChip label="보공" value={`+${bossDmg}%`} color="text-[#ff6b2b]" />
        <DmgChip label="최종뎀" value={`+${finalDmg}%`} color="text-[#ffd700]" />
        <DmgChip label="방무" value={`${ignoreDef}%`} color="text-[#00dc64]" />
        <DmgChip label="크확" value={`${Math.min(critRate, 100)}%`} color="text-[#61b8ff]" />
        <DmgChip label="크뎀" value={`+${critDmg}%`} color="text-[#c878ff]" />
      </div>

      {/* 환산 그래프 (레이더) */}
      <div className="p-4 rounded-xl bg-[#0d0d1a] border border-[#2a2a4a]">
        <p className="text-xs text-[#8888aa] font-medium mb-3">환산 그래프</p>
        <RadarChart
          values={[bossDmg, critDmg, ignoreDef, finalDmg, damage, attack]}
          labels={["보공", "크뎀", "방무", "최종뎀", "데미지", "공마"]}
          maxValues={[300, 100, 100, 200, 150, 15000]}
          colors={{ fill: "rgba(255,107,43,0.25)", stroke: "#ff6b2b" }}
        />
      </div>

      {/* 스탯공격력 + 환산주스탯 */}
      <div className="grid grid-cols-2 gap-3">
        <ConvCard
          label="최대 스탯공격력"
          value={maxStatAtk > 0 ? maxStatAtk.toLocaleString() : "-"}
          sub={`최소 ${minStatAtk.toLocaleString()}`}
          gradient="from-[#00dc64] to-[#00aaaa]"
        />
        <ConvCard
          label="환산 주스탯"
          value={converted.toLocaleString()}
          sub={`${info.primary} + ${info.secondary}÷4`}
          gradient="from-[#ffd700] to-[#ff6b2b]"
        />
      </div>

      {/* 스탯 기여 비율 */}
      <div className="p-4 rounded-xl bg-[#0d0d1a] border border-[#2a2a4a] space-y-3">
        <p className="text-xs text-[#8888aa] font-medium">스탯 기여 비율</p>
        <StatBar
          label={`${info.primary} (주스탯)`}
          value={primary}
          max={converted}
          color="bg-gradient-to-r from-[#ff6b2b] to-[#ffd700]"
        />
        <StatBar
          label={`${info.secondary} (부스탯 ÷4)`}
          value={Math.round(secondary / 4)}
          max={converted}
          color="bg-gradient-to-r from-[#7c3aed] to-[#c878ff]"
        />
      </div>

      {/* 헥사 스탯 코어 */}
      {hexaStat?.character_hexa_stat_core && hexaStat.character_hexa_stat_core.length > 0 && (
        <HexaStatSection cores={hexaStat.character_hexa_stat_core} />
      )}
    </div>
  );
}

// ─── 서브 컴포넌트 ───────────────────────────────────────────────────────────

function HeroCard({ label, value, sub, gradient }: {
  label: string; value: string; sub: string; gradient: string;
}) {
  return (
    <div className={`group relative overflow-hidden rounded-xl border bg-[#0d0d1a] p-5
      border-transparent ring-1 ring-[#ff6b2b]/40 shadow-[0_0_20px_rgba(255,107,43,0.12)]
      transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(255,107,43,0.22)]`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.12]
        group-hover:opacity-[0.18] transition-opacity duration-300`} />
      <div className="relative">
        <p className="text-xs font-semibold text-[#aaaacc] mb-2 uppercase tracking-wide">{label}</p>
        <p className={`text-2xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent leading-tight`}>
          {value}
        </p>
        <p className="text-[10px] text-[#6a6a9a] mt-2.5 border-t border-[#2a2a4a] pt-2">{sub}</p>
      </div>
    </div>
  );
}

function ConvCard({ label, value, sub, gradient }: {
  label: string; value: string; sub: string; gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-[#2a2a4a] bg-[#0d0d1a] p-4
      transition-all duration-300 hover:-translate-y-0.5 hover:border-[#3a3a5a]">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.07]
        group-hover:opacity-[0.13] transition-opacity duration-300`} />
      <div className="relative">
        <p className="text-xs text-[#8888aa] mb-1.5">{label}</p>
        <p className={`text-xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent leading-tight`}>
          {value}
        </p>
        <p className="text-[10px] text-[#4a4a7a] mt-2 border-t border-[#2a2a4a] pt-2">{sub}</p>
      </div>
    </div>
  );
}

function DmgChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 p-2.5 rounded-lg bg-[#0d0d1a] border border-[#2a2a4a]">
      <span className="text-[10px] text-[#8888aa]">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );
}

function StatBar({ label, value, max, color }: {
  label: string; value: number; max: number; color: string;
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[#8888aa]">{label}</span>
        <span className="text-white font-mono">{value.toLocaleString()} ({pct.toFixed(1)}%)</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#2a2a4a] overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── 레이더 차트 ─────────────────────────────────────────────────────────────

interface RadarChartProps {
  values: number[];
  labels: string[];
  maxValues: number[];
  colors: { fill: string; stroke: string };
}

function RadarChart({ values, labels, maxValues, colors }: RadarChartProps) {
  const cx = 130, cy = 130, R = 95;
  const n = values.length;

  function angle(i: number) {
    return (-90 + i * (360 / n)) * (Math.PI / 180);
  }

  function vertex(i: number, ratio: number) {
    const a = angle(i);
    return { x: cx + R * ratio * Math.cos(a), y: cy + R * ratio * Math.sin(a) };
  }

  function toPoints(ratios: number[]) {
    return ratios.map((r, i) => {
      const v = vertex(i, r);
      return `${v.x},${v.y}`;
    }).join(" ");
  }

  const ratios = values.map((v, i) => Math.min(Math.max(v, 0) / maxValues[i], 1));
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox="0 0 260 260" className="w-full max-w-[260px] mx-auto select-none">
      {/* 배경 그리드 */}
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={toPoints(Array(n).fill(level))}
          fill="none"
          stroke="#2a2a4a"
          strokeWidth={level === 1 ? 1.5 : 0.8}
        />
      ))}

      {/* 축선 */}
      {Array.from({ length: n }, (_, i) => {
        const v = vertex(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={v.x} y2={v.y} stroke="#2a2a4a" strokeWidth="0.8" />;
      })}

      {/* 데이터 폴리곤 */}
      <polygon
        points={toPoints(ratios)}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* 데이터 점 */}
      {ratios.map((r, i) => {
        const v = vertex(i, r);
        return <circle key={i} cx={v.x} cy={v.y} r="3" fill={colors.stroke} />;
      })}

      {/* 레이블 */}
      {labels.map((label, i) => {
        const v = vertex(i, 1.28);
        return (
          <text
            key={i}
            x={v.x}
            y={v.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#8888aa"
            fontSize="10"
          >
            {label}
          </text>
        );
      })}

      {/* 25% 눈금 표시 */}
      {[0.25, 0.5, 0.75].map((level) => {
        const v = vertex(2, level);
        return (
          <text key={level} x={v.x + 4} y={v.y} fill="#4a4a7a" fontSize="7" dominantBaseline="middle">
            {(level * 100).toFixed(0)}%
          </text>
        );
      })}
    </svg>
  );
}

// ─── 헥사 스탯 ───────────────────────────────────────────────────────────────

const HEXA_GRADE_COLORS = [
  "text-[#8888aa]", "text-[#00dc64]", "text-[#61b8ff]",
  "text-[#c878ff]", "text-[#ffd700]", "text-[#ff6b2b]",
];

function HexaStatSection({ cores }: { cores: HexaStatCore[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Hexagon size={15} className="text-[#c878ff]" />
        <h4 className="text-sm font-bold text-white">헥사 스탯 코어</h4>
        <span className="text-xs text-[#4a4a7a]">({cores.length}개)</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {cores.map((core) => (
          <div key={core.slot_id} className="p-3 rounded-xl bg-[#0d0d1a] border border-[#c878ff]/20">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-bold ${HEXA_GRADE_COLORS[core.stat_grade] ?? "text-white"}`}>
                {core.main_stat_name}
              </span>
              <HexaLevelBadge level={core.main_stat_level} isMain />
            </div>
            <div className="space-y-1">
              {core.sub_stat_name_1 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8888aa]">{core.sub_stat_name_1}</span>
                  <HexaLevelBadge level={core.sub_stat_level_1} />
                </div>
              )}
              {core.sub_stat_name_2 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8888aa]">{core.sub_stat_name_2}</span>
                  <HexaLevelBadge level={core.sub_stat_level_2} />
                </div>
              )}
            </div>
            <div className="mt-2 h-1 rounded-full bg-[#2a2a4a] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#c878ff]"
                style={{ width: `${(core.main_stat_level / 10) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HexaLevelBadge({ level, isMain = false }: { level: number; isMain?: boolean }) {
  const isMax = level >= 10;
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded font-bold
      ${isMax
        ? "bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40"
        : isMain
          ? "bg-[#c878ff]/20 text-[#c878ff] border border-[#c878ff]/40"
          : "bg-[#2a2a4a] text-[#8888aa]"
      }`}>
      Lv.{level}
    </span>
  );
}
