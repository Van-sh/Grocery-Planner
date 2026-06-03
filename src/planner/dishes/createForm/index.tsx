import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Checkbox,
  Divider,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { FieldArray, FormikErrors, FormikProvider, useFormik } from "formik";
import { useCallback, useMemo, useRef, useState } from "react";
import * as yup from "yup";
import Autocomplete from "../../../common/autoComplete";
import type { Prettify } from "../../../common/types";
import { debounce } from "../../../common/utils";
import { useLazyGetIngredientsQuery } from "../../ingredients/api";
import type { TIngredients } from "../../ingredients/types";
import { preparationToString } from "../../ingredients/util";
import type { TDishIngredientsBase, TDishes, TDishesBase } from "../types";

// Local type that includes fieldId for React keys (never sent to API)
type TDishIngredientsWithFieldId = Prettify<TDishIngredientsBase & { fieldId: string }>;
type TDishFormikData = Prettify<
  Omit<TDishesBase, "ingredients"> & {
    ingredients: TDishIngredientsWithFieldId[];
  }
>;

const measurementUnits = ["cup", "tablespoon", "teaspoon", "gm", "ml", "number"];

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
        amount: yup.number().required("Amount is required").min(1, "Amount must be greater than 0"),
        measurement_unit: yup
          .string()
          .oneOf(measurementUnits, "Select a type from dropdown")
          .required("Measurement Unit is required"),
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

const ingredientInputClasses = {
  inputWrapper: ["bg-white"],
};

const ingredientToAutocompleteOption = (ingredients: TIngredients[]) =>
  ingredients.map((ingredient) => {
    return {
      _id: ingredient._id,
      name: ingredient.name,
      description:
        ingredient.preparations.length === 0
          ? ""
          : ingredient.preparations.map(preparationToString).join(", "),
    };
  });

const prepareInitialData = (data: TDishes): TDishFormikData => {
  return {
    name: data.name,
    recipe: data.recipe,
    isPrivate: data.isPrivate,
    ingredients: data.ingredients.map((ingredient) => ({
      ingredient: { _id: ingredient.ingredient._id, name: ingredient.ingredient.name },
      amount: ingredient.amount,
      measurement_unit: ingredient.measurement_unit,
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
    measurement_unit: ingredient.measurement_unit,
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
    // not updating dish name because it is not needed in api.
    formik.setFieldValue(`ingredients.${index}.ingredient._id`, value);
    setIngredientsData([
      ...ingredientsData.slice(0, index),
      [],
      ...ingredientsData.slice(index + 1),
    ]);
  };
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

        <Textarea
          label="Recipe"
          placeholder="Insert recipe"
          variant="bordered"
          maxRows={5}
          {...formik.getFieldProps("recipe")}
          isInvalid={formik.touched.recipe && !!formik.errors.recipe}
          errorMessage={formik.errors.recipe}
        />

        <div className="text-default-500 text-small">Ingredients Needed?</div>

        <FormikProvider value={formik}>
          <FieldArray name="ingredients">
            {({ push, remove }) => (
              <>
                {formik.values.ingredients.map(({ fieldId }, index) => (
                  <div key={fieldId} className="bg-gray-100 flex flex-col gap-1 p-2 rounded-lg">
                    <Autocomplete
                      label="Ingredient"
                      placeholder="Chana, Coriander, etc."
                      variant="bordered"
                      {...formik.getFieldProps(`ingredients.${index}.ingredient`)}
                      isInvalid={
                        formik.touched.ingredients?.[index]?.ingredient &&
                        !!(
                          (formik.errors.ingredients?.[
                            index
                          ] as FormikErrors<TDishIngredientsBase>) || {}
                        ).ingredient?._id
                      }
                      errorMessage={
                        (
                          (formik.errors.ingredients?.[
                            index
                          ] as FormikErrors<TDishIngredientsBase>) || {}
                        ).ingredient?._id
                      }
                      classNames={ingredientInputClasses}
                      value={formik.values.ingredients[index].ingredient.name}
                      options={ingredientToAutocompleteOption(ingredientsData[index])}
                      onChange={(event) => handleSearchChange(event.target.value, index)}
                      onSelect={(value) => handleSearchItemSelect(value, index)}
                    />

                    <div className="flex gap-x-1">
                      <div className="flex-1 w-0 min-w-0">
                        <Input
                          label="Amount of ingredient"
                          variant="bordered"
                          type="number"
                          {...formik.getFieldProps(`ingredients.${index}.amount`)}
                          isInvalid={
                            formik.touched.ingredients?.[index]?.amount &&
                            !!(
                              (formik.errors.ingredients?.[
                                index
                              ] as FormikErrors<TDishIngredientsBase>) || {}
                            ).amount
                          }
                          errorMessage={
                            (
                              (formik.errors.ingredients?.[
                                index
                              ] as FormikErrors<TDishIngredientsBase>) || {}
                            )?.amount
                          }
                          classNames={ingredientInputClasses}
                        />
                      </div>

                      <div className="flex-1 w-0 min-w-0">
                        <Select
                          label="Measurement Unit"
                          placeholder="cups, grams, etc."
                          variant="bordered"
                          selectedKeys={[formik.values.ingredients[index].measurement_unit]}
                          {...formik.getFieldProps(`ingredients.${index}.measurement_unit`)}
                          isInvalid={
                            formik.touched.ingredients?.[index]?.measurement_unit &&
                            !!(
                              (formik.errors.ingredients?.[
                                index
                              ] as FormikErrors<TDishIngredientsBase>) || {}
                            ).measurement_unit
                          }
                          errorMessage={
                            (
                              (formik.errors.ingredients?.[
                                index
                              ] as FormikErrors<TDishIngredientsBase>) || {}
                            )?.measurement_unit
                          }
                          classNames={{ trigger: ["bg-white"] }}
                        >
                          {measurementUnits.map((unit) => (
                            <SelectItem key={unit}>{unit}</SelectItem>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <Divider />

                    <Button
                      variant="flat"
                      onPress={() => {
                        setIngredientsData((prevState) => prevState.filter((_, i) => i !== index));
                        remove(index);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <Button
                  variant="bordered"
                  isDisabled={!!formik.getFieldMeta("ingredients").error}
                  onPress={() => {
                    setIngredientsData((prevState) => [...prevState, []]);
                    push(createDefaultIngredient());
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Add Ingredient
                </Button>
              </>
            )}
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
