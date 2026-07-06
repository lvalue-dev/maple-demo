"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Home, Swords } from "lucide-react";

const LINKS = [
  { href: "/", icon: <Home size={15} />, label: "홈" },
  { href: "/ranking", icon: <Trophy size={15} />, label: "랭킹" },
  { href: "/compare", icon: <Swords size={15} />, label: "비교" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[#2a2a4a] bg-[#0d0d1a]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ff6b2b] to-[#7c3aed] flex items-center justify-center
            shadow-[0_0_10px_rgba(255,107,43,0.4)] group-hover:shadow-[0_0_15px_rgba(255,107,43,0.6)]
            group-hover:scale-105 transition-all duration-200">
            <span className="text-white font-black text-xs">M</span>
          </div>
          <span className="font-bold text-white text-sm group-hover:text-[#ff6b2b] transition-colors">
            MapleInfo
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              active={link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link href={href}
      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200
        ${active ? "text-white bg-[#13132a]" : "text-[#8888aa] hover:text-white hover:bg-[#13132a]/60"}`}>
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {active && (
        <span className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-1 h-1 rounded-full bg-[#ff6b2b]" />
      )}
    </Link>
  );
}
