import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import PlusIcon from "../../../assets/plus";
import MealCards from "../../../common/mealCards";
import { MealTypeKey, TDays, TMealDishBase } from "../../../common/types";
import { days } from "../../../constants";

type Props = {
  openCreatePlanModal: (days: TDays) => void;
  openEditPlanModal: (day: TDays, mealType: MealTypeKey, dishes: TMealDishBase[]) => void;
};

export default function MobileView({ openCreatePlanModal, openEditPlanModal }: Props) {
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
          <MealCards day={day} isEditable onEdit={openEditPlanModal} />
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
