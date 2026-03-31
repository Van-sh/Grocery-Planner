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
} from "@nextui-org/react";
import { FieldArray, FormikErrors, FormikProvider, useFormik } from "formik";
import { useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import Autocomplete from "../../../common/autoComplete";
import { TDays, TMealDishBase } from "../../../common/types";
import { debounce } from "../../../common/utils";
import { EMealType } from "../../../constants";
import { useLazyGetDishesQuery } from "../../dishes/api";
import { TDishes } from "../../dishes/types";
import { TCreateMealBase, TMealBase } from "./types";

export const mealTypes = [
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
  onCreate: (data: TMealBase) => void;
  onClose: () => void;
};

const defaultDish: TMealDishBase = {
  dish: { _id: "", name: "" },
};

const dishInputClasses = {
  inputWrapper: ["bg-white"],
};

export default function AddMeal({ isLoading, day, onCreate, onClose }: Props) {
  const { id = "" } = useParams();
  const [dishesData, setDishesData] = useState<TDishes[][]>([]);
  const [getDishes] = useLazyGetDishesQuery();
  const searchControllerRef = useRef<ReturnType<typeof getDishes> | null>();
  const formik = useFormik({
    initialValues: {
      mealType: "",
      dishes: [],
    } as TCreateMealBase,
    validationSchema: schema,
    onSubmit: (values) => {
      onCreate({ planId: id, day, ...values });
    },
  });

  const refetchDishes = useCallback(
    async (newQuery: string, index: number) => {
      // if there is a pending request, abort it before calling new api
      if (searchControllerRef.current) {
        searchControllerRef.current.abort();
      }

      const getDishesPromise = getDishes({ query: newQuery, page: 1 });
      searchControllerRef.current = getDishesPromise;

      const { data } = await getDishesPromise;
      const dish = data?.data ?? [];
      setDishesData([...dishesData.slice(0, index), dish, ...dishesData.slice(index + 1)]);
    },
    [getDishes, dishesData],
  );

  const handleSearchChange = debounce(
    (newQuery: string, index: number) => refetchDishes(newQuery, index),
    750,
  );

  const dishToAutoCompleteOption = (dishes: TDishes[]) =>
    dishes.map(({ _id, name }) => ({ _id, name }));

  const handleSearchItemSelect = (value: string, index: number) => {
    // not updating dish name because it is not needed in api.
    formik.setFieldValue(`dishes.${index}.dish._id`, value);
    setDishesData([...dishesData.slice(0, index), [], ...dishesData.slice(index + 1)]);
  };

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="false">
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
            <SelectItem key={type.key} value={type.key}>
              {type.label}
            </SelectItem>
          ))}
        </Select>

        <div className="text-default-500, text-small">Dishes</div>

        <FormikProvider value={formik}>
          <FieldArray name="dishes">
            {({ push, remove }) => (
              <>
                {formik.values.dishes.map(({ dish }, index) => (
                  <div key={dish?._id} className="bg-gray-100 flex flex-col gap-2 p-2 rounded-lg">
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
                      options={dishToAutoCompleteOption(dishesData[index])}
                      onChange={(event) => handleSearchChange(event.target.value, index)}
                      onSelect={(value) => handleSearchItemSelect(value, index)}
                    />

                    <Divider />

                    <Button
                      variant="flat"
                      onClick={() => {
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
                  onClick={() => {
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
