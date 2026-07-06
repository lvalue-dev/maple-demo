export interface CharacterBasic {
  date: string;
  character_name: string;
  world_name: string;
  character_gender: string;
  character_class: string;
  character_class_level: string;
  character_level: number;
  character_exp: number;
  character_exp_rate: string;
  character_guild_name: string;
  character_image: string;
  character_date_create: string;
  access_flag: string;
  liberation_quest_clear_flag: string;
}

export interface StatInfo {
  stat_name: string;
  stat_value: string | null;
}

export interface CharacterStat {
  date: string;
  character_class: string;
  final_stat: StatInfo[];
  remain_ap: number;
}

export interface ItemOption {
  option_type: string;
  option_value: string;
}

export interface EquipmentItem {
  item_equipment_part: string;
  item_equipment_slot: string;
  item_name: string;
  item_icon: string;
  item_description: string | null;
  item_shape_name: string;
  item_shape_icon: string;
  item_gender: string | null;
  item_total_option: Record<string, string>;
  item_base_option: Record<string, string>;
  potential_option_grade: string | null;
  additional_potential_option_grade: string | null;
  potential_option_1: string | null;
  potential_option_2: string | null;
  potential_option_3: string | null;
  additional_potential_option_1: string | null;
  additional_potential_option_2: string | null;
  additional_potential_option_3: string | null;
  equipment_level_increase: number;
  item_exceptional_option: Record<string, string>;
  item_add_option: Record<string, string>;
  growth_exp: number;
  growth_level: number;
  scroll_upgrade: string;
  cuttable_count: string;
  golden_hammer_flag: string;
  scroll_resilience_count: string;
  scroll_upgradeable_count: string;
  soul_name: string | null;
  soul_option: string | null;
  item_etc_option: Record<string, string>;
  starforce: string;
  starforce_scroll_flag: string;
  item_starforce_option: Record<string, string>;
  special_ring_level: number;
  date_expire: string | null;
}

export interface CharacterEquipment {
  date: string;
  character_gender: string;
  character_class: string;
  preset_no: number;
  item_equipment: EquipmentItem[];
  item_equipment_preset1?: EquipmentItem[];
  item_equipment_preset2?: EquipmentItem[];
  item_equipment_preset3?: EquipmentItem[];
  title: {
    title_name: string;
    title_icon: string;
    title_description: string;
    date_expire: string | null;
    date_option_expire: string | null;
  } | null;
}

export interface UnionInfo {
  date: string;
  ouid: string;
  union_level: number;
  union_grade: string;
  union_artifact_level: number;
  union_artifact_exp: number;
  union_artifact_point: number;
}

export interface UnionBlock {
  block_type: string;
  block_class: string;
  block_level: string;
  block_control_point: { x: number; y: number };
  block_position: { x: number; y: number }[];
}

export interface UnionRaider {
  date: string;
  union_raider_stat: string[];
  union_occupied_stat: string[];
  union_inner_stat: { stat_field_id: string; stat_field_effect: string }[];
  union_block: UnionBlock[];
  use_preset_no: number;
  union_raider_preset1?: UnionRaider;
  union_raider_preset2?: UnionRaider;
  union_raider_preset3?: UnionRaider;
  union_raider_preset4?: UnionRaider;
  union_raider_preset5?: UnionRaider;
}

export interface RankingEntry {
  date: string;
  ranking: number;
  character_name: string;
  world_name: string;
  class_name: string;
  sub_class_name: string;
  character_level: number;
  character_exp: number;
  character_popularity: number;
  character_guildname: string;
}

export interface RankingResponse {
  ranking: RankingEntry[];
}

export type WorldName =
  | "스카니아"
  | "베라"
  | "루나"
  | "제니스"
  | "크로아"
  | "유니온"
  | "엘리시움"
  | "이노시스"
  | "레드"
  | "오로라"
  | "아케인"
  | "노바"
  | "리부트"
  | "리부트2"
  | "버닝"
  | "버닝2"
  | "버닝3";
