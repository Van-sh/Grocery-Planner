import { type TPreparation } from "./types";

export function preparationToString(preparation: TPreparation): string {
    function shortenTimeUnits(unit: string): string {
      switch (unit) {
        case "days":
          return "d";
        case "minutes":
          return "min";
        case "hours":
          return "h";
        default:
          return unit;
      }
    }
    return (
      preparation.category + ":" + preparation.timeAmount + shortenTimeUnits(preparation.timeUnits)
    );
  }