import { NextRequest, NextResponse } from "next/server";
import { getOverallRanking } from "@/lib/maple-api";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  try {
    const data = await getOverallRanking({
      date: params.get("date") ?? undefined,
      world_name: params.get("world_name") ?? undefined,
      world_type: params.get("world_type") ?? undefined,
      class: params.get("class") ?? undefined,
      ocid: params.get("ocid") ?? undefined,
      page: params.get("page") ? Number(params.get("page")) : undefined,
    });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "알 수 없는 오류";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
