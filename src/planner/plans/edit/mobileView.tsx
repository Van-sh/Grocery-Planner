import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import PlusIcon from "../../../assets/plus";
import { TPlans } from "../types";
import { days, mealTypeMap } from "./constants";
import { getSortedMeals } from "./helper";
import { TDays } from "./types";

type Props = {
  data: TPlans;
  openCreatePlanModal: (days: TDays) => void;
};

export default function MobileView({ data: { meals = {} }, openCreatePlanModal }: Props) {
  return (
    <Accordion
      isCompact
      selectionMode="multiple"
      variant="splitted"
      className="px-0 py-10"
      defaultExpandedKeys={days}
    >
      {days.map((day) => {
        const dayMeals = getSortedMeals(meals[day] || []);

        return (
          <AccordionItem key={day} title={day}>
            {dayMeals.map(({ mealType, dishes }) => (
              <Card className="mb-2" key={mealType}>
                <CardHeader className="bg-secondary/10">
                  <p className="text-sm text-secondary">{mealTypeMap[mealType]}</p>
                </CardHeader>
                <Divider />
                <CardBody>
                  {dishes.map(({ dish }) => (
                    <p>{dish.name}</p>
                  ))}
                </CardBody>
              </Card>
            ))}
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
        );
      })}
    </Accordion>
  );
}
