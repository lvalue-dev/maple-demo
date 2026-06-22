import Image from "next/image";
import { Link2 } from "lucide-react";

interface LinkSkillEntry {
  skill_name: string;
  skill_description: string;
  skill_level: number;
  skill_effect: string;
  skill_icon: string;
}

interface LinkSkillData {
  character_class: string;
  character_link_skill: LinkSkillEntry[];
  character_owned_link_skill: LinkSkillEntry | null;
}

interface Props {
  data: LinkSkillData;
}

export default function CharacterLinkSkill({ data }: Props) {
  const skills = data.character_link_skill ?? [];

  return (
    <div className="space-y-5">
      {data.character_owned_link_skill && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Link2 size={14} className="text-[#ffd700]" />
            <h3 className="text-sm font-bold text-[#ffd700]">내 링크스킬</h3>
          </div>
          <SkillCard skill={data.character_owned_link_skill} highlight />
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Link2 size={14} className="text-[#61b8ff]" />
            <h3 className="text-sm font-bold text-white">받은 링크스킬</h3>
          </div>
          <span className="text-xs text-[#4a4a7a]">{skills.length}개</span>
        </div>
        {skills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {skills.map((skill, i) => (
              <SkillCard key={i} skill={skill} />
            ))}
          </div>
        ) : (
          <p className="text-center text-[#4a4a7a] py-8">링크스킬 정보가 없습니다.</p>
        )}
      </section>
    </div>
  );
}

function SkillCard({ skill, highlight = false }: { skill: LinkSkillEntry; highlight?: boolean }) {
  return (
    <div className={`flex gap-3 p-3 rounded-xl border
      ${highlight ? "bg-[#1a1500] border-[#ffd700]/30" : "bg-[#0d0d1a] border-[#2a2a4a]"}`}>
      {skill.skill_icon ? (
        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[#2a2a4a] border border-[#3a3a5a]">
          <Image
            src={skill.skill_icon}
            alt={skill.skill_name}
            width={40}
            height={40}
            unoptimized
            className="object-contain w-full h-full"
          />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-lg bg-[#2a2a4a] flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className={`text-sm font-semibold truncate ${highlight ? "text-[#ffd700]" : "text-white"}`}>
            {skill.skill_name}
          </p>
          <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0
            ${highlight ? "bg-[#ffd700]/20 text-[#ffd700]" : "bg-[#2a2a4a] text-[#8888aa]"}`}>
            Lv.{skill.skill_level}
          </span>
        </div>
        <p className="text-xs text-[#8888aa] leading-relaxed line-clamp-2">
          {skill.skill_effect || skill.skill_description}
        </p>
      </div>
    </div>
  );
}
