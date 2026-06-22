import { Zap, TrendingUp } from "lucide-react";

interface Props {
  charClass: string;
  stats: Map<string, string>;
}

interface StatInfo {
  primary: string;
  secondary: string;
  attack: "공격력" | "마력";
}

// 직업별 주스탯 / 부스탯 / 공마력 분류
const CLASS_STAT_MAP: Record<string, StatInfo> = {
  // 전사 (STR)
  "히어로": { primary: "STR", secondary: "DEX", attack: "공격력" },
  "팔라딘": { primary: "STR", secondary: "DEX", attack: "공격력" },
  "다크나이트": { primary: "STR", secondary: "DEX", attack: "공격력" },
  "소울마스터": { primary: "STR", secondary: "DEX", attack: "공격력" },
  "미하일": { primary: "STR", secondary: "DEX", attack: "공격력" },
  "블래스터": { primary: "STR", secondary: "DEX", attack: "공격력" },
  "아란": { primary: "STR", secondary: "DEX", attack: "공격력" },
  "카이저": { primary: "STR", secondary: "DEX", attack: "공격력" },
  "아델": { primary: "STR", secondary: "DEX", attack: "공격력" },
  "데몬슬레이어": { primary: "STR", secondary: "DEX", attack: "공격력" },
  "제로": { primary: "STR", secondary: "DEX", attack: "공격력" },
  "영웅": { primary: "STR", secondary: "DEX", attack: "공격력" },
  // 마법사 (INT)
  "아크메이지(불,독)": { primary: "INT", secondary: "LUK", attack: "마력" },
  "아크메이지(썬,콜)": { primary: "INT", secondary: "LUK", attack: "마력" },
  "비숍": { primary: "INT", secondary: "LUK", attack: "마력" },
  "배틀메이지": { primary: "INT", secondary: "LUK", attack: "마력" },
  "에반": { primary: "INT", secondary: "LUK", attack: "마력" },
  "루미너스": { primary: "INT", secondary: "LUK", attack: "마력" },
  "일리움": { primary: "INT", secondary: "LUK", attack: "마력" },
  "키네시스": { primary: "INT", secondary: "LUK", attack: "마력" },
  "카인": { primary: "INT", secondary: "LUK", attack: "마력" },
  "라라": { primary: "INT", secondary: "LUK", attack: "마력" },
  "칼리": { primary: "INT", secondary: "LUK", attack: "마력" },
  "레아": { primary: "INT", secondary: "LUK", attack: "마력" },
  "청룡": { primary: "INT", secondary: "LUK", attack: "마력" },
  "불독": { primary: "INT", secondary: "LUK", attack: "마력" },
  "썬콜": { primary: "INT", secondary: "LUK", attack: "마력" },
  // 궁수 (DEX)
  "보우마스터": { primary: "DEX", secondary: "STR", attack: "공격력" },
  "신궁": { primary: "DEX", secondary: "STR", attack: "공격력" },
  "패스파인더": { primary: "DEX", secondary: "STR", attack: "공격력" },
  "와일드헌터": { primary: "DEX", secondary: "STR", attack: "공격력" },
  "메르세데스": { primary: "DEX", secondary: "STR", attack: "공격력" },
  "아크": { primary: "DEX", secondary: "STR", attack: "공격력" },
  "카린": { primary: "DEX", secondary: "STR", attack: "공격력" },
  // 도적 (LUK)
  "나이트로드": { primary: "LUK", secondary: "DEX", attack: "공격력" },
  "섀도어": { primary: "LUK", secondary: "DEX", attack: "공격력" },
  "듀얼블레이더": { primary: "LUK", secondary: "DEX", attack: "공격력" },
  "카데나": { primary: "LUK", secondary: "DEX", attack: "공격력" },
  "나이트워커": { primary: "LUK", secondary: "DEX", attack: "공격력" },
  "호영": { primary: "LUK", secondary: "DEX", attack: "공격력" },
  "팬텀": { primary: "LUK", secondary: "DEX", attack: "공격력" },
  "음양사": { primary: "LUK", secondary: "DEX", attack: "공격력" },
  "듀얼블레이드": { primary: "LUK", secondary: "DEX", attack: "공격력" },
  // 해적 STR
  "바이퍼": { primary: "STR", secondary: "DEX", attack: "공격력" },
  "스트라이커": { primary: "STR", secondary: "DEX", attack: "공격력" },
  "은월": { primary: "STR", secondary: "DEX", attack: "공격력" },
  "캐논슈터": { primary: "STR", secondary: "DEX", attack: "공격력" },
  // 해적 DEX
  "메카닉": { primary: "DEX", secondary: "STR", attack: "공격력" },
  "엔젤릭버스터": { primary: "DEX", secondary: "STR", attack: "공격력" },
  "캡틴": { primary: "DEX", secondary: "STR", attack: "공격력" },
  // 특수
  "데몬어벤저": { primary: "HP", secondary: "STR", attack: "공격력" },
  "제논": { primary: "STR", secondary: "DEX", attack: "공격력" },
};

function getStat(stats: Map<string, string>, key: string): number {
  return parseFloat((stats.get(key) ?? "0").replace(/,/g, "")) || 0;
}

