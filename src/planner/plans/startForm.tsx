import { Button, Input, ModalBody, ModalFooter, ModalHeader } from "@heroui/react";
import { useFormik } from "formik";
import * as yup from "yup";

const schema = yup.object({
  weeks: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? NaN : value))
    .integer("Weeks must be a whole number")
    .min(1, "Weeks must be at least 1")
    .max(12, "Weeks cannot be more than 12")
    .required("Weeks is required"),
});

type Props = {
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (weeks: number) => void;
  planName: string;
};

export default function StartForm({ isLoading, onClose, onSubmit, planName }: Props) {
  const formik = useFormik({
    initialValues: {
      weeks: 1,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      onSubmit(Number(values.weeks));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="off">
      <ModalHeader>Start Plan</ModalHeader>
      <ModalBody>
        <p className="text-sm text-default-500">
          Start <span className="font-semibold text-foreground">{planName}</span> for{" "}
          {formik.values.weeks} week{formik.values.weeks !== 1 && "s"}.
        </p>
        <Input
          autoFocus
          label="Number of Weeks"
          type="number"
          min={1}
          max={12}
          step={1}
          variant="bordered"
          {...formik.getFieldProps("weeks")}
          value={String(formik.values.weeks)}
          isInvalid={formik.touched.weeks && !!formik.errors.weeks}
          errorMessage={formik.touched.weeks ? formik.errors.weeks : undefined}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose} isDisabled={isLoading}>
          Close
        </Button>
        <Button type="submit" color="primary" isLoading={isLoading}>
          Start Plan
        </Button>
      </ModalFooter>
    </form>
  );
}
