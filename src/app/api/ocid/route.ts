import { NextRequest, NextResponse } from "next/server";
import { getOcid } from "@/lib/maple-api";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("character_name");
  if (!name) return NextResponse.json({ error: "character_name 파라미터가 필요합니다." }, { status: 400 });

  try {
    const data = await getOcid(name);
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "알 수 없는 오류";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
