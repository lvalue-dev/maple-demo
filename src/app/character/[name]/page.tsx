import { notFound } from "next/navigation";
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

interface CharacterPageData {
  basic?: unknown;
  stat?: unknown;
  equipment?: unknown;
  union?: unknown;
  unionRaider?: unknown;
  dojang?: unknown;
  ability?: unknown;
  error?: string;
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
    basic: basic.status === "fulfilled" ? basic.value : null,
    stat: stat.status === "fulfilled" ? stat.value : null,
    equipment: equipment.status === "fulfilled" ? equipment.value : null,
    union: union.status === "fulfilled" ? union.value : null,
    unionRaider: unionRaider.status === "fulfilled" ? unionRaider.value : null,
    dojang: dojang.status === "fulfilled" ? dojang.value : null,
    ability: ability.status === "fulfilled" ? ability.value : null,
  };
}

export default async function CharacterPage({ params }: PageProps) {
  const { name } = await params;
  const charName = decodeURIComponent(name);

  const data = await fetchCharacterData(charName);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <SearchBar defaultValue={charName} />

      {data.error ? (
        <ErrorCard message={data.error} />
      ) : !data.basic ? (
        <ErrorCard message="캐릭터 기본 정보를 불러올 수 없습니다." />
      ) : (
        <>
          {/* Basic Info */}
          <CharacterBasicCard data={data.basic as Parameters<typeof CharacterBasicCard>[0]["data"]} />

          {/* Tabs with all info */}
          <CharacterTabs
            stat={data.stat}
            equipment={data.equipment}
            union={data.union}
            unionRaider={data.unionRaider}
            dojang={data.dojang}
            ability={data.ability}
          />
        </>
      )}
    </div>
  );
}
