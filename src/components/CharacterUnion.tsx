import { UnionInfo, UnionRaider } from "@/types/maple";
import { Shield, Zap } from "lucide-react";

interface Props {
  union: UnionInfo;
  raider?: UnionRaider;
}

const UNION_GRADE_COLORS: Record<string, string> = {
  "그랜드 마스터 유니온 5": "from-[#ff6b2b] to-[#ffd700]",
  "그랜드 마스터 유니온 4": "from-[#ff6b2b] to-[#ffd700]",
  "그랜드 마스터 유니온 3": "from-[#ff6b2b] to-[#ffd700]",
  "그랜드 마스터 유니온 2": "from-[#ff6b2b] to-[#ffd700]",
  "그랜드 마스터 유니온 1": "from-[#ff6b2b] to-[#ffd700]",
  "마스터 유니온 3": "from-[#c878ff] to-[#7c3aed]",
  "마스터 유니온 2": "from-[#c878ff] to-[#7c3aed]",
  "마스터 유니온 1": "from-[#c878ff] to-[#7c3aed]",
};

function getGradeColors(grade: string): string {
  if (grade.startsWith("그랜드 마스터")) return "from-[#ff6b2b] to-[#ffd700]";
  if (grade.startsWith("마스터")) return "from-[#c878ff] to-[#7c3aed]";
  if (grade.startsWith("다이아몬드")) return "from-[#61b8ff] to-[#00dc64]";
  if (grade.startsWith("플래티넘")) return "from-[#e0e0e0] to-[#a0a0a0]";
  return "from-[#61b8ff] to-[#4a4a7a]";
}

function formatUnionExp(exp: number): string {
  if (exp >= 100_000_000) return `${(exp / 100_000_000).toFixed(2)}억`;
  if (exp >= 10_000) return `${(exp / 10_000).toFixed(0)}만`;
  return exp.toLocaleString();
}

export default function CharacterUnionPanel({ union, raider }: Props) {
  const gradeColors = getGradeColors(union.union_grade);

  return (
    <div className="space-y-4">
      {/* Union Overview */}
      <div className={`relative overflow-hidden rounded-xl p-5 bg-gradient-to-br ${gradeColors} bg-opacity-20`}>
        <div className="absolute inset-0 opacity-15 bg-gradient-to-br from-transparent to-black" />
        <div className="relative flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradeColors} flex items-center justify-center
            shadow-[0_0_20px_rgba(255,107,43,0.4)]`}>
            <Shield size={28} className="text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">Lv.{union.union_level}</div>
            <div className={`text-sm font-semibold bg-gradient-to-r ${gradeColors} bg-clip-text text-transparent`}>
              {union.union_grade}
            </div>
          </div>
          {union.union_artifact_level > 0 && (
            <div className="ml-auto text-right">
              <div className="text-xs text-[#8888aa]">아티팩트</div>
              <div className="text-white font-bold">Lv.{union.union_artifact_level}</div>
              <div className="text-xs text-[#8888aa]">{formatUnionExp(union.union_artifact_exp)} XP</div>
            </div>
          )}
        </div>
      </div>

      {/* Union Raider Stats */}
      {raider && (
        <div className="space-y-3">
          {raider.union_raider_stat?.length > 0 && (
            <div className="p-4 rounded-xl bg-[#13132a] border border-[#2a2a4a]">
              <h3 className="text-sm font-semibold text-[#ff6b2b] flex items-center gap-2 mb-3">
                <Zap size={14} />
                공격대 효과
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {raider.union_raider_stat.map((stat, i) => (
                  <div key={i} className="text-xs text-[#8888aa] flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#ff6b2b] mt-1.5 flex-shrink-0" />
                    {stat}
                  </div>
                ))}
              </div>
            </div>
          )}

          {raider.union_occupied_stat?.length > 0 && (
            <div className="p-4 rounded-xl bg-[#13132a] border border-[#2a2a4a]">
              <h3 className="text-sm font-semibold text-[#7c3aed] flex items-center gap-2 mb-3">
                <Shield size={14} />
                점령 효과
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {raider.union_occupied_stat.map((stat, i) => (
                  <div key={i} className="text-xs text-[#8888aa] flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#7c3aed] mt-1.5 flex-shrink-0" />
                    {stat}
                  </div>
                ))}
              </div>
            </div>
          )}

          {raider.union_inner_stat?.length > 0 && (
            <div className="p-4 rounded-xl bg-[#13132a] border border-[#2a2a4a]">
              <h3 className="text-sm font-semibold text-[#00dc64] flex items-center gap-2 mb-3">
                <Zap size={14} />
                내부 효과
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {raider.union_inner_stat.map((stat, i) => (
                  <div key={i} className="text-xs text-[#8888aa] flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#00dc64] mt-1.5 flex-shrink-0" />
                    {stat.stat_field_effect}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Union Blocks */}
          {raider.union_block?.length > 0 && (
            <div className="p-4 rounded-xl bg-[#13132a] border border-[#2a2a4a]">
              <h3 className="text-sm font-semibold text-[#ffd700] mb-3">
                유니온 블록 ({raider.union_block.length}개)
              </h3>
              <div className="flex flex-wrap gap-2">
                {raider.union_block.map((block, i) => (
                  <div key={i} className="px-2 py-1 rounded text-xs bg-[#0d0d1a] border border-[#2a2a4a]">
                    <span className="text-[#ffd700]">{block.block_class}</span>
                    <span className="text-[#8888aa] ml-1">Lv.{block.block_level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
