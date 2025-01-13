import { Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";
import { TIngredients } from "./types";
import EditIcon from "../../assets/editIcon";
import DeleteIcon from "../../assets/deleteIcon";

type Props = {
  data: TIngredients[];
  onEdit: (data: TIngredients) => void;
  onDelete: (id: string) => void;
};

export default function IngredientCards({ data, onEdit, onDelete }: Props) {
  return (
    <>
      {data.map(ingredient => (
        <Card className="mt-4">
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
            <div className="text-default-400 cursor-pointer active:opacity-50 flex items-center gap-1" onClick={() => onEdit(ingredient)}>
              <EditIcon />
              Edit
            </div>
            <Divider orientation="vertical" />
            <div className="text-danger cursor-pointer active:opacity-50 flex items-center gap-1" onClick={() => onDelete(ingredient._id)}>
              <DeleteIcon />
              Delete
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
