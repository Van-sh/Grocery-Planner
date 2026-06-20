import { ModalBody, ModalHeader } from "@heroui/react";
import type { TDishes } from "../../planner/dishes/types";
import { preparationToString } from "../../planner/ingredients/util";

type Props = {
  value?: TDishes;
};

export default function DetailedRecipe({ value }: Props) {
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
              <td className="pb-2 text-xs">
                {ingredient.ingredient.name}
                {ingredient.ingredient.preparations.length ? (
                  <span className="text-default-500 italic">
                    {` (${ingredient.ingredient.preparations.map(preparationToString).join(", ")})`}
                  </span>
                ) : (
                  ""
                )}
              </td>
              <td className="pb-2 text-sm">
                {ingredient.amount}
                {ingredient.to ? `-${ingredient.to}` : ""} {ingredient.measurement_unit}
                {ingredient.isOptional ? (
                  <span className="text-default-500 italic">{" (optional)"}</span>
                ) : (
                  ""
                )}
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
