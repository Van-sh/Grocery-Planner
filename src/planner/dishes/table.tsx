import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { TDishes } from "./types";

type Props = {
  data: TDishes[];
};

const columns = [
  { name: "Name", key: "name" },
  { name: "Updated By", key: "updatedBy" },
  { name: "Ingredients available?", key: "ingredients" },
  { name: "Recipe available?", key: "recipe" },
];

export default function DishesTable({ data }: Props) {
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
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
