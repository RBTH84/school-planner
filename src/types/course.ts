export type WeekType = "both" | "A" | "B";

export interface Course {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  materials: string[];
  weekType: WeekType;
}