import { ModalBody, ModalHeader } from "@nextui-org/react";
import { TDishes } from "../types";
import { preparationToString } from "../../ingredients/types";

type Props = {
  value?: TDishes;
};

export default function DetailedView({ value }: Props) {
  return (
    <>
      <ModalHeader>{value?.name}</ModalHeader>
      <ModalBody>
        <p>Ingredients:</p>
        <table>
          {value?.ingredients.map((ingredient) => (
            <tr>
              <td>
                {ingredient.ingredient.name}
                {ingredient.ingredient.preparations.map(preparationToString).join(", ")}
              </td>
              <td>{ingredient.amount}</td>
              <td>{ingredient.measurement_unit}</td>
            </tr>
          ))}
        </table>

        <p>Recipe: </p>
        {value?.recipe}
      </ModalBody>
    </>
  );
}
