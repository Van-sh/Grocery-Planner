import { TPlans } from "../../common/types";
import { isDesktop } from "../../constants";
import PlansCards from "./cards";
import PlansTable from "./table";

type Props = {
  data: TPlans[];
  onDetails: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function List(props: Props) {
  return isDesktop ? <PlansTable {...props} /> : <PlansCards {...props} />;
}
