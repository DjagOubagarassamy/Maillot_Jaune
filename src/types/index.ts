/* Définitions TypeScript : interfaces Cyclist, Race, RaceResult et constantes de spécialités/types */
export interface Cyclist {
  id: string;
  name: string;
  team: string;
  nationality: string;
  birth_date: string;
  height: number;
  weight: number;
  photo_url: string | null;
  specialty: string;
  professional_since: number;
}

export interface Race {
  id: string;
  name: string;
  date: string;
  location: string;
  distance: number;
  race_type: string;
}

export interface RaceResult {
  id: string;
  race_id: string;
  cyclist_id: string;
  position: number;
  time: string | null;
  points: number | null;
}

export const CYCLIST_SPECIALTIES = [
  'Sprinter',
  'Climber',
  'Time Trialist',
  'All-Rounder',
  'Rouleur',
  'Puncheur',
] as const;

export const RACE_TYPES = [
  'One-Day Race',
  'Stage Race',
  'Time Trial',
  'Sprint',
  'Mountain Stage',
  'Criterium',
] as const;
