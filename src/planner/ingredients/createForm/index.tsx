import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Divider, Input, ModalBody, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import * as yup from "yup";
import { FieldArray, FormikErrors, FormikProvider, useFormik } from "formik";
import Autocomplete from "../../../common/autoComplete";
import { TIngredients, TIngredientsBase, TPreparationBase } from "../types";

// TODO: Create a dropdown for Unit

const preparationTypes = [
  "Baked",
  "Boiled",
  "Chopped",
  "Diced",
  "Dried",
  "Fermented",
  "Fried",
  "Frosted",
  "Grated",
  "Grilled",
  "Ground",
  "Kneaded",
  "Marinated",
  "Roasted",
  "Sauteed",
  "Shredded",
  "Sliced",
  "Smoked",
  "Soaked",
  "Sprouted",
  "Steamed",
  "Stir-fried",
  "Stuffed",
  "Toasted",
  "Whipped"
];

const preparationUnits = ["days", "hours", "minutes"];

const schema = yup.object({
  name: yup.string().required("Name is required"),
  preparations: yup
    .array()
    .of(
      yup.object({
        category: yup.mixed().oneOf(preparationTypes, "Select a type from dropdown").required("Type is required"),
        timeAmount: yup.number().required("Time Amount is required").min(1, "Time Amount must be greater than 0"),
        timeUnits: yup.mixed().oneOf(preparationUnits, "Select a type from dropdown").required("Time Unit is required")
      })
    )
    .notRequired()
});

type Props = {
  initialValues?: TIngredients; // pass to edit a form
  isLoading?: boolean;
  onClose: () => void;
  onCreate: (data: TIngredientsBase, id?: string) => void;
};

const defaultPreparation: TPreparationBase = { category: "", timeAmount: 0, timeUnits: "" };

const preparationInputClasses = {
  inputWrapper: ["bg-white"]
};

export default function CreateForm({ initialValues, isLoading, onClose, onCreate }: Props) {
  const formik = useFormik({
    initialValues: {
      name: initialValues?.name || "",
      preparations: initialValues?.preparations || []
    } as TIngredientsBase,
    validationSchema: schema,
    onSubmit: values => onCreate(values, initialValues?._id)
  });

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="false">
      <ModalHeader>{initialValues ? "Edit" : "Add New"} Ingredient</ModalHeader>
      <ModalBody>
        <Input
          autoFocus
          label="Name"
          placeholder="Onion, Tomato, Beans etc."
          variant="bordered"
          {...formik.getFieldProps("name")}
          isInvalid={formik.touched.name && !!formik.errors.name}
          errorMessage={formik.errors.name}
        />

        <div className="text-default-500 text-small">Preparation Needed?</div>

        <FormikProvider value={formik}>
          <FieldArray name="preparations">
            {({ push, remove }) => (
              <>
                {formik.values.preparations.map((_, index) => (
                  <div key={index} className="bg-gray-100 flex flex-col gap-2 p-2 rounded-lg">
                    <Autocomplete
                      label="Preparation type"
                      placeholder="Fried, Boiled, etc."
                      variant="bordered"
                      {...formik.getFieldProps(`preparations.${index}.category`)}
                      isInvalid={
                        formik.touched.preparations?.[index]?.category &&
                        !!((formik.errors.preparations?.[index] as FormikErrors<TPreparationBase>) || {}).category
                      }
                      errorMessage={((formik.errors.preparations?.[index] as FormikErrors<TPreparationBase>) || {}).category}
                      classNames={preparationInputClasses}
                      options={preparationTypes}
                      onSelect={value => formik.setFieldValue(`preparations.${index}.category`, value)}
                    />

                    <Input
                      label="Amount of time required"
                      variant="bordered"
                      type="number"
                      {...formik.getFieldProps(`preparations.${index}.timeAmount`)}
                      isInvalid={
                        formik.touched.preparations?.[index]?.timeAmount &&
                        !!((formik.errors.preparations?.[index] as FormikErrors<TPreparationBase>) || {}).timeAmount
                      }
                      errorMessage={((formik.errors.preparations?.[index] as FormikErrors<TPreparationBase>) || {})?.timeAmount}
                      classNames={preparationInputClasses}
                    />

                    <Select
                      label="Time Unit"
                      placeholder="days, hours, minutes"
                      variant="bordered"
                      selectedKeys={[formik.values.preparations[index].timeUnits]}
                      {...formik.getFieldProps(`preparations.${index}.timeUnits`)}
                      isInvalid={
                        formik.touched.preparations?.[index]?.timeUnits &&
                        !!((formik.errors.preparations?.[index] as FormikErrors<TPreparationBase>) || {}).timeUnits
                      }
                      errorMessage={((formik.errors.preparations?.[index] as FormikErrors<TPreparationBase>) || {})?.timeUnits}
                      classNames={{ trigger: ["bg-white"] }}
                    >
                      {preparationUnits.map(unit => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </Select>

                    <Divider />

                    <Button variant="flat" onClick={() => remove(index)}>
                      Remove
                    </Button>
                  </div>
                ))}

                <Button
                  variant="bordered"
                  isDisabled={!!formik.getFieldMeta("preparations").error}
                  onClick={() => push(defaultPreparation)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Add Preparation
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
