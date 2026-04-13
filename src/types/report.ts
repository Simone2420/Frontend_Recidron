import { WasteColors } from '../styles/colors';

export type WasteType = keyof typeof WasteColors;

export interface WasteReport {
  id?: number;
  category: WasteType;
  material: string;
  zone: string;
  exactPoint: string;
  size: string;
  photoTaken: number; // 0 or 1 for SQLite
  userId: string; // email of the user
  createdAt: string;
}
