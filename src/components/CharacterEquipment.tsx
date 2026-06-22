"use client";

import Image from "next/image";
import { useState } from "react";
import { CharacterEquipment, EquipmentItem } from "@/types/maple";
import { X, Star } from "lucide-react";

interface Props {
  data: CharacterEquipment;
}

const RARITY_COLORS: Record<string, string> = {
  레전드리: "text-[#00dc64] border-[#00dc64]/50 bg-[#00dc64]/10",
  유니크: "text-[#ffdc00] border-[#ffdc00]/50 bg-[#ffdc00]/10",
  에픽: "text-[#c878ff] border-[#c878ff]/50 bg-[#c878ff]/10",
  레어: "text-[#61b8ff] border-[#61b8ff]/50 bg-[#61b8ff]/10",
  노말: "text-white border-[#4a4a7a]/50 bg-[#2a2a4a]/10",
};

const RARITY_GLOW: Record<string, string> = {
  레전드리: "shadow-[0_0_12px_rgba(0,220,100,0.5)]",
  유니크: "shadow-[0_0_12px_rgba(255,220,0,0.5)]",
  에픽: "shadow-[0_0_12px_rgba(200,120,255,0.5)]",
  레어: "shadow-[0_0_12px_rgba(97,184,255,0.5)]",
  노말: "",
};

function StarForce({ count }: { count: number }) {
  if (!count) return null;
  const color = count >= 17 ? "text-[#ff4444]" : count >= 12 ? "text-[#ffaa00]" : "text-[#888888]";
  return (
    <div className="flex items-center gap-0.5 mt-1 flex-wrap">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={8} className={color} fill="currentColor" />
      ))}
    </div>
  );
}

function PotentialBadge({ grade }: { grade: string | null }) {
  if (!grade) return null;
  const colors = RARITY_COLORS[grade] ?? RARITY_COLORS["노말"];
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${colors}`}>
      {grade}
    </span>
  );
}

function OptionList({ opts }: { opts: Record<string, string> }) {
  const entries = Object.entries(opts).filter(([, v]) => v && v !== "0");
  if (!entries.length) return null;
  return (
    <ul className="space-y-0.5">
      {entries.map(([k, v]) => (
        <li key={k} className="flex justify-between text-xs">
          <span className="text-[#8888aa]">{k}</span>
          <span className="text-white font-medium">+{v}</span>
        </li>
      ))}
    </ul>
  );
}

function ItemTooltip({ item, onClose }: { item: EquipmentItem; onClose: () => void }) {
  const potGrade = item.potential_option_grade;
  const addPotGrade = item.additional_potential_option_grade;
  const starforce = parseInt(item.starforce ?? "0", 10);
  const baseColors = RARITY_COLORS[potGrade ?? "노말"] ?? RARITY_COLORS["노말"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}>
      <div
        className={`relative w-full max-w-sm max-h-[80vh] overflow-y-auto rounded-xl border p-5 space-y-4
          bg-[#13132a] ${baseColors.includes("border") ? baseColors.split(" ").find(c => c.startsWith("border")) : "border-[#2a2a4a]"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose}
          className="absolute top-3 right-3 text-[#8888aa] hover:text-white">
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3">
          {item.item_icon && (
            <div className={`relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden
              bg-[#0d0d1a] border border-[#2a2a4a] ${RARITY_GLOW[potGrade ?? "노말"] ?? ""}`}>
              <Image src={item.item_icon} alt={item.item_name} fill className="object-contain p-1" unoptimized />
            </div>
          )}
          <div>
            <div className="text-sm font-bold text-white">{item.item_name}</div>
            <div className="text-xs text-[#8888aa] mt-0.5">{item.item_equipment_slot}</div>
            <div className="flex gap-1 mt-1 flex-wrap">
              {potGrade && <PotentialBadge grade={potGrade} />}
              {addPotGrade && <PotentialBadge grade={addPotGrade} />}
            </div>
            <StarForce count={starforce} />
          </div>
        </div>

        {/* Soul */}
        {item.soul_name && (
          <div className="p-2 rounded bg-[#0d0d1a]/80 border border-[#7c3aed]/30">
            <div className="text-xs text-[#7c3aed] font-medium">{item.soul_name}</div>
            {item.soul_option && <div className="text-xs text-[#c878ff]">{item.soul_option}</div>}
          </div>
        )}

        {/* Options */}
        {Object.keys(item.item_total_option ?? {}).length > 0 && (
          <section>
            <h4 className="text-xs font-semibold text-[#8888aa] mb-2">총 옵션</h4>
            <OptionList opts={item.item_total_option} />
          </section>
        )}

        {/* Potentials */}
        {(item.potential_option_1 || item.potential_option_2 || item.potential_option_3) && (
          <section className="p-3 rounded-lg bg-[#1a0f2e] border border-[#7c3aed]/30">
            <h4 className="text-xs font-semibold text-[#c878ff] mb-2">잠재 옵션 ({potGrade})</h4>
            <ul className="space-y-1">
              {[item.potential_option_1, item.potential_option_2, item.potential_option_3]
                .filter(Boolean)
                .map((opt, i) => (
                  <li key={i} className="text-xs text-[#c878ff]">{opt}</li>
                ))}
            </ul>
          </section>
        )}

        {/* Additional Potential */}
        {(item.additional_potential_option_1 || item.additional_potential_option_2 || item.additional_potential_option_3) && (
          <section className="p-3 rounded-lg bg-[#0f1a1a] border border-[#00dc64]/30">
            <h4 className="text-xs font-semibold text-[#00dc64] mb-2">에디셔널 잠재 ({addPotGrade})</h4>
            <ul className="space-y-1">
              {[item.additional_potential_option_1, item.additional_potential_option_2, item.additional_potential_option_3]
                .filter(Boolean)
                .map((opt, i) => (
                  <li key={i} className="text-xs text-[#00dc64]">{opt}</li>
                ))}
            </ul>
          </section>
        )}

        {/* Upgrade info */}
        <div className="flex gap-3 text-xs text-[#8888aa]">
          {item.scroll_upgrade !== "0" && (
            <span>주문서 강화 <span className="text-white">+{item.scroll_upgrade}</span></span>
          )}
          {item.scroll_upgradeable_count !== "0" && (
            <span>업그레이드 가능 <span className="text-white">{item.scroll_upgradeable_count}회</span></span>
          )}
        </div>
      </div>
    </div>
  );
}

