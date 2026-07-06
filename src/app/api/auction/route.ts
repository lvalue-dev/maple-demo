import { NextRequest, NextResponse } from "next/server";
import { getAuctionItem } from "@/lib/maple-api";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const itemName = params.get("item_name");
  if (!itemName) return NextResponse.json({ error: "item_name 파라미터가 필요합니다." }, { status: 400 });

  try {
    const data = await getAuctionItem({
      item_name: itemName,
      item_upgrade_number: params.get("item_upgrade_number") ?? undefined,
      item_option_value_first: params.get("item_option_value_first") ?? undefined,
      item_option_value_second: params.get("item_option_value_second") ?? undefined,
      item_option_type: params.get("item_option_type") ?? undefined,
    });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "알 수 없는 오류";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
