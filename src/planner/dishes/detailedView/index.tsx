import { ModalBody, ModalHeader } from "@nextui-org/react";
import { TDishes } from "../types";
import { preparationToString } from "../../ingredients/util";

type Props = {
  value?: TDishes;
};

export default function DetailedView({ value }: Props) {
  return (
    <>
      <ModalHeader>{value?.name}</ModalHeader>
      <ModalBody>
        <p>
          <b>Ingredients:</b>
        </p>
        <table>
          {value?.ingredients.map((ingredient) => (
            <tr key={ingredient.ingredient._id}>
              <td>{ingredient.ingredient.name}</td>
              <td>{ingredient.ingredient.preparations.map(preparationToString).join(", ")}</td>
              <td>{ingredient.amount} {ingredient.measurement_unit}</td>
            </tr>
          ))}
        </table>

        <p>
          <b>Recipe: </b>
        </p>
        {value?.recipe}
      </ModalBody>
    </>
  );
}
