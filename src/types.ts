export interface Activity {
  time: string;
  activity: string;
  description: string;
  icon?: string;
  duration?: string;
}

export interface DayPlan {
  day: number;
  date?: string;
  title: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
}

export interface TripPlan {
  destination: string;
  duration: number;
  budget: string;
  travelStyle: string;
  groupType: string;
  interests: string[];
  itinerary: DayPlan[];
  totalEstimatedCost: string;
  vibeSummary: string;
  routeLogic: string;
}

export interface Message {
  role: "user" | "model" | "system";
  content: string;
  timestamp: string;
}
