import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Checkbox, Input, ModalBody, ModalFooter, ModalHeader } from "@heroui/react";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { useCallback, useMemo, useRef, useState } from "react";
import Editor from "react-simple-wysiwyg";
import * as yup from "yup";
import type { Prettify } from "../../../common/types";
import { debounce } from "../../../common/utils";
import { useLazyGetIngredientsQuery } from "../../ingredients/api";
import type { TIngredients } from "../../ingredients/types";
import { measurementUnits } from "../constants";
import type { TDishIngredientsBase, TDishes, TDishesBase } from "../types";
import IngredientRow from "./ingredientRow";

// Local type that includes fieldId for React keys (never sent to API)
type TDishIngredientsWithFieldId = Prettify<TDishIngredientsBase & { fieldId: string }>;
type TDishFormikData = Prettify<
  Omit<TDishesBase, "ingredients"> & {
    ingredients: TDishIngredientsWithFieldId[];
  }
>;

const schema = yup.object({
  name: yup.string().required("Name is required"),
  recipe: yup.string(),
  ingredients: yup
    .array()
    .of(
      yup.object({
        ingredient: yup.object({
          _id: yup.string().required("Ingredient is required"),
          name: yup.string(),
        }),
        amount: yup
          .number()
          .required("Amount is required")
          .moreThan(0, "Amount must be greater than 0"),
        to: yup
          .number()
          .nullable()
          .when("amount", ([amount], schema) =>
            schema.test({
              name: "to-greater-than-amount",
              message: "To must be greater than Amount",
              test: (value) => value === undefined || value === null || value > amount,
            }),
          ),
        measurement_unit: yup
          .string()
          .oneOf(measurementUnits, "Select a type from dropdown")
          .required("Measurement Unit is required"),
        isOptional: yup.boolean(),
      }),
    )
    .max(100)
    .notRequired(),
  isPrivate: yup.boolean(),
});

type Props = {
  initialValues?: TDishes;
  isLoading?: boolean;
  onClose: () => void;
  onCreate: (data: TDishesBase, id?: string) => void;
};

const createDefaultIngredient = (): TDishIngredientsWithFieldId => ({
  ingredient: { _id: "", name: "" },
  amount: 0,
  measurement_unit: "",
  fieldId: crypto.randomUUID(),
});

const prepareInitialData = (data: TDishes): TDishFormikData => {
  return {
    name: data.name,
    recipe: data.recipe,
    isPrivate: data.isPrivate,
    ingredients: data.ingredients.map((ingredient) => ({
      ingredient: { _id: ingredient.ingredient._id, name: ingredient.ingredient.name },
      amount: ingredient.amount,
      to: ingredient.to,
      measurement_unit: ingredient.measurement_unit,
      isOptional: ingredient.isOptional,
      fieldId: crypto.randomUUID(),
    })),
  };
};

const cleanFormikData = (data: TDishFormikData): TDishesBase => ({
  name: data.name,
  recipe: data.recipe,
  isPrivate: data.isPrivate,
  ingredients: data.ingredients.map((ingredient: TDishIngredientsWithFieldId) => ({
    ingredient: ingredient.ingredient,
    amount: ingredient.amount,
    to: ingredient.to,
    measurement_unit: ingredient.measurement_unit,
    isOptional: ingredient.isOptional,
  })),
});

export default function CreateForm({ initialValues, isLoading, onClose, onCreate }: Props) {
  const initial = useMemo<TDishFormikData | undefined>(
    () => (initialValues ? prepareInitialData(initialValues) : undefined),
    [initialValues],
  );
  const [ingredientsData, setIngredientsData] = useState<TIngredients[][]>(
    initialValues?.ingredients.map((ingredient) => [ingredient.ingredient]) || [],
  );
  const searchControllerRef = useRef<Record<number, ReturnType<typeof getIngredients> | null>>({});

  const [getIngredients] = useLazyGetIngredientsQuery();

  const formik = useFormik<TDishFormikData>({
    initialValues: {
      name: initial?.name || "",
      recipe: initial?.recipe || "",
      ingredients: initial?.ingredients || [],
      isPrivate: initial?.isPrivate || false,
    },
    validationSchema: schema,
    onSubmit: (values) => onCreate(cleanFormikData(values), initialValues?._id),
  });
  const { setFieldValue } = formik;

  const refetchIngredient = useCallback(
    async (newQuery: string, index: number) => {
      const preferCachedValues = true;

      const getIngredientsPromise = getIngredients(
        { query: newQuery, page: 1 },
        preferCachedValues,
      );
      searchControllerRef.current[index] = getIngredientsPromise;

      const { data, requestId } = await getIngredientsPromise;
      const dish = data?.data ?? [];
      // only update if the response is from the current request
      if ((await searchControllerRef.current[index]).requestId === requestId) {
        setIngredientsData((prevData) => [
          ...prevData.slice(0, index),
          dish,
          ...prevData.slice(index + 1),
        ]);
      }
    },
    [getIngredients],
  );

  const handleSearchChange = useMemo(
    () =>
      debounce(
        // updates a state when UI needs to be updated
        // eslint-disable-next-line react-hooks/refs
        refetchIngredient,
        750,
      ),
    [refetchIngredient],
  );

  const handleSearchItemSelect = (value: string, index: number) => {
    setFieldValue(`ingredients.${index}.ingredient._id`, value);
    setIngredientsData((prev) => [...prev.slice(0, index), [], ...prev.slice(index + 1)]);
  };

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="off">
      <ModalHeader>{initialValues ? "Edit" : "Add New"} Dish</ModalHeader>
      <ModalBody>
        <Input
          autoFocus
          label="Name"
          placeholder="Insert Dish names etc."
          variant="bordered"
          {...formik.getFieldProps("name")}
          isInvalid={formik.touched.name && !!formik.errors.name}
          errorMessage={formik.errors.name}
        />

        <div className="[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-8 [&_ol]:pl-8">
          <Editor
            value={formik.values.recipe || ""}
            onChange={formik.handleChange("recipe")}
            onBlur={formik.handleBlur("recipe")}
            placeholder="Type the recipe here ..."
            containerProps={{
              style: { height: "150px", overflowY: "auto" as const },
            }}
          />
        </div>

        <div className="text-default-500 text-small">Ingredients Needed?</div>

        <FormikProvider value={formik}>
          <FieldArray name="ingredients">
            {(arrayHelpers) => {
              const handleRemoveIngredient = (index: number) => {
                setIngredientsData((prev) => prev.filter((_, i) => i !== index));
                arrayHelpers.remove(index);
              };

              return (
                <>
                  {formik.values.ingredients.map(({ fieldId }, index) => (
                    <IngredientRow
                      key={fieldId}
                      index={index}
                      ingredientOptions={ingredientsData[index]}
                      onSearchChange={handleSearchChange}
                      onSearchSelect={handleSearchItemSelect}
                      onRemove={handleRemoveIngredient}
                    />
                  ))}

                  <Button
                    variant="bordered"
                    isDisabled={!!formik.getFieldMeta("ingredients").error}
                    onPress={() => {
                      setIngredientsData((prevState) => [...prevState, []]);
                      arrayHelpers.push(createDefaultIngredient());
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Add Ingredient
                  </Button>
                </>
              );
            }}
          </FieldArray>
        </FormikProvider>
        <Checkbox {...formik.getFieldProps("isPrivate")}>Make Private</Checkbox>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose} isDisabled={isLoading}>
            Close
          </Button>
          <Button
            type="submit"
            color="primary"
            isDisabled={!(formik.dirty && formik.isValid)}
            isLoading={isLoading}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalBody>
    </form>
  );
}
