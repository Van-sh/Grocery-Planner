import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from "@heroui/react";
import DeleteIcon from "../../assets/deleteIcon";
import EditIcon from "../../assets/editIcon";
import type { TIngredients } from "./types";

type Props = {
  data: TIngredients[];
  onEdit: (data: TIngredients) => void;
  onDelete: (id: string) => void;
};

export default function IngredientCards({ data, onEdit, onDelete }: Props) {
  return (
    <>
      {data.map((ingredient) => (
        <Card className="mt-4" key={ingredient._id}>
          <CardHeader>
            <p className="text-lg">{ingredient.name}</p>
          </CardHeader>
          <Divider />
          <CardBody className="flex-row justify-between">
            <div>
              <p className="text-default-400">Updated By</p>
              <p>{ingredient.updatedBy?.name}</p>
            </div>
            <div>
              <p className="text-default-400">Preparations needed?</p>
              <p>{ingredient.preparations.length > 0 ? "Yes" : "No"}</p>
            </div>
          </CardBody>
          <Divider />
          <CardFooter className="justify-between">
            <Button variant="light" onPress={() => onEdit(ingredient)}>
              <EditIcon />
              Edit
            </Button>
            <Divider orientation="vertical" />
            <Button variant="light" color="danger" onPress={() => onDelete(ingredient._id)}>
              <DeleteIcon />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
