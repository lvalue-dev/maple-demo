"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";

interface HyperStatEntry {
  stat_type: string;
  stat_point: number | null;
  stat_level: number;
  stat_increase: string | null;
}

interface HyperStatData {
  character_class: string;
  use_preset_no: string;
  use_available_hyper_stat: number;
  hyper_stat_preset_1: HyperStatEntry[];
  hyper_stat_preset_1_remain_point: number;
  hyper_stat_preset_2: HyperStatEntry[];
  hyper_stat_preset_2_remain_point: number;
  hyper_stat_preset_3: HyperStatEntry[];
  hyper_stat_preset_3_remain_point: number;
}

interface Props {
  data: HyperStatData;
}

const IMPORTANT = new Set([
  "데미지", "보스 몬스터 데미지", "크리티컬 확률", "크리티컬 데미지",
  "방어율 무시", "최종 데미지", "공격력", "마력",
  "STR", "DEX", "INT", "LUK",
]);

export default function CharacterHyperStat({ data }: Props) {
  const activePreset = parseInt(data.use_preset_no ?? "1") || 1;
  const [selected, setSelected] = useState(activePreset);

  const entries: HyperStatEntry[] =
    (data[`hyper_stat_preset_${selected}` as keyof HyperStatData] as HyperStatEntry[] | undefined) ?? [];
  const remainPoint: number =
    (data[`hyper_stat_preset_${selected}_remain_point` as keyof HyperStatData] as number | undefined) ?? 0;

  const activeStats = entries.filter((e) => e.stat_level > 0);
  const usedPoints = activeStats.reduce((s, e) => s + (e.stat_point ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-[#ff6b2b]" />
          <h2 className="text-lg font-bold text-white">하이퍼 스탯</h2>
        </div>
        <div className="flex gap-1.5">
          {([1, 2, 3] as const).map((p) => (
            <button
              key={p}
              onClick={() => setSelected(p)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all
                ${selected === p ? "bg-[#ff6b2b] text-white" : "bg-[#0d0d1a] border border-[#2a2a4a] text-[#8888aa] hover:text-white"}
                ${activePreset === p ? "ring-1 ring-[#ffd700]/60" : ""}`}
            >
              프리셋 {p}{activePreset === p ? " ★" : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-[#0d0d1a] border border-[#2a2a4a] text-center">
          <p className="text-xs text-[#8888aa] mb-1">사용 포인트</p>
          <p className="text-xl font-bold text-[#ff6b2b]">{usedPoints.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-xl bg-[#0d0d1a] border border-[#2a2a4a] text-center">
          <p className="text-xs text-[#8888aa] mb-1">잔여 포인트</p>
          <p className={`text-xl font-bold ${remainPoint > 0 ? "text-[#ffd700]" : "text-[#4a4a7a]"}`}>
            {remainPoint.toLocaleString()}
          </p>
        </div>
      </div>

      {activeStats.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {activeStats.map((stat) => {
            const imp = IMPORTANT.has(stat.stat_type);
            return (
              <div
                key={stat.stat_type}
                className={`flex items-center justify-between p-3 rounded-lg border
                  ${imp ? "bg-[#1a0d2e] border-[#7c3aed]/30" : "bg-[#13132a] border-[#2a2a4a]"}`}
              >
                <div className="min-w-0 flex-1 mr-2">
                  <p className="text-sm text-[#8888aa] truncate">{stat.stat_type}</p>
                  {stat.stat_increase && (
                    <p className={`text-xs font-medium ${imp ? "text-[#c878ff]" : "text-[#61b8ff]"}`}>
                      {stat.stat_increase}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {stat.stat_point != null && (
                    <span className="text-xs text-[#4a4a7a]">{stat.stat_point.toLocaleString()}pt</span>
                  )}
                  <span className={`text-sm font-bold px-2 py-0.5 rounded
                    ${stat.stat_level >= 10
                      ? "bg-[#ffd700]/20 text-[#ffd700]"
                      : imp
                        ? "bg-[#7c3aed]/20 text-[#c878ff]"
                        : "bg-[#2a2a4a] text-[#8888aa]"
                    }`}>
                    Lv.{stat.stat_level}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-[#4a4a7a] py-8">하이퍼 스탯이 설정되지 않았습니다.</p>
      )}
    </div>
  );
}
