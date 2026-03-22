import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Divider } from "@nextui-org/react";
import MealCards from "../../../common/mealCards";
import { TDays } from "../../../common/types";
import { days } from "../../../constants";

type Props = {
  openCreatePlanModal: (days: TDays) => void;
};

export default function DesktopView({ openCreatePlanModal }: Props) {
  return (
    <div className="mt-10 flex gap-1 h-[calc(100vh-11.5rem)]">
      {days.map((day) => (
        <div
          className="flex flex-col items-start w-full border border-slate-300 rounded-lg overflow-hidden shadow-medium pt-2"
          key={day}
        >
          <div className="w-full pb-2 px-2 text-sm">{day}</div>
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
          <Divider className="mt-2" />
          <div className="w-full overflow-y-auto p-2">
          <MealCards day={day} />
          </div>
        </div>
      ))}
    </div>
  );
}
