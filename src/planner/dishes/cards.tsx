import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { TDishes } from "./types";
import EditIcon from "../../assets/editIcon";
import DeleteIcon from "../../assets/deleteIcon";

type Props = {
  data: TDishes[];
  onEdit: (data: TDishes) => void;
  onDelete: (id: string) => void;
};

export default function DishesCards({ data, onEdit, onDelete }: Props) {
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
          <Divider />
          <CardFooter className="justify-between">
            <div
              className="text-default-400 cursor-pointer active:opacity-50 flex items-center gap-1"
              onClick={() => onEdit(dish)}
            >
              <EditIcon />
              Edit
            </div>
            <Divider orientation="vertical" />
            <div
              className="text-danger cursor-pointer active:opactiy-50 flex items-center gap-1"
              onClick={() => onDelete(dish._id)}
            >
              <DeleteIcon />
              Delete
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
