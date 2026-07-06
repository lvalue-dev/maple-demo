import { Gavel } from "lucide-react";
import AuctionSearch from "@/components/AuctionSearch";

export default function AuctionPage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
          bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-sm font-medium">
          <Gavel size={14} />
          실시간 경매장 시세
        </div>
        <h1 className="text-3xl font-black text-white">옥션 시세 조회</h1>
        <p className="text-[#8888aa] max-w-md mx-auto text-sm">
          아이템 이름을 검색해 현재 경매장에 등록된 매물과 즉시 구매가를 확인하세요.
        </p>
      </div>

      <AuctionSearch />
    </div>
  );
}
