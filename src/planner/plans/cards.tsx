import { Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";
import DeleteIcon from "../../assets/deleteIcon";
import EyeIcon from "../../assets/eyeIcon";
import { TPlans } from "../../common/types";

type Props = {
  data: TPlans[];
  onDetails: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function PlansCards({ data, onDetails, onDelete }: Props) {
  return (
    <>
      {data.map((plan) => (
        <Card className="mt-4" key={plan._id}>
          <CardHeader>
            <p className="text-lg">{plan.name}</p>
          </CardHeader>
          <Divider />
          <CardBody className="flex-row justify-between">
            <div>
              <p className="text-default-400">Updated By</p>
              <p>{plan.updatedBy.name}</p>
            </div>
            <div>
              <p className="text-default-400">Is Active</p>
              <p>{plan.isActive ? "Yes" : <span className="text-danger">No</span>}</p>
            </div>
          </CardBody>
          <Divider />
          <CardFooter className="justify-between">
            <div
              className="text-default-400 cursor-pointer active:opacity-50 flex items-center gap-1"
              onClick={() => onDetails(plan._id)}
            >
              <EyeIcon />
              Details
            </div>
            <Divider orientation="vertical" />
            <div
              className="text-danger cursor-pointer active:opactiy-50 flex items-center gap-1"
              onClick={() => onDelete(plan._id)}
            >
              <DeleteIcon />
              Delete
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
