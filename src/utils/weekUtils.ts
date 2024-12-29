import { startOfWeek, getWeek } from "date-fns";

export const getCurrentWeekType = (date: Date = new Date()): "A" | "B" => {
  const weekNumber = getWeek(startOfWeek(date));
  return weekNumber % 2 === 0 ? "A" : "B";
};

export const shouldShowCourse = (courseWeekType: "both" | "A" | "B", currentWeekType: "A" | "B"): boolean => {
  return courseWeekType === "both" || courseWeekType === currentWeekType;
};