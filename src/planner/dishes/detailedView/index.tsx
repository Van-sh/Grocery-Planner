import { ModalBody, ModalHeader } from "@heroui/react";
import { preparationToString } from "../../ingredients/util";
import type { TDishes } from "../types";

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
              <td>
                {ingredient.amount}
                {ingredient.to ? `-${ingredient.to}` : ""} {ingredient.measurement_unit}
              </td>
            </tr>
          ))}
        </table>

        <p>
          <b>Recipe: </b>
        </p>
        <div
          className="[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-4 [&_ol]:pl-4"
          dangerouslySetInnerHTML={{ __html: value?.recipe || "" }}
        />
      </ModalBody>
    </>
  );
}
