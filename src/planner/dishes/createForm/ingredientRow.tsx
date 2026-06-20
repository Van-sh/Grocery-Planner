import { Button, Checkbox, Divider, Input, Select, SelectItem } from "@heroui/react";
import { FastField, Field, FieldProps, FormikErrors } from "formik";
import { ChangeEvent, useCallback, useMemo } from "react";
import Autocomplete from "../../../common/autoComplete";
import type { TIngredients } from "../../ingredients/types";
import { preparationToString } from "../../ingredients/util";
import { measurementUnits } from "../constants";

const ingredientInputClasses = {
  inputWrapper: ["bg-white"],
};

const ingredientToAutocompleteOption = (ingredients: TIngredients[]) =>
  ingredients.map((ingredient) => ({
    _id: ingredient._id,
    name: ingredient.name,
    description:
      ingredient.preparations.length === 0
        ? ""
        : ingredient.preparations.map(preparationToString).join(", "),
  }));

type Props = {
  index: number;
  ingredientOptions: TIngredients[];
  onSearchChange: (query: string, index: number) => void;
  onSearchSelect: (value: string, index: number) => void;
  onRemove: (index: number) => void;
};

export default function IngredientRow({
  index,
  ingredientOptions,
  onSearchChange,
  onSearchSelect,
  onRemove,
}: Props) {
  const options = useMemo(
    () => ingredientToAutocompleteOption(ingredientOptions),
    [ingredientOptions],
  );

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value, index),
    [onSearchChange, index],
  );
  const handleSearchSelect = useCallback(
    (value: string) => onSearchSelect(value, index),
    [onSearchSelect, index],
  );
  const handleRemove = useCallback(() => onRemove(index), [onRemove, index]);

  return (
    <div className="bg-gray-100 flex flex-col sm:flex-row gap-1 p-2 rounded-lg ">
      <Field name={`ingredients.${index}.ingredient`}>
        {({ field, meta }: FieldProps<{ _id: string; name: string }>) => {
          const errors = meta.error as FormikErrors<{ _id: string; name: string }> | undefined;
          return (
            <Autocomplete
              label="Ingredient"
              placeholder="Chana, Coriander, etc."
              variant="bordered"
              name={field.name}
              isInvalid={!!meta.touched && !!errors?._id}
              errorMessage={errors?._id}
              classNames={ingredientInputClasses}
              value={field.value.name}
              options={options}
              onChange={handleSearchChange}
              onSelect={handleSearchSelect}
            />
          );
        }}
      </Field>

      <div className="flex gap-x-1 flex-1">
        <div className="flex-1 min-w-0">
          <FastField name={`ingredients.${index}.amount`}>
            {({ field, meta }: FieldProps<number>) => (
              <Input
                label="Amount"
                variant="bordered"
                type="number"
                step="any"
                name={field.name}
                value={field.value?.toString() ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!meta.touched && !!meta.error}
                errorMessage={meta.error}
                classNames={ingredientInputClasses}
              />
            )}
          </FastField>
        </div>

        <div className="flex-1 min-w-0">
          <FastField name={`ingredients.${index}.to`}>
            {({ field, meta }: FieldProps<number | undefined>) => (
              <Input
                label="To (Optional)"
                variant="bordered"
                type="number"
                step="any"
                name={field.name}
                value={field.value?.toString() ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!meta.touched && !!meta.error}
                errorMessage={meta.error}
                classNames={ingredientInputClasses}
              />
            )}
          </FastField>
        </div>

        <div className="flex-1 min-w-0">
          <FastField name={`ingredients.${index}.measurement_unit`}>
            {({ field, meta }: FieldProps<string>) => (
              <Select
                label="Unit"
                placeholder="cups, grams, etc."
                variant="bordered"
                selectedKeys={field.value ? [field.value] : []}
                {...field}
                isInvalid={!!meta.touched && !!meta.error}
                errorMessage={meta.error}
                classNames={{ trigger: ["bg-white"] }}
              >
                {measurementUnits.map((unit) => (
                  <SelectItem key={unit}>{unit}</SelectItem>
                ))}
              </Select>
            )}
          </FastField>
        </div>
      </div>

      <div className="flex">
        <FastField name={`ingredients.${index}.isOptional`}>
          {({ field }: FieldProps<boolean | undefined>) => (
            <Checkbox
              name={field.name}
              isSelected={!!field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              classNames={{ label: "text-xs" }}
            >
              Optional
            </Checkbox>
          )}
        </FastField>
      </div>

      <Divider className="sm:hidden" />

      <Button variant="flat" className="sm:h-auto" onPress={handleRemove}>
        Remove
      </Button>
    </div>
  );
}
