import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from "@heroui/react";
import DeleteIcon from "../../assets/deleteIcon";
import EyeIcon from "../../assets/eyeIcon";
import PlayIcon from "../../assets/playIcon";
import RestartIcon from "../../assets/restartIcon";
import { TCurrentPlan } from "../../common/auth/types";
import { TPlans } from "../../common/types";
import { useLazyRef } from "../../common/useLazyRef";

type Props = {
  data: TPlans[];
  onDetails: (id: string) => void;
  onDelete: (id: string) => void;
  onStart: (id: string, name: string) => void;
  currentPlan?: TCurrentPlan | null;
};

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

function getCurrentPlanId(currentPlan?: TCurrentPlan | null) {
  if (!currentPlan?.plan) return undefined;
  return typeof currentPlan.plan === "string" ? currentPlan.plan : currentPlan.plan._id;
}

export default function PlansCards({ data, onDetails, onDelete, onStart, currentPlan }: Props) {
  const nowRef = useLazyRef(() => Date.now());
  const currentPlanId = getCurrentPlanId(currentPlan);
  const currentPlanEndsAt = currentPlan?.endsAt ? new Date(currentPlan.endsAt) : undefined;
  // This is fine, re-calculating Date.now() at every render is unnecessary in my opinion
  // eslint-disable-next-line react-hooks/refs
  const isCurrentPlanRunning = !!currentPlanEndsAt && currentPlanEndsAt.getTime() > nowRef.current;

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
            <Button variant="light" color="primary" onPress={() => onStart(plan._id, plan.name)}>
              {currentPlanId === plan._id && isCurrentPlanRunning ? (
                <>
                  <RestartIcon />
                  Restart
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
