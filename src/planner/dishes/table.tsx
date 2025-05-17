import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { TDishes } from "./types";
import EditIcon from "../../assets/editIcon";
import DeleteIcon from "../../assets/deleteIcon";
import EyeIcon from "../../assets/eyeIcon";

type Props = {
  data: TDishes[];
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

export default function DishesTable({ data, onEdit, onDelete }: Props) {
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
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => console.log("Detailed view unimplemented")}
              >
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => onEdit(item)}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip content="Delete">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => onDelete(item._id)}
              >
                <DeleteIcon />
              </span>
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
