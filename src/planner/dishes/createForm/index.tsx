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
import { debounce } from "../../../common/utils";
import { useLazyGetIngredientsQuery } from "../../ingredients/api";
import type { TIngredients } from "../../ingredients/types";
import { preparationToString } from "../../ingredients/util";
import type { TDishIngredientsBase, TDishes, TDishesBase } from "../types";

const measurementUnits = ["cup", "tablespoon", "teaspoon", "gm", "ml"];

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
  initialValues?: TDishes; // pass to edit a form
  isLoading?: boolean;
  onClose: () => void;
  onCreate: (data: TDishesBase, id?: string) => void;
};

const defaultIngredient: TDishIngredientsBase = {
  ingredient: { _id: "", name: "" },
  amount: 0,
  measurement_unit: "",
};

const ingredientInputClasses = {
  inputWrapper: ["bg-white"],
};

const cleanData: (data: TDishes) => TDishesBase = (data: TDishes) => {
  return {
    ...data,
    ingredients: data.ingredients.map((ingredient) => {
      return {
        ...ingredient,
        ingredient: { _id: ingredient.ingredient._id, name: ingredient.ingredient.name },
      };
    }),
  };
};

export default function CreateForm({ initialValues, isLoading, onClose, onCreate }: Props) {
  const initial: TDishesBase | undefined = useMemo(
    () => (initialValues ? cleanData(initialValues) : undefined),
    [initialValues],
  );
  const [ingredientsData, setIngredientsData] = useState<TIngredients[][]>(
    initialValues?.ingredients.map((ingredient) => [ingredient.ingredient]) || [],
  );
  const searchControllerRef = useRef<ReturnType<typeof getIngredients> | null>();

  const [getIngredients] = useLazyGetIngredientsQuery();
  const refetchIngredient = useCallback(
    async (newQuery: string, index: number) => {
      const preferCachedValues = true;

      const getIngredientsPromise = getIngredients(
        { query: newQuery, page: 1 },
        preferCachedValues,
      );
      searchControllerRef.current = getIngredientsPromise;

      const { data, requestId } = await getIngredientsPromise;
      const dish = data?.data ?? [];
      // only update if the response is from the current request
      if ((await searchControllerRef.current).requestId === requestId) {
        setIngredientsData([
          ...ingredientsData.slice(0, index),
          dish,
          ...ingredientsData.slice(index + 1),
        ]);
      }
    },
    [getIngredients, ingredientsData],
  );

  const handleSearchChange = debounce(refetchIngredient, 750);
  const handleSearchItemSelect = (value: string, index: number) => {
    // not updating dish name because it is not needed in api.
    formik.setFieldValue(`dishes.${index}.dish._id`, value);
    setIngredientsData([
      ...ingredientsData.slice(0, index),
      [],
      ...ingredientsData.slice(index + 1),
    ]);
  };

  function ingredientToAutocompleteOption(ingredients: TIngredients[]) {
    return ingredients.map((ingredient) => {
      return {
        _id: ingredient._id,
        name: ingredient.name,
        description:
          ingredient.preparations.length === 0
            ? ""
            : ingredient.preparations.map(preparationToString).join(", "),
      };
    });
  }

  const formik = useFormik({
    initialValues: {
      name: initial?.name || "",
      recipe: initial?.recipe || "",
      ingredients: initial?.ingredients || [],
      isPrivate: initial?.isPrivate || false,
    } as TDishesBase,
    validationSchema: schema,
    onSubmit: (values) => onCreate(values, initialValues?._id),
  });

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="false">
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
          {...formik.getFieldProps("recipe")}
          isInvalid={formik.touched.recipe && !!formik.errors.recipe}
          errorMessage={formik.errors.recipe}
        />

        <div className="text-default-500 text-small">Ingredients Needed?</div>

        <FormikProvider value={formik}>
          <FieldArray name="ingredients">
            {({ push, remove }) => (
              <>
                {formik.values.ingredients.map(({ ingredient: { _id } }, index) => (
                  <div key={_id} className="bg-gray-100 flex flex-col gap-2 p-2 rounded-lg">
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

                    <Select
                      label="Measurement Unit"
                      placeholder="cups, tablespoons, grams, etc."
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

                    <Divider />

                    <Button
                      variant="flat"
                      onClick={() => {
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
                  onClick={() => {
                    setIngredientsData((prevState) => [...prevState, []]);
                    push(defaultIngredient);
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
          <Button color="danger" variant="light" onPress={onClose} isLoading={isLoading}>
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
