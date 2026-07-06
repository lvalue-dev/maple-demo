"use client";

import { useState, FormEvent } from "react";
import { Search, Loader2, Gavel } from "lucide-react";
import type { AuctionItem, AuctionItemResponse } from "@/types/maple";

export default function AuctionSearch() {
  const [itemName, setItemName] = useState("");
  const [items, setItems] = useState<AuctionItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const name = itemName.trim();
    if (!name) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/auction?item_name=${encodeURIComponent(name)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "조회에 실패했습니다.");
      setItems((data as AuctionItemResponse).auction_item ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
      setItems(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-[#ff6b2b]">
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
          </div>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="아이템 이름을 입력하세요..."
            className="w-full pl-12 pr-32 py-4 rounded-xl text-lg
              bg-[#13132a] border border-[#2a2a4a] text-white
              placeholder-[#4a4a7a]
              focus:outline-none focus:border-[#ff6b2b] focus:shadow-[0_0_20px_rgba(255,107,43,0.3)]
              transition-all duration-300"
            disabled={loading}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="submit"
            disabled={loading || !itemName.trim()}
            className="absolute right-2 px-6 py-2.5 rounded-lg font-semibold text-sm
              bg-gradient-to-r from-[#ff6b2b] to-[#ff8c42]
              hover:from-[#ff8c42] hover:to-[#ffa052]
              disabled:opacity-40 disabled:cursor-not-allowed
              text-white transition-all duration-200
              shadow-[0_0_15px_rgba(255,107,43,0.3)]"
          >
            검색
          </button>
        </div>
      </form>

      {error && (
        <div className="p-6 text-center rounded-xl bg-[#13132a] border border-[#2a2a4a]">
          <p className="text-[#ff4444] text-sm">{error}</p>
        </div>
      )}

      {items !== null && !error && (
        <div className="rounded-xl border border-[#2a2a4a] bg-[#13132a] overflow-hidden">
          {items.length === 0 ? (
            <div className="py-16 text-center text-[#4a4a7a] flex flex-col items-center gap-2">
              <Gavel size={28} className="text-[#2a2a4a]" />
              <span>현재 경매장에 등록된 매물이 없습니다.</span>
            </div>
          ) : (
            <div className="divide-y divide-[#2a2a4a]">
              {items.map((item, i) => (
                <AuctionRow key={i} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AuctionRow({ item }: { item: AuctionItem }) {
  const expire = new Date(item.date_auction_expire);
  return (
    <div className="flex items-center gap-4 px-5 py-3.5">
      {item.item_icon && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.item_icon} alt={item.item_name} className="w-10 h-10 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white text-sm truncate">{item.item_name}</div>
        {item.item_option?.length > 0 && (
          <div className="text-xs text-[#8888aa] truncate">
            {item.item_option.map((o) => `${o.option_type} ${o.option_value}`).join(" · ")}
          </div>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-bold text-[#ffd700] text-sm">
          {item.reserve_price.toLocaleString()} 메소
        </div>
        <div className="text-[10px] text-[#4a4a7a]">
          {expire.toLocaleDateString("ko-KR")} 만료
        </div>
      </div>
    </div>
  );
}
