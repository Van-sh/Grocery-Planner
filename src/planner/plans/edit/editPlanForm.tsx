import { Button, Input } from "@nextui-org/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { isDesktop } from "../../../constants";
import { TCreatePlanBase, TPlansBase } from "../types";
import DesktopView from "./desktopView";
import MobileView from "./mobileView";

export const schema = yup.object({
  name: yup.string().required("Name is required"),
});

type Props = {
  data: TCreatePlanBase;
};

export default function EditPlanForm({ data }: Props) {
  const formik = useFormik({
    initialValues: {
      name: data.name,
    } as TPlansBase,
    validationSchema: schema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="false" className="w-full px-4 md:px-6">
      <div className="flex justify-between items-start mt-6 gap-4">
        <Input
          className="max-w-3xl"
          size="sm"
          label="Plan Name"
          placeholder="E.g. Keto plan, detox plan etc."
          variant="flat"
          {...formik.getFieldProps("name")}
          isInvalid={formik.touched.name && !!formik.errors.name}
          errorMessage={formik.errors.name}
        />
        <Button color="primary" size="lg" type="submit">
          Save
        </Button>
      </div>

      {isDesktop ? <DesktopView /> : <MobileView />}
    </form>
  );
}
