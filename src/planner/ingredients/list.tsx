import { TIngredients } from "./types";
import { isDesktop } from "../../constants";
import IngredientTable from "./table";
import IngredientCards from "./cards";

type Props = {
  data: TIngredients[];
  onEdit: (data: TIngredients) => void;
};

export default function List(props: Props) {
  return isDesktop ? <IngredientTable {...props} /> : <IngredientCards {...props} />;
}
