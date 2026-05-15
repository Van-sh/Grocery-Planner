import { Card, CardBody, CardHeader, Divider, Tooltip } from "@heroui/react";
import DeleteIcon from "../../assets/deleteIcon";
import EditIcon from "../../assets/editIcon";
import { EMealType } from "../../constants";
import { MealTypeKey, TDays, TMealDishBase } from "../types";
import { useData } from "./context";
import { getSortedMeals } from "./helper";

type Props = {
  day: TDays;
  onEdit?: (day: TDays, mealType: MealTypeKey, dishes: TMealDishBase[]) => void;
  onDelete?: (day: TDays, mealType: MealTypeKey) => void;
};

/**
 * While using MealCards, pass meal data in context
 */
export default function MealCards({ day, onEdit, onDelete }: Props) {
  const { data } = useData();
  const { meals = {} } = data;
  const dayMeals = getSortedMeals(meals[day] || []);

  return (
    <>
      {dayMeals.map(({ mealType, dishes }) => (
        <Card className="mb-2" key={mealType}>
          <CardHeader className="bg-secondary/10 justify-between">
            <p className="text-sm text-secondary">{EMealType[mealType]}</p>
            {(onEdit || onDelete) && (
              <div className="flex">
                {onEdit && (
                  <Tooltip content="Edit">
                    <button
                      type="button"
                      aria-label={`Edit ${EMealType[mealType]} meal`}
                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                      onClick={() => onEdit(day, mealType, dishes)}
                    >
                      <EditIcon />
                    </button>
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip content="Delete">
                    <button
                      type="button"
                      aria-label={`Delete ${EMealType[mealType]} meal`}
                      className="text-lg text-danger cursor-pointer active:opacity-50"
                      onClick={() => onDelete(day, mealType)}
                    >
                      <DeleteIcon />
                    </button>
                  </Tooltip>
                )}
              </div>
            )}
          </CardHeader>
          <Divider />
          <CardBody>
            <ul className="list-disc ps-4">
              {dishes.map(({ dish }) => (
                <li key={dish.name}>{dish.name}</li>
              ))}
            </ul>
          </CardBody>
        </Card>
      ))}
    </>
  );
}
