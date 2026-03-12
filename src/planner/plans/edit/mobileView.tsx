import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import PlusIcon from "../../../assets/plus";
import { days } from "./constants";
import MealCards from "./mealCards";
import { TDays } from "./types";

type Props = {
  openCreatePlanModal: (days: TDays) => void;
};

export default function MobileView({ openCreatePlanModal }: Props) {
  return (
    <Accordion
      isCompact
      selectionMode="multiple"
      variant="splitted"
      className="px-0 py-10"
      defaultExpandedKeys={days}
    >
      {days.map((day) => (
        <AccordionItem key={day} title={day}>
          <MealCards day={day} />
          <Button
            variant="flat"
            color="primary"
            fullWidth
            startContent={<PlusIcon />}
            onClick={() => openCreatePlanModal(day)}
          >
            Add Meal
          </Button>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
