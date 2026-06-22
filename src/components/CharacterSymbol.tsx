import { TrendingUp } from "lucide-react";

interface SymbolItem {
  symbol_name: string;
  symbol_icon: string;
  symbol_description: string;
  symbol_force: string;
  symbol_level: number;
  symbol_str: string;
  symbol_dex: string;
  symbol_int: string;
  symbol_luk: string;
  symbol_hp: string;
  symbol_drop_rate: string;
  symbol_meso_rate: string;
  symbol_exp_rate: string;
  symbol_growth: number;
  symbol_require_growth: number;
}

interface SymbolData {
  date: string;
  character_class: string;
  symbol: SymbolItem[];
}

interface Props {
  data: SymbolData;
}

const ARCANE_SYMBOLS = ["소멸의 여로", "츄츄 아일랜드", "레헬른", "아르카나", "모라스", "에스페라"];
const AUTHENTIC_SYMBOLS = ["세르니움", "오르카", "강림의 세계", "아르테리아", "카르시온", "탈라하르"];

const SYMBOL_MAX_LEVEL: Record<string, number> = {
  arcane: 20,
  authentic: 11,
};

function getSymbolType(name: string): "arcane" | "authentic" | "unknown" {
  if (ARCANE_SYMBOLS.some(n => name.includes(n.split(" ")[0]))) return "arcane";
  if (AUTHENTIC_SYMBOLS.some(n => name.includes(n.split(" ")[0]))) return "authentic";
  return "unknown";
}

function getForceColor(type: "arcane" | "authentic" | "unknown"): string {
  if (type === "arcane") return "from-[#7c3aed] to-[#c878ff]";
  if (type === "authentic") return "from-[#ff6b2b] to-[#ffd700]";
  return "from-[#4a4a7a] to-[#8888aa]";
}

function ProgressRing({ pct, color, size = 56 }: { pct: number; color: string; size?: number }) {
  const r = (size / 2) - 5;
  const circ = 2 * Math.PI * r;
  const dash = circ * (pct / 100);
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} stroke="#2a2a4a" strokeWidth={4} fill="none" />
      <circle
        cx={size/2} cy={size/2} r={r}
        stroke="url(#sg)" strokeWidth={4} fill="none"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff6b2b" />
          <stop offset="100%" stopColor="#ffd700" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function CharacterSymbolPanel({ data }: Props) {
  const arcane = data.symbol.filter(s => getSymbolType(s.symbol_name) === "arcane");
  const authentic = data.symbol.filter(s => getSymbolType(s.symbol_name) === "authentic");

  const totalArcaneForce = arcane.reduce((sum, s) => sum + parseInt(s.symbol_force, 10), 0);
  const totalAuthenticForce = authentic.reduce((sum, s) => sum + parseInt(s.symbol_force, 10), 0);

  return (
    <div className="space-y-6">
      {/* 요약 */}
      <div className="grid grid-cols-2 gap-3">
        <ForceSummaryCard
          label="아케인포스"
          value={totalArcaneForce}
          max={arcane.length * 300}
          color="from-[#7c3aed] to-[#c878ff]"
          count={arcane.length}
          maxSymbols={ARCANE_SYMBOLS.length}
        />
        <ForceSummaryCard
          label="어센틱포스"
          value={totalAuthenticForce}
          max={authentic.length * 210}
          color="from-[#ff6b2b] to-[#ffd700]"
          count={authentic.length}
          maxSymbols={AUTHENTIC_SYMBOLS.length}
        />
      </div>

      {/* 아케인 심볼 */}
      {arcane.length > 0 && (
        <SymbolSection title="아케인 심볼" symbols={arcane} type="arcane" />
      )}

      {/* 어센틱 심볼 */}
      {authentic.length > 0 && (
        <SymbolSection title="어센틱 심볼" symbols={authentic} type="authentic" />
      )}
    </div>
  );
}

function ForceSummaryCard({ label, value, max, color, count, maxSymbols }: {
  label: string;
  value: number;
  max: number;
  color: string;
  count: number;
  maxSymbols: number;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="relative overflow-hidden rounded-xl p-4 bg-[#0d0d1a] border border-[#2a2a4a]">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-[0.07]`} />
      <div className="relative">
        <p className="text-xs text-[#8888aa] mb-2">{label}</p>
        <p className={`text-2xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
          {value.toLocaleString()}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-[#2a2a4a] overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${color}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <span className="text-xs text-[#4a4a7a]">{count}/{maxSymbols}</span>
        </div>
      </div>
    </div>
  );
}

function SymbolSection({ title, symbols, type }: {
  title: string;
  symbols: SymbolItem[];
  type: "arcane" | "authentic";
}) {
  const maxLevel = type === "arcane" ? 20 : 11;
  const color = getForceColor(type);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <TrendingUp size={14} className="text-[#ff6b2b]" />
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {symbols.map(sym => {
          const growthPct = sym.symbol_require_growth > 0
            ? (sym.symbol_growth / sym.symbol_require_growth) * 100
            : 100;
          const levelPct = (sym.symbol_level / maxLevel) * 100;
          const isMax = sym.symbol_level >= maxLevel;
          const stat = parseInt(sym.symbol_str || sym.symbol_dex || sym.symbol_int || sym.symbol_luk || "0");

          return (
            <div key={sym.symbol_name}
              className="flex gap-3 p-3 rounded-xl bg-[#13132a] border border-[#2a2a4a]">
              {/* 레벨 링 */}
              <div className="relative flex-shrink-0 flex items-center justify-center">
                <ProgressRing pct={levelPct} color={color} size={52} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-sm font-black
                    ${isMax ? "text-[#ffd700]" : "text-white"}`}>
                    {sym.symbol_level}
                  </span>
                </div>
              </div>

              {/* 정보 */}
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-xs font-medium text-white truncate">
                  {sym.symbol_name.replace("의 심볼", "").replace(" 심볼", "")}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                    +{sym.symbol_force} Force
                  </span>
                  {stat > 0 && (
                    <span className="text-xs text-[#8888aa]">스탯 +{stat.toLocaleString()}</span>
                  )}
                </div>
                {/* 경험치 바 */}
                {!isMax && sym.symbol_require_growth > 0 && (
                  <div>
                    <div className="h-1 rounded-full bg-[#2a2a4a] overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${color}`}
                        style={{ width: `${Math.min(growthPct, 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-[#4a4a7a] mt-0.5">
                      {sym.symbol_growth.toLocaleString()} / {sym.symbol_require_growth.toLocaleString()}
                    </p>
                  </div>
                )}
                {isMax && (
                  <span className="text-[10px] text-[#ffd700] font-bold">MAX</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
