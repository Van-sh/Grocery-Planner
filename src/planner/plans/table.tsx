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

const columns = [
  { name: "Name", key: "name" },
  { name: "Updated By", key: "updatedBy" },
  { name: "Schedule", key: "schedule" },
  { name: "", key: "actions" },
];

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

export default function PlansTable({ data, onDetails, onDelete, onToggle }: Props) {
  const scheduledPlans = useAppSelector((state) => state.auth.userDetails?.scheduledPlans);

  const renderCell = (item: TPlans, columnKey: string | number) => {
    const value = getKeyValue(item, columnKey);
    const { label, isScheduled, isActive } = getPlanScheduleDisplay(
      scheduledPlans,
      item._id,
      dateFormatter,
    );
    const toggleLabel = isActive ? "Stop" : isScheduled ? "Unschedule" : "Start";

    switch (columnKey) {
      case "name":
        return value;
      case "updatedBy":
        return value?.name;
      case "schedule":
        return label === "Not running" ? (
          <span className="text-danger">{label}</span>
        ) : (
          label
        );
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Tooltip content={toggleLabel}>
              <button
                aria-label={`${toggleLabel.toLowerCase()} plan`}
                className="text-lg text-primary-400 cursor-pointer active:opacity-50"
                onClick={() => onToggle(item._id, item.name)}
              >
                {isScheduled ? <SquareIcon /> : <PlayIcon />}
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
    <Table
      aria-label="plans-table"
      removeWrapper
      className="mt-6"
    >
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
