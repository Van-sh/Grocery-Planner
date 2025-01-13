import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { TDishes } from "./types";

type Props = {
  data: TDishes[];
};

export default function DishesCards({ data }: Props) {
  return (
    <>
      {data.map((dish) => (
        <Card className="mt-4">
          <CardHeader>
            <p className="text-lg">{dish.name}</p>
          </CardHeader>
          <Divider />
          <CardBody className="flex-row justify-between">
            <div>
              <p className="text-default-400">Updated By</p>
              <p>{dish.updatedBy.name}</p>
            </div>
            <div>
              <p className="text-default-400">Ingredients available?</p>
              <p>{dish.ingredients.length > 0 ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-default-400">Recipe available?</p>
              <p>{dish.recipe ? "Yes" : "No"}</p>
            </div>
          </CardBody>
        </Card>
      ))}
    </>
  );
}