function EquipSlot({ item, slot }: { item?: EquipmentItem; slot: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const starforce = parseInt(item?.starforce ?? "0", 10);
  const potGrade = item?.potential_option_grade;
  const glowClass = potGrade ? (RARITY_GLOW[potGrade] ?? "") : "";

  return (
    <>
      <button
        onClick={() => item && setShowTooltip(true)}
        className={`relative flex flex-col items-center justify-center p-2 rounded-lg
          border transition-all duration-200 w-[72px] h-[80px]
          ${item
            ? `bg-[#13132a] border-[#2a2a4a] hover:border-[#ff6b2b]/60 cursor-pointer ${glowClass}`
            : "bg-[#0d0d1a]/40 border-[#1a1a2e] cursor-default"
          }`}
        title={slot}
      >
        {item ? (
          <>
            {item.item_icon && (
              <div className="relative w-10 h-10">
                <Image src={item.item_icon} alt={item.item_name} fill className="object-contain" unoptimized />
              </div>
            )}
            {starforce > 0 && (
              <div className={`text-[9px] font-bold mt-0.5
                ${starforce >= 17 ? "text-[#ff4444]" : starforce >= 12 ? "text-[#ffaa00]" : "text-[#888888]"}`}>
                ★{starforce}
              </div>
            )}
          </>
        ) : (
          <span className="text-[#2a2a4a] text-[10px] text-center leading-tight">{slot}</span>
        )}
      </button>

      {showTooltip && item && (
        <ItemTooltip item={item} onClose={() => setShowTooltip(false)} />
      )}
    </>
  );
}

const EQUIPMENT_SLOTS = [
  "반지1", "반지2", "반지3", "반지4",
  "모자", "얼굴장식", "눈장식", "귀고리",
  "상의", "하의", "신발", "망토",
  "장갑", "어깨장식", "벨트", "훈장",
  "무기", "보조무기", "엠블렘",
  "펜던트", "펜던트2",
  "기계심장",
];

export default function CharacterEquipmentPanel({ data }: Props) {
  const [preset, setPreset] = useState(data.preset_no ?? 1);

  const equipList = preset === 1 ? data.item_equipment
    : preset === 2 ? (data.item_equipment_preset2 ?? data.item_equipment)
    : (data.item_equipment_preset3 ?? data.item_equipment);

  const equipMap = new Map(equipList.map((item) => [item.item_equipment_slot, item]));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">장비 정보</h2>
        <div className="flex gap-2">
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => setPreset(p)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200
                ${preset === p
                  ? "bg-gradient-to-r from-[#ff6b2b] to-[#ff8c42] text-white"
                  : "bg-[#13132a] border border-[#2a2a4a] text-[#8888aa] hover:border-[#ff6b2b]"
                }`}
            >
              프리셋 {p}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="flex flex-wrap gap-2 justify-center">
        {EQUIPMENT_SLOTS.map((slot) => (
          <EquipSlot key={slot} slot={slot} item={equipMap.get(slot)} />
        ))}
      </div>

      {/* Equipment List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
        {equipList.filter((item) => item.potential_option_grade).map((item) => {
          const grade = item.potential_option_grade ?? "노말";
          const colors = RARITY_COLORS[grade] ?? RARITY_COLORS["노말"];
          const starforce = parseInt(item.starforce ?? "0", 10);
          return (
            <div key={item.item_equipment_slot}
              className={`flex items-center gap-3 p-3 rounded-lg border ${colors}`}>
              {item.item_icon && (
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image src={item.item_icon} alt={item.item_name} fill className="object-contain" unoptimized />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{item.item_name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[#8888aa]">{item.item_equipment_slot}</span>
                  {starforce > 0 && (
                    <span className={`text-xs font-bold
                      ${starforce >= 17 ? "text-[#ff4444]" : starforce >= 12 ? "text-[#ffaa00]" : "text-[#888888]"}`}>
                      ★{starforce}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
