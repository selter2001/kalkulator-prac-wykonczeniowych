export interface Wall {
  id: string;
  width: number;
  height: number;
  area: number;
}

export interface Window {
  id: string;
  width: number;
  height: number;
  area: number;
}

export type WorkTypeUnit = 'm2' | 'mb';

export interface WorkType {
  id: string;
  name: string;
  pricePerMeter: number;
  enabled: boolean;
  unit: WorkTypeUnit;
}

export interface LinearItem {
  id: string;
  length: number;
}

export interface Room {
  id: string;
  name: string;
  walls: Wall[];
  windows: Window[];
  workTypes: WorkType[];
  corners: LinearItem[];
  grooves: LinearItem[];
  acrylic: LinearItem[];
  floorProtection: number; // m² dla oklejania posadzki
  totalWallArea: number;
  totalWindowArea: number;
  totalCorners: number;
  totalGrooves: number;
  totalAcrylic: number;
  netArea: number;
}

export const defaultWorkTypes: Omit<WorkType, 'id'>[] = [
  { name: 'Malowanie 1x', pricePerMeter: 8, enabled: true, unit: 'm2' },
  { name: 'Malowanie 2x', pricePerMeter: 15, enabled: false, unit: 'm2' },
  { name: 'Gruntowanie', pricePerMeter: 5, enabled: true, unit: 'm2' },
  { name: 'Szpachlowanie 1x', pricePerMeter: 20, enabled: false, unit: 'm2' },
  { name: 'Szpachlowanie 2x', pricePerMeter: 35, enabled: false, unit: 'm2' },
  { name: 'Oklejanie (zabezpieczenie posadzki)', pricePerMeter: 4, enabled: false, unit: 'm2' },
  { name: 'Narożniki', pricePerMeter: 12, enabled: false, unit: 'mb' },
  { name: 'Zarzucanie bruzd', pricePerMeter: 15, enabled: false, unit: 'mb' },
  { name: 'Akrylowanie', pricePerMeter: 8, enabled: false, unit: 'mb' },
];
