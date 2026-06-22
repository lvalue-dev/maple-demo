import { NextRequest, NextResponse } from "next/server";
import { getCharacterStat } from "@/lib/maple-api";

export async function GET(req: NextRequest) {
  const ocid = req.nextUrl.searchParams.get("ocid");
  const date = req.nextUrl.searchParams.get("date") ?? undefined;
  if (!ocid) return NextResponse.json({ error: "ocid 파라미터가 필요합니다." }, { status: 400 });

  try {
    const data = await getCharacterStat(ocid, date);
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "알 수 없는 오류";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
