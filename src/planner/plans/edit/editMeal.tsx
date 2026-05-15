import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Divider,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { FieldArray, FormikErrors, FormikProvider, useFormik } from "formik";
import { useCallback, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import Autocomplete, { Option } from "../../../common/autoComplete";
import { MealTypeKey, TDays, TMealDishBase } from "../../../common/types";
import { debounce } from "../../../common/utils";
import { EMealType } from "../../../constants";
import { useLazyGetDishesQuery } from "../../dishes/api";
import { TDishes } from "../../dishes/types";
import { TCreateMealBase, TMealBase } from "./types";

const mealTypes = [
  { key: "wakeup", label: EMealType.wakeup },
  { key: "breakfast", label: EMealType.breakfast },
  { key: "midmorning", label: EMealType.midmorning },
  { key: "lunch", label: EMealType.lunch },
  { key: "midafternoon", label: EMealType.midafternoon },
  { key: "dinner", label: EMealType.dinner },
  { key: "bedtime", label: EMealType.bedtime },
];

const schema = yup.object({
  mealType: yup.string().required("Meal type is required"),
  dishes: yup
    .array()
    .of(
      yup.object({
        dish: yup.object({
          _id: yup.string().required("Dish ID is required"),
          name: yup.string(),
        }),
      }),
    )
    .min(1, "Add at least one dish")
    .required("Dishes are required"),
});

type Props = {
  isLoading: boolean;
  day: TDays;
  mealType?: MealTypeKey;
  dishes?: TMealDishBase[];
  onUpdate: (data: TMealBase) => void;
  onClose: () => void;
};

const defaultDish: TMealDishBase = {
  dish: { _id: "", name: "" },
};

const dishInputClasses = {
  inputWrapper: ["bg-white"],
};

const dishToAutoCompleteOption = (dishes: TDishes[]): Option[] =>
  dishes.map(({ _id, name }) => ({ _id, name }));

export default function EditMeal({
  isLoading,
  day,
  mealType,
  dishes = [],
  onUpdate,
  onClose,
}: Props) {
  const { id = "" } = useParams();
  const [dishesData, setDishesData] = useState<Option[][]>(() => dishes.map(({ dish }) => [dish]));
  const [getDishes] = useLazyGetDishesQuery();
  const searchControllerRef = useRef<Record<number, ReturnType<typeof getDishes> | null>>({});
  const formik = useFormik({
    initialValues: {
      mealType: mealType || "",
      dishes,
    } as TCreateMealBase,
    validationSchema: schema,
    onSubmit: (values) => {
      onUpdate({ planId: id, day, ...values });
    },
  });

  const refetchDishes = useCallback(
    async (newQuery: string, index: number) => {
      const preferCachedValues = true;

      const getDishesPromise = getDishes({ query: newQuery, page: 1 }, preferCachedValues);
      searchControllerRef.current[index] = getDishesPromise;

      const { data, requestId } = await getDishesPromise;
      const dishes = data?.data ?? [];

      // only update if the response is from the current request
      if ((await searchControllerRef.current[index]).requestId === requestId) {
        const option = dishToAutoCompleteOption(dishes);
        setDishesData((prevData) => [
          ...prevData.slice(0, index),
          option,
          ...prevData.slice(index + 1),
        ]);
      }
    },
    [getDishes],
  );

  const handleSearchChange = useMemo(
    () =>
      debounce(
        // updates a state when UI needs to be updated
        // eslint-disable-next-line react-hooks/refs
        refetchDishes,
        750,
      ),
    [refetchDishes],
  );

  const handleSearchItemSelect = (value: string, index: number) => {
    // not updating dish name because it is not needed in api.
    formik.setFieldValue(`dishes.${index}.dish._id`, value);
    setDishesData([...dishesData.slice(0, index), [], ...dishesData.slice(index + 1)]);
  };

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="off">
      <ModalHeader>Add New Meal</ModalHeader>
      <ModalBody>
        <Select
          label="Meal Type"
          placeholder="Breakfast, Lunch, Dinner etc."
          variant="bordered"
          selectedKeys={[formik.values.mealType]}
          {...formik.getFieldProps("mealType")}
          isInvalid={formik.touched.mealType && !!formik.errors.mealType}
          errorMessage={formik.errors.mealType}
          classNames={{ trigger: ["bg-white"] }}
        >
          {mealTypes.map((type) => (
            <SelectItem key={type.key}>{type.label}</SelectItem>
          ))}
        </Select>

        <div className="text-default-500 text-small">Dishes</div>

        <FormikProvider value={formik}>
          <FieldArray name="dishes">
            {({ push, remove }) => (
              <>
                {formik.values.dishes.map(({ dish: { _id } }, index) => (
                  <div key={_id} className="bg-gray-100 flex flex-col gap-2 p-2 rounded-lg">
                    <Autocomplete
                      label="Dish"
                      placeholder="Type to Search (E.g. Roti, palak paneer etc.)"
                      variant="bordered"
                      {...formik.getFieldProps(`dishes.${index}.dish`)}
                      isInvalid={
                        formik.touched.dishes?.[index]?.dish &&
                        !!((formik.errors.dishes?.[index] as FormikErrors<TMealDishBase>) || {})
                          .dish?._id
                      }
                      errorMessage={
                        ((formik.errors.dishes?.[index] as FormikErrors<TMealDishBase>) || {}).dish
                          ?._id
                      }
                      classNames={dishInputClasses}
                      value={formik.values.dishes[index].dish.name}
                      options={dishesData[index]}
                      onChange={(event) => handleSearchChange(event.target.value, index)}
                      onSelect={(value) => handleSearchItemSelect(value, index)}
                    />

                    <Divider />

                    <Button
                      variant="flat"
                      onPress={() => {
                        setDishesData((prevState) => prevState.filter((_, i) => i !== index));
                        remove(index);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="bordered"
                  isDisabled={formik.values.dishes?.some(
                    (_, i) =>
                      !!(formik.errors.dishes?.[i] as FormikErrors<TMealDishBase>)?.dish?._id ||
                      formik.values.dishes[i].dish._id === "",
                  )}
                  onPress={() => {
                    setDishesData((prevState) => [...prevState, []]);
                    push(defaultDish);
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Add Dish
                </Button>
              </>
            )}
          </FieldArray>
        </FormikProvider>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose} isLoading={isLoading}>
          Close
        </Button>
        <Button type="submit" color="primary" isDisabled={!formik.isValid} isLoading={isLoading}>
          Submit
        </Button>
      </ModalFooter>
    </form>
  );
}
