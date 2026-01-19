export interface Wall {
  id: string;
  area: number;
}

export interface Ceiling {
  id: string;
  area: number;
}

export type WorkTypeUnit = 'm2' | 'mb' | 'szt';

export interface CustomItem {
  id: string;
  value: number;
}

export interface WorkType {
  id: string;
  name: string;
  pricePerMeter: number;
  enabled: boolean;
  unit: WorkTypeUnit;
  isCustom?: boolean;
  customItems?: CustomItem[];
}

export interface LinearItem {
  id: string;
  length: number;
}

export interface Room {
  id: string;
  name: string;
  walls: Wall[];
  ceilings: Ceiling[];
  workTypes: WorkType[];
  corners: LinearItem[];
  grooves: LinearItem[];
  acrylic: LinearItem[];
  floorProtection: number;
  totalWallArea: number;
  totalCeilingArea: number;
  totalCorners: number;
  totalGrooves: number;
  totalAcrylic: number;
  netArea: number;
}

export type VatRate = 8 | 23;

export const defaultWorkTypes: Omit<WorkType, 'id'>[] = [
  { name: 'Malowanie', pricePerMeter: 0, enabled: false, unit: 'm2' },
  { name: 'Gruntowanie', pricePerMeter: 0, enabled: false, unit: 'm2' },
  { name: 'Szpachlowanie', pricePerMeter: 0, enabled: false, unit: 'm2' },
  { name: 'Oklejanie (zabezpieczenie posadzki)', pricePerMeter: 0, enabled: false, unit: 'm2' },
  { name: 'Narożniki', pricePerMeter: 0, enabled: false, unit: 'mb' },
  { name: 'Zarzucanie bruzd', pricePerMeter: 0, enabled: false, unit: 'mb' },
  { name: 'Akrylowanie', pricePerMeter: 0, enabled: false, unit: 'mb' },
];
