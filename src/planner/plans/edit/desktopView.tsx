import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/react";
import { days } from "./constants";
import { TDays } from "./types";

type Props = {
  openCreatePlanModal: (days: TDays) => void;
};

export default function DesktopView({ openCreatePlanModal }: Props) {
  return (
    <div className="mt-10 flex gap-1 h-[calc(100vh-11.5rem)]">
      {days.map((day) => (
        <div
          className="flex flex-col items-start w-full border border-slate-300 rounded-lg overflow-hidden shadow-medium p-2"
          key={day}
        >
          <div className="w-full pb-2 text-sm">{day}</div>
          <div className="grow">Meals here</div>
          <div className="bg-white">
            <Button
              variant="light"
              size="sm"
              color="primary"
              fullWidth
              startContent={<FontAwesomeIcon icon={faPlus} />}
              onClick={() => openCreatePlanModal(day)}
            >
              Add Meal
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
