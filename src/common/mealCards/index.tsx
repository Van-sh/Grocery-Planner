import { Card, CardBody, CardHeader, Divider, Tooltip } from "@nextui-org/react";
import EditIcon from "../../assets/editIcon";
import { EMealType } from "../../constants";
import { MealTypeKey, TDays, TMealDishBase } from "../types";
import { useData } from "./context";
import { getSortedMeals } from "./helper";

type BaseProps = {
  day: TDays;
};

type EditableProps = {
  isEditable: true;
  onEdit: (day: TDays, mealType: MealTypeKey, dishes: TMealDishBase[]) => void;
};

type NonEditableProps = {
  isEditable?: false;
  onEdit?: never;
};

type Props = BaseProps & (EditableProps | NonEditableProps);

/**
 * While using MealCards, pass meal data in context
 */
export default function MealCards({ day, isEditable = false, onEdit }: Props) {
  const { data } = useData();
  const { meals = {} } = data;
  const dayMeals = getSortedMeals(meals[day] || []);

  return (
    <>
      {dayMeals.map(({ mealType, dishes }) => (
        <Card className="mb-2" key={mealType}>
          <CardHeader className="bg-secondary/10 justify-between">
            <p className="text-sm text-secondary">{EMealType[mealType]}</p>
            {isEditable && (
              <Tooltip content="Edit">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => onEdit!(day, mealType, dishes)}
                >
                  <EditIcon />
                </span>
              </Tooltip>
            )}
          </CardHeader>
          <Divider />
          <CardBody>
            {dishes.map(({ dish }) => (
              <p key={dish.name}>{dish.name}</p>
            ))}
          </CardBody>
        </Card>
      ))}
    </>
  );
}
