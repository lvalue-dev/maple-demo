const BASE_URL = "https://open.api.nexon.com";

function getApiKey(): string {
  const key = process.env.API_KEY;
  if (!key) throw new Error("API_KEY 환경 변수가 설정되지 않았습니다.");
  return key;
}

// Yesterday's date in KST (UTC+9) — Nexon API uses KST timezone
export function getApiDate(): string {
  const now = new Date();
  // Shift to KST
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  // Yesterday in KST
  kst.setUTCDate(kst.getUTCDate() - 1);
  return kst.toISOString().slice(0, 10);
}

async function mapleGet<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      "x-nxopen-api-key": getApiKey(),
      "accept": "application/json",
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(error?.error?.message || `API 오류: ${res.status}`);
  }

  return res.json();
}

export async function getOcid(characterName: string): Promise<{ ocid: string }> {
  return mapleGet("/maplestory/v1/id", { character_name: characterName });
}

export async function getCharacterBasic(ocid: string, date?: string) {
  return mapleGet("/maplestory/v1/character/basic", { ocid, date: date || getApiDate() });
}

export async function getCharacterStat(ocid: string, date?: string) {
  return mapleGet("/maplestory/v1/character/stat", { ocid, date: date || getApiDate() });
}

export async function getCharacterEquipment(ocid: string, date?: string) {
  return mapleGet("/maplestory/v1/character/item-equipment", { ocid, date: date || getApiDate() });
}

export async function getCharacterUnion(ocid: string, date?: string) {
  return mapleGet("/maplestory/v1/character/union", { ocid, date: date || getApiDate() });
}

export async function getCharacterUnionRaider(ocid: string, date?: string) {
  return mapleGet("/maplestory/v1/character/union-raider", { ocid, date: date || getApiDate() });
}

export async function getCharacterHyperStat(ocid: string, date?: string) {
  return mapleGet("/maplestory/v1/character/hyper-stat", { ocid, date: date || getApiDate() });
}

export async function getCharacterAbility(ocid: string, date?: string) {
  return mapleGet("/maplestory/v1/character/ability", { ocid, date: date || getApiDate() });
}

export async function getCharacterBeautyEquipment(ocid: string, date?: string) {
  return mapleGet("/maplestory/v1/character/beauty-equipment", { ocid, date: date || getApiDate() });
}

export async function getCharacterCashEquipment(ocid: string, date?: string) {
  return mapleGet("/maplestory/v1/character/cashitem-equipment", { ocid, date: date || getApiDate() });
}

export async function getCharacterSkill(ocid: string, skillGrade: string, date?: string) {
  return mapleGet("/maplestory/v1/character/skill", {
    ocid,
    date: date || getApiDate(),
    character_skill_grade: skillGrade,
  });
}

export async function getCharacterLinkSkill(ocid: string, date?: string) {
  return mapleGet("/maplestory/v1/character/link-skill", { ocid, date: date || getApiDate() });
}

export async function getCharacterVMatrix(ocid: string, date?: string) {
  return mapleGet("/maplestory/v1/character/vmatrix", { ocid, date: date || getApiDate() });
}

export async function getCharacterHexaMatrix(ocid: string, date?: string) {
  return mapleGet("/maplestory/v1/character/hexamatrix", { ocid, date: date || getApiDate() });
}

export async function getCharacterHexaMatrixStat(ocid: string, date?: string) {
  return mapleGet("/maplestory/v1/character/hexamatrix-stat", { ocid, date: date || getApiDate() });
}

export async function getCharacterDojang(ocid: string, date?: string) {
  return mapleGet("/maplestory/v1/character/dojang", { ocid, date: date || getApiDate() });
}

export async function getCharacterSetEffect(ocid: string, date?: string) {
  return mapleGet("/maplestory/v1/character/set-effect", { ocid, date: date || getApiDate() });
}

export async function getOverallRanking(params: {
  date?: string;
  world_name?: string;
  world_type?: string;
  class?: string;
  ocid?: string;
  page?: number;
}) {
  const p: Record<string, string> = { date: params.date || getApiDate() };
  if (params.world_name) p.world_name = params.world_name;
  if (params.world_type) p.world_type = params.world_type;
  if (params.class) p.class = params.class;
  if (params.ocid) p.ocid = params.ocid;
  if (params.page) p.page = String(params.page);
  return mapleGet("/maplestory/v1/ranking/overall", p);
}

export async function getUnionRanking(params: {
  date?: string;
  world_name?: string;
  ocid?: string;
  page?: number;
}) {
  const p: Record<string, string> = { date: params.date || getApiDate() };
  if (params.world_name) p.world_name = params.world_name;
  if (params.ocid) p.ocid = params.ocid;
  if (params.page) p.page = String(params.page);
  return mapleGet("/maplestory/v1/ranking/union", p);
}
