import Image from "next/image";
import { CharacterBasic } from "@/types/maple";
import { Calendar, Users, Star, Sword } from "lucide-react";

interface Props {
  data: CharacterBasic;
}

function formatExp(exp: number): string {
  if (exp >= 1_000_000_000_000) return `${(exp / 1_000_000_000_000).toFixed(2)}조`;
  if (exp >= 100_000_000) return `${(exp / 100_000_000).toFixed(2)}억`;
  if (exp >= 10_000) return `${(exp / 10_000).toFixed(2)}만`;
  return exp.toLocaleString();
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  return dateStr.slice(0, 10).replace(/-/g, ".");
}

export default function CharacterBasicCard({ data }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#2a2a4a] bg-gradient-to-br from-[#13132a] to-[#1e0f32]">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#ff6b2b] blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#7c3aed] blur-[60px]" />
      </div>

      <div className="relative flex flex-col md:flex-row gap-6 p-6">
        {/* Character Image */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden
            border-2 border-[#ff6b2b] shadow-[0_0_20px_rgba(255,107,43,0.4)]
            bg-[#0d0d1a]">
            {data.character_image ? (
              <Image
                src={data.character_image}
                alt={data.character_name}
                fill
                className="object-contain"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#4a4a7a]">
                <Sword size={40} />
              </div>
            )}
          </div>
          <div className="mt-2 px-3 py-1 rounded-full text-xs font-bold
            bg-gradient-to-r from-[#ff6b2b] to-[#ff8c42] text-white">
            Lv.{data.character_level}
          </div>
        </div>

        {/* Character Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white text-glow">
              {data.character_name}
            </h1>
            <p className="text-[#8888aa] mt-1">
              <span className="text-[#ff6b2b] font-semibold">{data.character_class}</span>
              {data.character_class_level && (
                <span className="text-[#4a4a7a]"> · {data.character_class_level}차</span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <InfoBadge
              icon={<Users size={14} />}
              label="서버"
              value={data.world_name}
              color="text-[#61b8ff]"
            />
            <InfoBadge
              icon={<Star size={14} />}
              label="길드"
              value={data.character_guild_name || "미가입"}
              color="text-[#ffd700]"
            />
            <InfoBadge
              icon={<Calendar size={14} />}
              label="생성일"
              value={formatDate(data.character_date_create)}
              color="text-[#00dc64]"
            />
            <InfoBadge
              icon={<Sword size={14} />}
              label="경험치"
              value={formatExp(data.character_exp)}
              color="text-[#ff6b2b]"
            />
          </div>

          {/* EXP Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#8888aa]">경험치 진행도</span>
              <span className="text-[#ff6b2b] font-bold">{data.character_exp_rate}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#2a2a4a] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#ff6b2b] to-[#ffd700] transition-all duration-1000"
                style={{ width: `${Math.min(parseFloat(data.character_exp_rate) || 0, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBadge({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-lg bg-[#0d0d1a]/60 border border-[#2a2a4a]">
      <div className="flex items-center gap-1 text-[#8888aa] text-xs">
        {icon}
        <span>{label}</span>
      </div>
      <span className={`font-semibold text-sm truncate ${color}`}>{value}</span>
    </div>
  );
}
