import { Button, Checkbox, Input, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { TCreatePlanBase } from "../../common/types";

export const schema = yup.object({
  name: yup.string().required("Name is required"),
  isPrivate: yup.boolean(),
  isActive: yup.boolean(),
});

type Props = {
  isLoading?: boolean;
  onClose: () => void;
  onCreate: (data: TCreatePlanBase) => void;
};

export default function CreateForm({ isLoading, onClose, onCreate }: Props) {
  const formik = useFormik({
    initialValues: {
      name: "",
      isPrivate: false,
      isActive: true,
    } as TCreatePlanBase,
    validationSchema: schema,
    onSubmit: (values) => {
      onCreate(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="false">
      <ModalHeader>Create New Plan</ModalHeader>
      <ModalBody>
        <Input
          autoFocus
          label="Plan Name"
          placeholder="E.g. Keto plan, detox plan etc."
          variant="bordered"
          {...formik.getFieldProps("name")}
          isInvalid={formik.touched.name && !!formik.errors.name}
          errorMessage={formik.errors.name}
        />
        <Checkbox {...formik.getFieldProps("isPrivate")}>Make Private</Checkbox>
        <Checkbox {...formik.getFieldProps("isActive")} defaultSelected={formik.values.isActive}>
          Is Active
        </Checkbox>
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
