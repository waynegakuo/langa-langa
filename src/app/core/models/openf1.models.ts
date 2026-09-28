export interface Session {
  session_key: number;
  session_type: string;
  session_name: string;
  date_start: string;
  date_end: string;
  meeting_key: number;
  circuit_key: number;
  circuit_short_name: string;
  country_key: number;
  country_code: string;
  country_name: string;
  location: string;
  gmt_offset: string;
  year: number;
  is_cancelled: boolean;
}

export interface Meeting {
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  location: string;
  country_key: number;
  country_code: string;
  country_name: string;
  country_flag?: string;
  circuit_key: number;
  circuit_short_name: string;
  circuit_type: string;
  circuit_info_url?: string;
  circuit_image?: string;
  date_start: string;
  date_end: string;
  year: number;
}

export interface Driver {
  meeting_key: number;
  session_key: number;
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  first_name: string;
  last_name: string;
  headshot_url: string;
  country_code: string | null;
}

export interface SessionResult {
  session_key: number;
  meeting_key: number;
  driver_number: number;
  position: number | null;
  dnf: boolean;
  dns: boolean;
  dsq: boolean;
  duration: number;
  gap_to_leader: number;
  number_of_laps: number;
  points?: number;
}

export interface Location {
  date: string;
  session_key: number;
  meeting_key: number;
  driver_number: number;
  x: number;
  y: number;
  z: number;
}

export interface Lap {
  session_key: number;
  driver_number: number;
  lap_number: number;
  lap_duration: number | null;
  duration_sector_1: number | null;
  duration_sector_2: number | null;
  duration_sector_3: number | null;
  is_pit_out_lap: boolean;
  date_start: string;
}

export interface DriverChampionshipEntry {
  session_key: number;
  driver_number: number;
  position_current: number;
  position_start: number;
  points_current: number;
  points_start: number;
  meeting_key: number;
}

export type OpenF1QueryParams = Record<string, string | number | boolean | undefined>;
