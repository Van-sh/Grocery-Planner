import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from "@heroui/react";
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
            <Button variant="light" onPress={() => onDetails(plan._id)}>
              <EyeIcon />
              Details
            </Button>
            <Divider orientation="vertical" />
            <Button variant="light" color="danger" onPress={() => onDelete(plan._id)}>
              <DeleteIcon />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