function guessStatInfo(stats: Map<string, string>): StatInfo {
  const str = getStat(stats, "STR");
  const dex = getStat(stats, "DEX");
  const int_ = getStat(stats, "INT");
  const luk = getStat(stats, "LUK");
  const max = Math.max(str, dex, int_, luk);
  if (max === int_) return { primary: "INT", secondary: "LUK", attack: "마력" };
  if (max === luk) return { primary: "LUK", secondary: "DEX", attack: "공격력" };
  if (max === dex && dex > str) return { primary: "DEX", secondary: "STR", attack: "공격력" };
  return { primary: "STR", secondary: "DEX", attack: "공격력" };
}

export default function CharacterConvertedStat({ charClass, stats }: Props) {
  const info = CLASS_STAT_MAP[charClass] ?? guessStatInfo(stats);
  const isDemonAvenger = charClass === "데몬어벤저";

  const primary = getStat(stats, info.primary);
  const secondary = getStat(stats, info.secondary);
  const attack = getStat(stats, info.attack);
  const maxStatAtk = getStat(stats, "최대 스탯공격력");
  const minStatAtk = getStat(stats, "최소 스탯공격력");

  const damage = getStat(stats, "데미지");
  const bossDmg = getStat(stats, "보스 몬스터 데미지");
  const finalDmg = getStat(stats, "최종 데미지");
  const ignoreDef = getStat(stats, "방어율 무시");
  const critDmg = getStat(stats, "크리티컬 데미지");
  const critRate = getStat(stats, "크리티컬 확률");

  // 환산 주스탯 = 주스탯 + 부스탯/4
  const converted = isDemonAvenger
    ? Math.round(primary / 10000) // 데어는 HP 기반
    : Math.round(primary + secondary / 4);

  // 공(마)력 환산 주스탯: 공마력 1 ≈ (주×4+부)/(주×4) 에 해당하는 효과
  // → 환산 공마력 = attack * (primary * 4 + secondary) / (primary * 4)
  const statPerAtk = primary > 0 ? (primary * 4 + secondary) / (primary * 4) : 1;
  const convertedAtk = Math.round(attack * statPerAtk);

  // 데미지 배율 조합 (보스 기준)
  const dmgMulti = (1 + (damage + bossDmg) / 100) * (1 + finalDmg / 100);
  const avgCritMulti = critRate >= 100
    ? 1 + critDmg / 100
    : 1 + (critRate / 100) * (critDmg / 100);
  const totalMulti = dmgMulti * avgCritMulti;

  return (
    <div className="space-y-4 mb-6">
      {/* 환산 주스탯 헤더 */}
      <div className="flex items-center gap-2">
        <TrendingUp size={18} className="text-[#ff6b2b]" />
        <h3 className="text-base font-bold text-white">환산 스탯 분석</h3>
        <span className="text-xs text-[#4a4a7a] ml-1">({charClass})</span>
      </div>

      {/* 메인 카드들 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <BigStatCard
          label="환산 주스탯"
          value={converted.toLocaleString()}
          unit={info.primary}
          color="from-[#ff6b2b] to-[#ffd700]"
          hint={`${info.primary} + ${info.secondary}÷4`}
        />
        <BigStatCard
          label={`환산 ${info.attack}`}
          value={convertedAtk.toLocaleString()}
          unit={info.attack}
          color="from-[#7c3aed] to-[#c878ff]"
          hint={`${info.attack} 기준 환산`}
        />
        <BigStatCard
          label="최대 스탯공격력"
          value={maxStatAtk > 0 ? maxStatAtk.toLocaleString() : "-"}
          unit=""
          color="from-[#00dc64] to-[#00aaaa]"
          hint={`최소 ${minStatAtk.toLocaleString()}`}
        />
        <BigStatCard
          label="데미지 배율"
          value={`×${totalMulti.toFixed(2)}`}
          unit=""
          color="from-[#ff4444] to-[#ff8800]"
          hint="보스 + 최종 + 크뎀 합산"
        />
      </div>

      {/* 데미지 구성 상세 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <DmgChip label="데미지" value={`+${damage}%`} color="text-[#ff8888]" />
        <DmgChip label="보공" value={`+${bossDmg}%`} color="text-[#ff6b2b]" />
        <DmgChip label="최종뎀" value={`+${finalDmg}%`} color="text-[#ffd700]" />
        <DmgChip label="방무" value={`${ignoreDef}%`} color="text-[#00dc64]" />
        <DmgChip label="크확" value={`${Math.min(critRate, 100)}%`} color="text-[#61b8ff]" />
        <DmgChip label="크뎀" value={`+${critDmg}%`} color="text-[#c878ff]" />
      </div>

      {/* 스탯 기여 시각화 */}
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
    </div>
  );
}

function BigStatCard({
  label, value, unit, color, hint,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
  hint: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#2a2a4a] bg-[#0d0d1a] p-4">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-[0.07]`} />
      <div className="relative">
        <p className="text-xs text-[#8888aa] mb-2">{label}</p>
        <p className={`text-xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent leading-tight`}>
          {value}
        </p>
        {unit && <p className="text-xs text-[#4a4a7a] mt-0.5">{unit}</p>}
        <p className="text-[10px] text-[#4a4a7a] mt-2 border-t border-[#2a2a4a] pt-2">{hint}</p>
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

function StatBar({
  label, value, max, color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
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
