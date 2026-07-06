export interface StatInfo {
  primary: string;
  secondary: string;
  attack: "공격력" | "마력";
}

export const CLASS_STAT_MAP: Record<string, StatInfo> = {
  // 전사 STR
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
  // 마법사 INT
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
  // 궁수 DEX
  "보우마스터": { primary: "DEX", secondary: "STR", attack: "공격력" },
  "신궁": { primary: "DEX", secondary: "STR", attack: "공격력" },
  "패스파인더": { primary: "DEX", secondary: "STR", attack: "공격력" },
  "와일드헌터": { primary: "DEX", secondary: "STR", attack: "공격력" },
  "메르세데스": { primary: "DEX", secondary: "STR", attack: "공격력" },
  "아크": { primary: "DEX", secondary: "STR", attack: "공격력" },
  "카린": { primary: "DEX", secondary: "STR", attack: "공격력" },
  // 도적 LUK
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

export function getStat(stats: Map<string, string>, key: string): number {
  return parseFloat((stats.get(key) ?? "0").replace(/,/g, "")) || 0;
}

export function guessStatInfo(stats: Map<string, string>): StatInfo {
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

export function bossDefRatio(bossDef: number, ignoreRate: number): number {
  const effectiveDef = Math.min(100, bossDef * (1 - ignoreRate / 100));
  return 1 - effectiveDef / 100;
}

export interface ConvertedStatSummary {
  info: StatInfo;
  primary: number;
  secondary: number;
  converted: number;
  hexaConverted380: number;
  maxStatAtk: number;
  battlePower: number;
  damage: number;
  bossDmg: number;
  finalDmg: number;
  ignoreDef: number;
  critDmg: number;
  critRate: number;
}

export function computeConvertedStat(charClass: string, stats: Map<string, string>): ConvertedStatSummary {
  const info = CLASS_STAT_MAP[charClass] ?? guessStatInfo(stats);
  const isDemonAvenger = charClass === "데몬어벤저";

  const primary = getStat(stats, info.primary);
  const secondary = getStat(stats, info.secondary);
  const ignoreDef = getStat(stats, "방어율 무시");

  const converted = isDemonAvenger
    ? Math.round(primary / 10000)
    : Math.round(primary + secondary / 4);

  const defRatio380 = bossDefRatio(380, ignoreDef);

  return {
    info,
    primary,
    secondary,
    converted,
    hexaConverted380: Math.round(converted * defRatio380),
    maxStatAtk: getStat(stats, "최대 스탯공격력"),
    battlePower: getStat(stats, "전투력"),
    damage: getStat(stats, "데미지"),
    bossDmg: getStat(stats, "보스 몬스터 데미지"),
    finalDmg: getStat(stats, "최종 데미지"),
    ignoreDef,
    critDmg: getStat(stats, "크리티컬 데미지"),
    critRate: getStat(stats, "크리티컬 확률"),
  };
}
