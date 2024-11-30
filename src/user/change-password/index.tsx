import { Button, Input } from "@nextui-org/react";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as yup from "yup";
import { addToast } from "../../common/toast/slice";
import { getErrorMessage } from "../../helper";
import { useAppDispatch } from "../../store";
import { useChangePasswordMutation } from "./api";

const schema = yup.object({
  currentPassword: yup.string().required("Current Password is required"),
  newPassword: yup.string().required("New Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), undefined], "Passwords must match")
    .required("Confirm Password is required")
});

export default function ChangePassword() {
  const dispatch = useAppDispatch();
  const [changePassword, { data, error, status, isLoading }] = useChangePasswordMutation();
  const {
    touched,
    errors: formErrors,
    isValid,
    getFieldProps,
    handleSubmit,
    resetForm
  } = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    validationSchema: schema,
    onSubmit: changePassword
  });

  useEffect(() => {
    if (status === "fulfilled") {
      resetForm();
      dispatch(addToast({ message: data?.data?.message || "Password changed successfully", type: "success", autoClose: true }));
    } else if (status === "rejected") {
      dispatch(addToast({ message: getErrorMessage(error), type: "error", autoClose: true, autoCloseDuration: 5000 }));
    }
  }, [status, error, data, resetForm, dispatch]);

  return (
    <div className="mt-6">
      <h1 className="text-2xl mb-6">Change Your Password</h1>

      <form className="flex flex-col gap-y-2 max-w-[400px]" onSubmit={handleSubmit}>
        <Input
          label="Current Password"
          size="sm"
          variant="bordered"
          type="password"
          {...getFieldProps("currentPassword")}
          isInvalid={touched.currentPassword && !!formErrors.currentPassword}
          errorMessage={formErrors.currentPassword}
        />
        <Input
          label="New Password"
          size="sm"
          variant="bordered"
          type="password"
          {...getFieldProps("newPassword")}
          isInvalid={touched.newPassword && !!formErrors.newPassword}
          errorMessage={formErrors.newPassword}
        />
        <Input
          label="Confirm Password"
          size="sm"
          variant="bordered"
          type="password"
          {...getFieldProps("confirmPassword")}
          isInvalid={touched.confirmPassword && !!formErrors.confirmPassword}
          errorMessage={formErrors.confirmPassword}
        />
        <Button type="submit" color="primary" className="w-full" isDisabled={!isValid} isLoading={isLoading}>
          Change Password
        </Button>
      </form>
    </div>
  );
}
