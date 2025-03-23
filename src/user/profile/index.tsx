import { Avatar, Button, Input } from "@nextui-org/react";
import { useFormik } from "formik";
import { useCallback, useEffect } from "react";
import * as yup from "yup";
import { addUserDetails } from "../../common/auth/slice";
import { addToast } from "../../common/toast/slice";
import { getErrorMessage } from "../../helper";
import { useAppDispatch, useAppSelector } from "../../store";
import { useEditUserDetailsMutation } from "../change-password/api";
import { TEditUserDetailsResponse } from "../change-password/types";

const schema = yup.object({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

export default function Profile() {
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.auth.userDetails);
  const userName = userDetails?.fName.substring(0, 15);
  const [editUserDetails, { data, error, status, isLoading }] = useEditUserDetailsMutation();

  const formik = useFormik({
    initialValues: {
      firstName: userDetails?.fName || "",
      lastName: userDetails?.lName || "",
      email: userDetails?.email || "",
    },
    validationSchema: schema,
    onSubmit: (val) => editUserDetails({ ...val, oldEmail: userDetails?.email || "" }),
  });

  const handleSuccess = useCallback(
    (data: TEditUserDetailsResponse) => {
      const { message, data: userDetails } = data;
      dispatch(addUserDetails({ userDetails }));
      dispatch(
        addToast({
          message,
          type: "success",
          autoClose: true,
        }),
      );
    },
    [dispatch],
  );

  const handleError = useCallback(() => {
    dispatch(
      addToast({
        message: getErrorMessage(error),
        type: "error",
        autoClose: true,
      }),
    );
  }, [dispatch, error]);

  useEffect(() => {
    if (status === "fulfilled") {
      handleSuccess(data!);
    } else if (status === "rejected") {
      handleError();
    }
  }, [data, error, status, handleSuccess, handleError]);

  return (
    <section className="border border-slate-300 mb-24">
      <div className="h-24 bg-primary-600 px-16 py-6">
        <div className="flex items-center">
          <div className="h-24 w-24">
            <Avatar isBordered src={userDetails?.picture} className="h-24 w-24" />
          </div>
          <div className="text-white ml-6 text-2xl">Hi {userName}!</div>
        </div>
      </div>
      <h1 className="text-2xl mx-16 mb-6 mt-10">Personal Details</h1>
      <form className="mx-16 flex flex-col gap-y-2 mb-4" onSubmit={formik.handleSubmit}>
        <div className="fixed z-20 bottom-0 w-full bg-white p-2 border-t border-slate-300 flex justify-center left-0">
          <Button type="submit" color="primary" isDisabled={!formik.isValid} className="px-16">
            Save Changes
          </Button>
        </div>
        <div className="flex gap-x-4">
          <Input
            label="First Name"
            size="sm"
            variant="bordered"
            {...formik.getFieldProps("firstName")}
            isInvalid={formik.touched.firstName && !!formik.errors.firstName}
            errorMessage={formik.errors.firstName}
          />
          <Input
            label="Last Name"
            size="sm"
            variant="bordered"
            {...formik.getFieldProps("lastName")}
            isInvalid={formik.touched.lastName && !!formik.errors.lastName}
            errorMessage={formik.errors.lastName}
          />
        </div>
        <Input
          label="Email"
          size="sm"
          variant="bordered"
          {...formik.getFieldProps("email")}
          isInvalid={formik.touched.email && !!formik.errors.email}
          errorMessage={formik.errors.email}
        />
      </form>
    </section>
  );
}
