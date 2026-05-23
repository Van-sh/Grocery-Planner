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
import EditIcon from "../../assets/editIcon";
import EyeIcon from "../../assets/eyeIcon";
import type { TDishes } from "./types";

type Props = {
  data: TDishes[];
  onDetails: (data: TDishes) => void;
  onEdit: (data: TDishes) => void;
  onDelete: (id: string) => void;
};

const columns = [
  { name: "Name", key: "name" },
  { name: "Updated By", key: "updatedBy" },
  { name: "Ingredients available?", key: "ingredients" },
  { name: "Recipe available?", key: "recipe" },
  { name: "", key: "actions" },
];

export default function DishesTable({ data, onDetails, onEdit, onDelete }: Props) {
  const renderCell = (item: TDishes, columnKey: string | number) => {
    const value = getKeyValue(item, columnKey);

    switch (columnKey) {
      case "name":
        return value;
      case "updatedBy":
        return value?.name;
      case "ingredients":
        return value.length > 0 ? "Yes" : "No";
      case "recipe":
        return value ? "Yes" : "No";
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="Details">
              <button
                aria-label="view dish details"
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => onDetails(item)}
              >
                <EyeIcon />
              </button>
            </Tooltip>
            <Tooltip content="Edit">
              <button
                aria-label="edit dish"
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => onEdit(item)}
              >
                <EditIcon />
              </button>
            </Tooltip>
            <Tooltip content="Delete">
              <button
                aria-label="delete dish"
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
    <Table aria-label="dishes-table" removeWrapper className="mt-6">
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
