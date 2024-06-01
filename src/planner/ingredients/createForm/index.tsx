import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Divider, Input, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import * as yup from "yup";
import { FieldArray, FormikErrors, FormikProvider, useFormik } from "formik";
import Autocomplete from "../../../common/autoComplete";

type TPreparation = {
  category: string;
  amount: number;
  unit: string;
};

export type TInputs = {
  name: string;
  preparation: TPreparation[];
};

const schema = yup.object({
  name: yup.string().required("Name is required"),
  preparation: yup
    .array()
    .of(
      yup.object({
        category: yup.string().required("Type is required"),
        amount: yup.number().required("Amount is required").min(1, "Amount must be greater than 0"),
        unit: yup.string().required("Unit is required")
      })
    )
    .notRequired()
});

type Props = {
  onClose: () => void;
  onCreate: (data: TInputs) => void;
};

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
  "Steamed",
  "Stir-fried",
  "Stuffed",
  "Toasted",
  "Whipped"
];

const defaultPreparation = { category: "", amount: 0, unit: "" };

const preparationInputClasses = {
  inputWrapper: ["bg-white"]
};

export default function CreateForm({ onClose, onCreate }: Props) {
  const formik = useFormik({
    initialValues: {
      name: "",
      preparation: []
    } as TInputs,
    validationSchema: schema,
    onSubmit: values => {
      onCreate(values);
      onClose();
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <ModalHeader>Add New Ingredient</ModalHeader>
      <ModalBody>
        <Input
          autoFocus
          label="Name"
          placeholder="Enter ingredient name"
          variant="bordered"
          {...formik.getFieldProps("name")}
          isInvalid={formik.touched.name && !!formik.errors.name}
          errorMessage={formik.errors.name}
        />

        <div className="text-default-500 text-small">Preparation Needed?</div>

        <FormikProvider value={formik}>
          <FieldArray name="preparation">
            {({ push, remove }) => (
              <>
                {formik.values.preparation.map((_, index) => (
                  <div key={index} className="bg-gray-100 flex flex-col gap-2 p-2 rounded-lg">
                    <Autocomplete
                      label="Preparation type"
                      placeholder="Select preparation type"
                      variant="bordered"
                      {...formik.getFieldProps(`preparation.${index}.category`)}
                      isInvalid={
                        formik.touched.preparation?.[index]?.category &&
                        !!((formik.errors.preparation?.[index] as FormikErrors<TPreparation>) || {}).category
                      }
                      errorMessage={((formik.errors.preparation?.[index] as FormikErrors<TPreparation>) || {}).category}
                      classNames={preparationInputClasses}
                      options={preparationTypes}
                      onSelect={value => formik.setFieldValue(`preparation.${index}.category`, value)}
                    />

                    <Input
                      label="Amount"
                      placeholder="Enter amount"
                      variant="bordered"
                      type="number"
                      {...formik.getFieldProps(`preparation.${index}.amount`)}
                      isInvalid={
                        formik.touched.preparation?.[index]?.amount &&
                        !!((formik.errors.preparation?.[index] as FormikErrors<TPreparation>) || {}).amount
                      }
                      errorMessage={((formik.errors.preparation?.[index] as FormikErrors<TPreparation>) || {})?.amount}
                      classNames={preparationInputClasses}
                    />

                    <Input
                      label="Unit"
                      placeholder="Enter unit"
                      variant="bordered"
                      {...formik.getFieldProps(`preparation.${index}.unit`)}
                      isInvalid={
                        formik.touched.preparation?.[index]?.unit &&
                        !!((formik.errors.preparation?.[index] as FormikErrors<TPreparation>) || {}).unit
                      }
                      errorMessage={((formik.errors.preparation?.[index] as FormikErrors<TPreparation>) || {})?.unit}
                      classNames={preparationInputClasses}
                    />

                    {formik.values.preparation.length > 1 && (
                      <>
                        <Divider />
                        <Button variant="flat" onClick={() => remove(index)}>
                          Remove
                        </Button>
                      </>
                    )}
                  </div>
                ))}

                <Button variant="bordered" isDisabled={!!formik.getFieldMeta("preparation").error} onClick={() => push(defaultPreparation)}>
                  <FontAwesomeIcon icon={faPlus} />
                  Add Preparation
                </Button>
              </>
            )}
          </FieldArray>
        </FormikProvider>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose}>
          Close
        </Button>
        <Button type="submit" color="primary" isDisabled={!formik.isValid}>
          Add
        </Button>
      </ModalFooter>
    </form>
  );
}
