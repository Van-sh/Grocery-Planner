import { isDesktop } from "../../constants";
import DishesCards from "./cards";
import DishesTable from "./table";
import { TDishes } from "./types"

type Props = {
    data: TDishes[];
}

export default function List(props: Props) {
    return isDesktop ? <DishesTable {...props} /> : <DishesCards {...props} />;
}
