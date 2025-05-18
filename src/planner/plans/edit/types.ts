export enum EMealType {
  "wakeup" = "Wake Up",
  "breakfast" = "Breakfast",
  "midmorning" = "Mid Morning",
  "lunch" = "Lunch",
  "midafternoon" = "Mid Afternoon Snack",
  "dinner" = "Dinner",
  "bedtime" = "Bed Time",
}

export type TMeal = {
  mealType: EMealType | string;
  name: string;
}
