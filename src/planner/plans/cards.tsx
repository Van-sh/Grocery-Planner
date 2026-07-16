import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from "@heroui/react";
import DeleteIcon from "../../assets/deleteIcon";
import EyeIcon from "../../assets/eyeIcon";
import PlayIcon from "../../assets/playIcon";
import SquareIcon from "../../assets/squareIcon";
import { getPlanScheduleDisplay } from "../../common/planSchedule";
import { TPlans } from "../../common/types";
import { useAppSelector } from "../../store";

type Props = {
  data: TPlans[];
  onDetails: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, name: string) => void;
};

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

export default function PlansCards({ data, onDetails, onDelete, onToggle }: Props) {
  const scheduledPlans = useAppSelector((state) => state.auth.userDetails?.scheduledPlans);

  return (
    <>
      {data.map((plan) => {
        const { label, isScheduled, isActive } = getPlanScheduleDisplay(
          scheduledPlans,
          plan._id,
          dateFormatter,
        );
        const toggleLabel = isActive ? "Stop" : isScheduled ? "Unschedule" : "Start";

        return (
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
                <p className="text-default-400">Schedule</p>
                <p>
                  {label === "Not running" ? (
                    <span className="text-danger">{label}</span>
                  ) : (
                    label
                  )}
                </p>
              </div>
            </CardBody>
            <Divider />
            <CardFooter className="justify-between">
              <Button variant="light" color="primary" onPress={() => onToggle(plan._id, plan.name)}>
                {isScheduled ? (
                  <>
                    <SquareIcon />
                    {toggleLabel}
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
        );
      })}
    </>
  );
}
