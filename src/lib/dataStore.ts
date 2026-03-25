import type { Cyclist, Race, RaceResult } from '../types';
import initialCyclists from '../data/cyclists.json';
import initialRaces from '../data/races.json';
import initialRaceResults from '../data/raceResults.json';

const STORAGE_KEYS = {
  cyclists: 'cycling_data_cyclists',
  races: 'cycling_data_races',
  raceResults: 'cycling_data_race_results',
} as const;

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// --- Cyclists ---

export function getCyclists(): Cyclist[] {
  return loadFromStorage<Cyclist>(STORAGE_KEYS.cyclists, initialCyclists as Cyclist[]);
}

export function getCyclistById(id: string): Cyclist | undefined {
  return getCyclists().find(c => c.id === id);
}

export function addCyclist(data: Omit<Cyclist, 'id'>): Cyclist {
  const cyclists = getCyclists();
  const newCyclist: Cyclist = { ...data, id: generateId() };
  cyclists.push(newCyclist);
  saveToStorage(STORAGE_KEYS.cyclists, cyclists);
  return newCyclist;
}

export function deleteCyclist(id: string): boolean {
  const cyclists = getCyclists();
  const filtered = cyclists.filter(c => c.id !== id);
  if (filtered.length === cyclists.length) return false;
  saveToStorage(STORAGE_KEYS.cyclists, filtered);
  // Also remove associated race results
  const results = getRaceResults().filter(r => r.cyclist_id !== id);
  saveToStorage(STORAGE_KEYS.raceResults, results);
  return true;
}

// --- Races ---

export function getRaces(): Race[] {
  return loadFromStorage<Race>(STORAGE_KEYS.races, initialRaces as Race[]);
}

export function getRaceById(id: string): Race | undefined {
  return getRaces().find(r => r.id === id);
}

export function addRace(data: Omit<Race, 'id'>): Race {
  const races = getRaces();
  const newRace: Race = { ...data, id: generateId() };
  races.push(newRace);
  saveToStorage(STORAGE_KEYS.races, races);
  return newRace;
}

export function deleteRace(id: string): boolean {
  const races = getRaces();
  const filtered = races.filter(r => r.id !== id);
  if (filtered.length === races.length) return false;
  saveToStorage(STORAGE_KEYS.races, filtered);
  // Also remove associated race results
  const results = getRaceResults().filter(r => r.race_id !== id);
  saveToStorage(STORAGE_KEYS.raceResults, results);
  return true;
}

// --- Race Results ---

export function getRaceResults(): RaceResult[] {
  return loadFromStorage<RaceResult>(STORAGE_KEYS.raceResults, initialRaceResults as RaceResult[]);
}

export function getRaceResultsByRace(raceId: string): RaceResult[] {
  return getRaceResults()
    .filter(r => r.race_id === raceId)
    .sort((a, b) => a.position - b.position);
}

export function getRaceResultsByCyclist(cyclistId: string): RaceResult[] {
  return getRaceResults().filter(r => r.cyclist_id === cyclistId);
}

export function addRaceResult(data: Omit<RaceResult, 'id'>): RaceResult {
  const results = getRaceResults();
  const newResult: RaceResult = { ...data, id: generateId() };
  results.push(newResult);
  saveToStorage(STORAGE_KEYS.raceResults, results);
  return newResult;
}

export function deleteRaceResult(id: string): boolean {
  const results = getRaceResults();
  const filtered = results.filter(r => r.id !== id);
  if (filtered.length === results.length) return false;
  saveToStorage(STORAGE_KEYS.raceResults, filtered);
  return true;
}
