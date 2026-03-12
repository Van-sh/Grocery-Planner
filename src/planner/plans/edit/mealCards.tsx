import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { mealTypeMap } from "./constants";
import { useData } from "./context";
import { getSortedMeals } from "./helper";
import { TDays } from "./types";

type Props = {
  day: TDays;
};

export default function MealCards({ day }: Props) {
  const { data } = useData();
  const { meals = {} } = data;
  const dayMeals = getSortedMeals(meals[day] || []);

  return (
    <>
      {dayMeals.map(({ mealType, dishes }) => (
        <Card className="mb-2 w-full" key={mealType}>
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
    </>
  );
}
