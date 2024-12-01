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
} from "@nextui-org/react";
import { FieldArray, FormikErrors, FormikProvider, useFormik } from "formik";
import { useMemo, useRef, useState } from "react";
import * as yup from "yup";

import Autocomplete from "../../../common/autoComplete";
import { debounce } from "../../../common/utils";
import { useLazyGetIngredientsQuery } from "../../ingredients/api";
import { type TIngredients } from "../../ingredients/types";
import { type TDishIngredientsBase, type TDishes, type TDishesBase } from "../types";

// TODO: Create a dropdown for Unit

const measurementUnits = ["cup", "tablespoon", "teaspoon", "gm", "ml"];

const schema = yup.object({
   name: yup.string().required("Name is required"),
   recipe: yup.string(),
   ingredients: yup
      .array()
      .of(
         yup.object({
            ingredient: yup.string().required("Type is required"),
            amount: yup
               .number()
               .required("Amount is required")
               .min(1, "Amount must be greater than 0"),
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
   ingredient: "",
   amount: 0,
   measurement_unit: "",
};

const defaultQuery = {
   query: "",
   page: 1,
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
            ingredient: ingredient.ingredient._id,
         };
      }),
   };
};

export default function CreateForm({
   initialValues,
   isLoading,
   onClose,
   onCreate,
}: Props) {
   const [queryList, setQueryList] = useState<{ query: string; page: number }[]>([]);
   const [ingredientsData, setIngredientsData] = useState<TIngredients[][]>([]);
   const ingredientsFetchRef = useRef(0);

   const [getIngredients] = useLazyGetIngredientsQuery();

   const setQuery = useMemo(
      () =>
         debounce((newQuery: string, index: number) => {
            const newQueryList = queryList.map((query, queryIndex) =>
               queryIndex === index ? { query: newQuery, page: 1 } : query,
            );
            setQueryList(newQueryList);
            (async () => {
               const ingredientsData: TIngredients[][] = Array(newQueryList.length);
               const fetchId = ++ingredientsFetchRef.current;
               const promises = newQueryList.map(async (query) => {
                  const { data: ingredient } = await getIngredients(query);
                  ingredientsData[index] = ingredient?.data ?? [];
               });
               await Promise.all(promises);
               if (ingredientsFetchRef.current !== fetchId) {
                  // User changed selection while these requests were ongoing; abort so
                  // that we don't squash the state.
                  return;
               }
               setIngredientsData(ingredientsData);
            })();
         }, 750),
      [getIngredients, queryList],
   );

   let initial: TDishesBase | undefined = useMemo(
      () => (initialValues ? cleanData(initialValues) : undefined),
      [initialValues],
   );

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
                        {formik.values.ingredients.map((_, index) => (
                           <div
                              key={index}
                              className="bg-gray-100 flex flex-col gap-2 p-2 rounded-lg"
                           >
                              <Autocomplete
                                 label="Preparation type"
                                 placeholder="Fried, Boiled, etc."
                                 variant="bordered"
                                 {...formik.getFieldProps(
                                    `preparations.${index}.category`,
                                 )}
                                 isInvalid={
                                    formik.touched.ingredients?.[index]?.ingredient &&
                                    !!(
                                       (formik.errors.ingredients?.[
                                          index
                                       ] as FormikErrors<TDishIngredientsBase>) || {}
                                    ).ingredient
                                 }
                                 errorMessage={
                                    (
                                       (formik.errors.ingredients?.[
                                          index
                                       ] as FormikErrors<TDishIngredientsBase>) || {}
                                    ).ingredient
                                 }
                                 classNames={ingredientInputClasses}
                                 options={ingredientsData[index]}
                                 onChange={(event) =>
                                    setQuery(event.target.value, index)
                                 }
                                 onSelect={(value) =>
                                    formik.setFieldValue(
                                       `ingredients.${index}.ingredient`,
                                       value,
                                    )
                                 }
                              />

                              <Input
                                 label="Amount of ingredient"
                                 variant="bordered"
                                 type="number"
                                 {...formik.getFieldProps(
                                    `ingredients.${index}.amount`,
                                 )}
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
                                 selectedKeys={[
                                    formik.values.ingredients[index].measurement_unit,
                                 ]}
                                 {...formik.getFieldProps(
                                    `ingredients.${index}.measurement_unit`,
                                 )}
                                 isInvalid={
                                    formik.touched.ingredients?.[index]
                                       ?.measurement_unit &&
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
                                    <SelectItem key={unit} value={unit}>
                                       {unit}
                                    </SelectItem>
                                 ))}
                              </Select>

                              <Divider />

                              <Button
                                 variant="flat"
                                 onClick={() => {
                                    setQueryList((prevState) =>
                                       prevState.filter((_, i) => i !== index),
                                    );
                                    setIngredientsData((prevState) =>
                                       prevState.filter((_, i) => i !== index),
                                    );
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
                              setQueryList((prevState) => [...prevState, defaultQuery]);
                              setIngredientsData((prevState) => [...prevState, []]);
                              push(defaultIngredient);
                           }}
                        >
                           <FontAwesomeIcon icon={faPlus} />
                           Add Preparation
                        </Button>
                     </>
                  )}
               </FieldArray>
            </FormikProvider>
            <Checkbox {...formik.getFieldProps("isPrivate")}>Make Private</Checkbox>
            <ModalFooter>
               <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  isLoading={isLoading}
               >
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
