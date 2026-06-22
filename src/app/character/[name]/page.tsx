import {
  getOcid,
  getCharacterBasic,
  getCharacterStat,
  getCharacterEquipment,
  getCharacterUnion,
  getCharacterUnionRaider,
  getCharacterDojang,
  getCharacterAbility,
} from "@/lib/maple-api";
import CharacterBasicCard from "@/components/CharacterBasic";
import CharacterTabs from "@/components/CharacterTabs";
import SearchBar from "@/components/SearchBar";
import { ErrorCard } from "@/components/LoadingSpinner";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  const charName = decodeURIComponent(name);
  return {
    title: `${charName} - MapleInfo`,
    description: `${charName} 캐릭터의 스탯, 장비, 유니온 정보를 확인하세요.`,
  };
}

export interface SlotResult {
  data: unknown;
  error: string | null;
}

interface CharacterPageData {
  error?: string;
  basic?: SlotResult;
  stat?: SlotResult;
  equipment?: SlotResult;
  union?: SlotResult;
  unionRaider?: SlotResult;
  dojang?: SlotResult;
  ability?: SlotResult;
}

function extract(r: PromiseSettledResult<unknown>): SlotResult {
  if (r.status === "fulfilled") return { data: r.value, error: null };
  const msg = r.reason instanceof Error ? r.reason.message : "알 수 없는 오류";
  return { data: null, error: msg };
}

async function fetchCharacterData(name: string): Promise<CharacterPageData> {
  let ocid: string;
  try {
    const ocidRes = await getOcid(name);
    ocid = ocidRes.ocid;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "캐릭터를 찾을 수 없습니다." };
  }

  const results = await Promise.allSettled([
    getCharacterBasic(ocid),
    getCharacterStat(ocid),
    getCharacterEquipment(ocid),
    getCharacterUnion(ocid),
    getCharacterUnionRaider(ocid),
    getCharacterDojang(ocid),
    getCharacterAbility(ocid),
  ]);

  const [basic, stat, equipment, union, unionRaider, dojang, ability] = results;

  return {
    basic: extract(basic),
    stat: extract(stat),
    equipment: extract(equipment),
    union: extract(union),
    unionRaider: extract(unionRaider),
    dojang: extract(dojang),
    ability: extract(ability),
  };
}

export default async function CharacterPage({ params }: PageProps) {
  const { name } = await params;
  const charName = decodeURIComponent(name);

  const data = await fetchCharacterData(charName);

  return (
    <div className="space-y-6">
      <SearchBar defaultValue={charName} />

      {data.error ? (
        <ErrorCard message={data.error} />
      ) : !data.basic?.data ? (
        <ErrorCard message={data.basic?.error ?? "캐릭터 기본 정보를 불러올 수 없습니다."} />
      ) : (
        <>
          <CharacterBasicCard data={data.basic.data as Parameters<typeof CharacterBasicCard>[0]["data"]} />
          <CharacterTabs
            stat={data.stat!}
            equipment={data.equipment!}
            union={data.union!}
            unionRaider={data.unionRaider!}
            dojang={data.dojang!}
            ability={data.ability!}
          />
        </>
      )}
    </div>
  );
}
