import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from "@heroui/react";
import DeleteIcon from "../../assets/deleteIcon";
import EyeIcon from "../../assets/eyeIcon";
import PlayIcon from "../../assets/playIcon";
import SquareIcon from "../../assets/squareIcon";
import { TCurrentPlan } from "../../common/auth/types";
import { TPlans } from "../../common/types";
import { useAppSelector } from "../../store";

type Props = {
  data: TPlans[];
  onDetails: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, name: string) => void;
  currentPlan?: TCurrentPlan | null;
};

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

export default function PlansCards({ data, onDetails, onDelete, onToggle }: Props) {
  const currentPlan = useAppSelector((state) => state.auth.userDetails?.currentPlan);
  const currentPlanId = currentPlan?.plan?._id;
  const currentPlanEndsAt = currentPlan?.endsAt ? new Date(currentPlan.endsAt) : undefined;
  const isCurrentPlanRunning = !!currentPlanEndsAt && currentPlanEndsAt > new Date();

  return (
    <>
      {data.map((plan) => (
        <Card className="mt-4" key={plan._id}>
          <CardHeader>
            <p className="text-lg">{plan.name}</p>
          </CardHeader>
          <Divider />
          <CardBody className="flex-row justify-between gap-4">
            <div>
              <p className="text-default-400">Updated By</p>
              <p>{plan.updatedBy.name}</p>
            </div>
            <div>
              <p className="text-default-400">Current Plan</p>
              <p>
                {currentPlanId === plan._id && isCurrentPlanRunning ? (
                  `Ends ${dateFormatter.format(currentPlanEndsAt)}`
                ) : (
                  <span className="text-danger">Not running</span>
                )}
              </p>
            </div>
          </CardBody>
          <Divider />
          <CardFooter className="justify-between">
            <Button variant="light" color="primary" onPress={() => onToggle(plan._id, plan.name)}>
              {currentPlanId === plan._id && isCurrentPlanRunning ? (
                <>
                  <SquareIcon />
                  Stop
                </>
              ) : (
                <>
                  <PlayIcon />
                  Start
                </>
              )}
            </Button>
            <Divider orientation="vertical" />
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
