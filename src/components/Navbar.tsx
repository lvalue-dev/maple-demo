import Link from "next/link";
import { Trophy, Home } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[#2a2a4a] bg-[#0d0d1a]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ff6b2b] to-[#7c3aed] flex items-center justify-center
            shadow-[0_0_10px_rgba(255,107,43,0.4)] group-hover:shadow-[0_0_15px_rgba(255,107,43,0.6)] transition-all">
            <span className="text-white font-black text-xs">M</span>
          </div>
          <span className="font-bold text-white text-sm group-hover:text-[#ff6b2b] transition-colors">
            MapleInfo
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <NavLink href="/" icon={<Home size={15} />} label="홈" />
          <NavLink href="/ranking" icon={<Trophy size={15} />} label="랭킹" />
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[#8888aa]
        hover:text-white hover:bg-[#13132a] transition-all duration-200">
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
