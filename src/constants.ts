import { TUser } from "./common/types";

export const isDesktop = window.innerWidth > 640;
export const emojis = [
  "😕",
  "🫤",
  "😟",
  "🙁",
  "☹️",
  "😮",
  "😯",
  "😲",
  "😳",
  "🥺",
  "🥹",
  "😦",
  "😧",
  "😨",
  "😰",
  "😥",
  "😢",
  "😭",
  "😱",
  "😖",
  "😣",
  "😞",
  "😓",
  "😩",
  "😫",
];

export const defaultUser: TUser = { id: "", name: "", fName: "", lName: "" };

export const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export enum EMealType {
  "wakeup" = "Wake Up",
  "breakfast" = "Breakfast",
  "midmorning" = "Mid Morning",
  "lunch" = "Lunch",
  "midafternoon" = "Mid Afternoon Snack",
  "dinner" = "Dinner",
  "bedtime" = "Bed Time",
}

export const mealTypeMap: Record<keyof typeof EMealType, EMealType> = {
  wakeup: EMealType.wakeup,
  breakfast: EMealType.breakfast,
  midmorning: EMealType.midmorning,
  lunch: EMealType.lunch,
  midafternoon: EMealType.midafternoon,
  dinner: EMealType.dinner,
  bedtime: EMealType.bedtime,
};

// mealOrder = ["wakeup", "breakfast", "midmorning", ...] 
export const mealOrder = Object.keys(EMealType) as (keyof typeof EMealType)[];
