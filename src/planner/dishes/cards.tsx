import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from "@heroui/react";
import DeleteIcon from "../../assets/deleteIcon";
import EditIcon from "../../assets/editIcon";
import EyeIcon from "../../assets/eyeIcon";
import type { TDishes } from "./types";

type Props = {
  data: TDishes[];
  onDetails: (data: TDishes) => void;
  onEdit: (data: TDishes) => void;
  onDelete: (id: string) => void;
};

export default function DishesCards({ data, onDetails, onEdit, onDelete }: Props) {
  return (
    <>
      {data.map((dish) => (
        <Card className="mt-4" key={dish._id}>
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
          <Divider />
          <CardFooter className="justify-between">
            <Button variant="light" onPress={() => onDetails(dish)}>
              <EyeIcon />
              Details
            </Button>
            <Button variant="light" onPress={() => onEdit(dish)}>
              <EditIcon />
              Edit
            </Button>
            <Divider orientation="vertical" />
            <Button variant="light" color="danger" onPress={() => onDelete(dish._id)}>
              <DeleteIcon />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
