import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import { Trophy, Sword, Shield, Zap, Star } from "lucide-react";

const POPULAR_CLASSES = [
  "아크", "일리움", "카인", "라라", "칼리", "아델", "카데나",
  "비숍", "보우마스터", "신궁", "듀블", "나이트워커",
];

const WORLDS = [
  { name: "스카니아", color: "from-[#ff4444] to-[#ff8888]" },
  { name: "베라", color: "from-[#44aaff] to-[#88ccff]" },
  { name: "루나", color: "from-[#aa44ff] to-[#cc88ff]" },
  { name: "크로아", color: "from-[#44ff88] to-[#88ffaa]" },
  { name: "유니온", color: "from-[#ffaa44] to-[#ffcc88]" },
  { name: "리부트", color: "from-[#ff6b2b] to-[#ffd700]" },
  { name: "리부트2", color: "from-[#7c3aed] to-[#c878ff]" },
];

export default function HomePage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
          bg-[#ff6b2b]/10 border border-[#ff6b2b]/30 text-[#ff6b2b] text-sm font-medium">
          <Star size={14} fill="currentColor" />
          Nexon Open API 기반 캐릭터 정보 플랫폼
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
          <span className="bg-gradient-to-r from-[#ff6b2b] via-[#ffd700] to-[#ff6b2b] bg-clip-text text-transparent
            bg-[length:200%] animate-pulse">
            MapleInfo
          </span>
          <br />
          <span className="text-2xl md:text-3xl text-[#8888aa] font-normal">
            메이플스토리 캐릭터 정보 플랫폼
          </span>
        </h1>

        <p className="text-[#8888aa] max-w-md mx-auto">
          캐릭터 이름을 검색해 스탯, 장비, 유니온, 랭킹 등 모든 정보를 한눈에 확인하세요.
        </p>

        <SearchBar />

        {/* Quick links */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {POPULAR_CLASSES.slice(0, 8).map((cls) => (
            <span key={cls}
              className="px-3 py-1 rounded-full text-xs bg-[#13132a] border border-[#2a2a4a]
                text-[#8888aa] hover:text-white hover:border-[#ff6b2b] cursor-default transition-all">
              {cls}
            </span>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FeatureCard
          icon={<Sword size={22} className="text-[#ff6b2b]" />}
          title="캐릭터 정보"
          desc="레벨, 직업, 서버, 길드 등 기본 정보와 경험치 현황"
          color="border-[#ff6b2b]/30"
        />
        <FeatureCard
          icon={<Zap size={22} className="text-[#c878ff]" />}
          title="상세 스탯"
          desc="최종 스탯, 데미지, 보공, 방무 등 전투 능력치 분석"
          color="border-[#7c3aed]/30"
        />
        <FeatureCard
          icon={<Shield size={22} className="text-[#00dc64]" />}
          title="장비 정보"
          desc="스타포스, 잠재옵션, 에디셔널 등 장비 세부 내역"
          color="border-[#00dc64]/30"
        />
        <FeatureCard
          icon={<Trophy size={22} className="text-[#ffd700]" />}
          title="유니온 & 랭킹"
          desc="유니온 등급, 공격대 효과 및 서버별 전체 랭킹"
          color="border-[#ffd700]/30"
        />
      </section>

      {/* Server Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">서버 랭킹</h2>
          <Link href="/ranking"
            className="text-sm text-[#ff6b2b] hover:text-[#ff8c42] transition-colors">
            전체 랭킹 보기 →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {WORLDS.map((world) => (
            <Link key={world.name}
              href={`/ranking?world=${encodeURIComponent(world.name)}`}
              className="group flex flex-col items-center gap-2 p-4 rounded-xl
                bg-[#13132a] border border-[#2a2a4a]
                hover:border-[#ff6b2b]/50 hover:shadow-[0_0_15px_rgba(255,107,43,0.15)]
                transition-all duration-300">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${world.color}
                flex items-center justify-center text-white font-bold text-xs
                group-hover:scale-110 transition-transform`}>
                {world.name[0]}
              </div>
              <span className="text-xs text-[#8888aa] group-hover:text-white transition-colors">
                {world.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* API Notice */}
      <section className="p-4 rounded-xl bg-[#13132a] border border-[#2a2a4a]">
        <p className="text-xs text-[#4a4a7a] text-center">
          본 서비스는{" "}
          <span className="text-[#ff6b2b]">Nexon Open API</span>를 활용합니다.
          캐릭터 정보는 전날 기준으로 조회되며, API 키가 필요합니다.
        </p>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div className={`p-5 rounded-xl bg-[#13132a] border ${color} space-y-3
      hover:shadow-[0_0_20px_rgba(255,107,43,0.1)] transition-all duration-300`}>
      <div className="w-10 h-10 rounded-lg bg-[#0d0d1a] flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-xs text-[#8888aa] mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
