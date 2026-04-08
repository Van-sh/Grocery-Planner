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
import { TPlans } from "../../common/types";

type Props = {
  data: TPlans[];
  onDetails: (id: string) => void;
  onDelete: (id: string) => void;
};

const columns = [
  { name: "Name", key: "name" },
  { name: "Updated By", key: "updatedBy" },
  { name: "Is Active", key: "isActive" },
  { name: "", key: "actions" },
];

export default function PlansTable({ data, onDetails, onDelete }: Props) {
  const renderCell = (item: TPlans, columnKey: string | number) => {
    const value = getKeyValue(item, columnKey);

    switch (columnKey) {
      case "name":
        return value;
      case "updatedBy":
        return value?.name;
      case "isActive":
        return value ? "Yes" : <span className="text-danger">No</span>;
      case "actions":
        return (
          <div className="flex items-center gap-2">
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
