import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { EMealType } from "../../constants";
import { TDays } from "../types";
import { useData } from "./context";
import { getSortedMeals } from "./helper";

type Props = {
  day: TDays;
};

/**
 * While using MealCards, pass meal data in context
 */
export default function MealCards({ day }: Props) {
  const { data } = useData();
  const { meals = {} } = data;
  const dayMeals = getSortedMeals(meals[day] || []);

  return (
    <>
      {dayMeals.map(({ mealType, dishes }) => (
        <Card className="mb-2 w-full" key={mealType}>
          <CardHeader className="bg-secondary/10">
            <p className="text-sm text-secondary">{EMealType[mealType]}</p>
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
