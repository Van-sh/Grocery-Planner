import React from "react";
import { TIngredients } from "./types";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, getKeyValue } from "@nextui-org/react";
import EditIcon from "../../assets/editIcon";
import DeleteIcon from "../../assets/deleteIcon";

// TODO:
// 1. Handle delete and edit actions

type Props = {
  data: TIngredients[];
  onEdit: (data: TIngredients) => void;
  onDelete: (id: string) => void;
};

const columns = [
  { name: "Name", key: "name" },
  { name: "Updated By", key: "updatedBy" },
  { name: "Preparations needed?", key: "preparations" },
  { name: "", key: "actions" }
];

export default function IngredientTable({ data, onEdit, onDelete }: Props) {
  const renderCell = React.useCallback((item: TIngredients, columnKey: string | number) => {
    const value = getKeyValue(item, columnKey);

    switch (columnKey) {
      case "name":
      case "updatedBy":
        return value;

      case "preparations":
        return value.length > 0 ? "Yes" : "No";

      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="Edit Ingredient">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => onEdit(item)}>
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip content="Delete Ingredient">
              <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => onDelete(item._id)}>
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );

      default:
        return null;
    }
  }, []);

  return (
    <Table removeWrapper className="mt-6">
      <TableHeader columns={columns}>{column => <TableColumn key={column.key}>{column.name}</TableColumn>}</TableHeader>
      <TableBody items={data}>
        {item => <TableRow key={item._id}>{columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
      </TableBody>
    </Table>
  );
}
