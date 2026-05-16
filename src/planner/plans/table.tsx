import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
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

const columns = [
  { name: "Name", key: "name" },
  { name: "Updated By", key: "updatedBy" },
  { name: "Current Plan", key: "currentPlan" },
  { name: "", key: "actions" },
];

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

function getCurrentPlanId(currentPlan?: TCurrentPlan | null) {
  if (!currentPlan?.plan) return undefined;
  return typeof currentPlan.plan === "string" ? currentPlan.plan : currentPlan.plan._id;
}

export default function PlansTable({ data, onDetails, onDelete, onStart, currentPlan }: Props) {
  const nowRef = useLazyRef(() => Date.now());
  const currentPlanId = getCurrentPlanId(currentPlan);
  const currentPlanEndsAt = currentPlan?.endsAt ? new Date(currentPlan.endsAt) : undefined;
  // This is fine, re-calculating Date.now() at every render is unnecessary in my opinion
  // eslint-disable-next-line react-hooks/refs
  const isCurrentPlanRunning = !!currentPlanEndsAt && currentPlanEndsAt.getTime() > nowRef.current;

  const renderCell = (item: TPlans, columnKey: string | number) => {
    const value = getKeyValue(item, columnKey);

    switch (columnKey) {
      case "name":
        return value;
      case "updatedBy":
        return value?.name;
      case "currentPlan":
        return currentPlanId === item._id && isCurrentPlanRunning ? (
          `Ends ${dateFormatter.format(currentPlanEndsAt)}`
        ) : (
          <span className="text-danger">Not running</span>
        );
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Tooltip
              content={currentPlanId === item._id && isCurrentPlanRunning ? "Restart" : "Start"}
            >
              <button
                aria-label={
                  currentPlanId === item._id && isCurrentPlanRunning ? "restart plan" : "start plan"
                }
                className="text-lg text-primary-400 cursor-pointer active:opacity-50"
                onClick={() => onStart(item._id, item.name)}
              >
                {currentPlanId === item._id && isCurrentPlanRunning ? (
                  <RestartIcon />
                ) : (
                  <PlayIcon />
                )}
              </button>
            </Tooltip>
            <Tooltip content="Details">
              <button
                aria-label="view plan details"
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => onDetails(item._id)}
              >
                <EyeIcon />
              </button>
            </Tooltip>
            <Tooltip content="Delete">
              <button
                aria-label="delete details"
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => onDelete(item._id)}
              >
                <DeleteIcon />
              </button>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Table aria-label="plans-table" removeWrapper className="mt-6">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.name}</TableColumn>}
      </TableHeader>
      <TableBody items={data}>
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
