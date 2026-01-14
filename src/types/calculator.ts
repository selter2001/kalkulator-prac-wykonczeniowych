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

export interface WorkType {
  id: string;
  name: string;
  pricePerMeter: number;
  enabled: boolean;
}

export interface Room {
  id: string;
  name: string;
  walls: Wall[];
  windows: Window[];
  workTypes: WorkType[];
  totalWallArea: number;
  totalWindowArea: number;
  netArea: number;
}

export const defaultWorkTypes: Omit<WorkType, 'id'>[] = [
  { name: 'Malowanie 1x', pricePerMeter: 8, enabled: true },
  { name: 'Malowanie 2x', pricePerMeter: 15, enabled: false },
  { name: 'Gruntowanie', pricePerMeter: 5, enabled: true },
  { name: 'Szpachlowanie 1x', pricePerMeter: 20, enabled: false },
  { name: 'Szpachlowanie 2x', pricePerMeter: 35, enabled: false },
];
