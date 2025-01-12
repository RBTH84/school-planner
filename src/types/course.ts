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

export interface DatabaseCourse {
  id: string;
  user_id: string;
  title: string;
  start_time: string;
  end_time: string;
  day_of_week: number;
  materials: string[];
  week_type: string;
  created_at: string;
}