import { isDesktop } from "../../constants";
import IngredientCards from "./cards";
import IngredientTable from "./table";
import type { TIngredients } from "./types";

type Props = {
  data: TIngredients[];
  onEdit: (data: TIngredients) => void;
  onDelete: (id: string) => void;
};

export default function List(props: Props) {
  return isDesktop ? <IngredientTable {...props} /> : <IngredientCards {...props} />;
}
