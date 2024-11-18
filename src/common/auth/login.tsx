import { Button, Input } from "@nextui-org/react";
import { GoogleLogin } from "@react-oauth/google";
import { useFormik } from "formik";
import { useCallback, useEffect } from "react";
import * as yup from "yup";
import GroceryIcon from "../../assets/groceryIcon";
import { useAppDispatch } from "../../store";
import { useGoogleMutation, useLoginMutation } from "./api";
import { addUserDetails } from "./slice";
import { TUserResponse } from "./types";

type Props = {
  onSignup: () => void;
  onClose: () => void;
};

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required")
});

export default function Login({ onSignup, onClose }: Props) {
  const dispatch = useAppDispatch();
  const [login, { data: loginData, status: loginStatus }] = useLoginMutation();
  const [google, { data: googleData, status: googleStatus }] = useGoogleMutation();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: login
  });

  const handleLoginSuccess = useCallback(
    (data: TUserResponse) => {
      const { jwt, data: userDetails } = data;
      dispatch(addUserDetails({ userDetails, jwt }));
      onClose();

      setTimeout(() => {
        window.location.reload();
      }, 200);
    },
    [dispatch, onClose]
  );

  useEffect(() => {
    if (loginStatus === "fulfilled") {
      handleLoginSuccess(loginData!);
    } else if (loginStatus === "rejected") {
      // Handle login error
    }
  }, [loginData, loginStatus, handleLoginSuccess]);

  useEffect(() => {
    if (googleStatus === "fulfilled") {
      handleLoginSuccess(googleData!);
    } else if (googleStatus === "rejected") {
      // Handle google login error
    }
  }, [googleData, googleStatus, handleLoginSuccess]);

  return (
    <div className="pt-8">
      <div className="flex justify-center">
        <GroceryIcon width={75} height={75} />
      </div>
      <h1 className="text-2xl text-center">Welcome back</h1>
      <p className="text-xs mt-2 mb-8 text-center">
        Don't have an account?
        <Button size="sm" className="bg-white p-0 pl-1 min-w-0 h-auto underline" onClick={onSignup}>
          Sign Up
        </Button>
      </p>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={google}
          onError={() => {
            console.log("Login Failed");
          }}
          shape="circle"
          size="medium"
          text="signin_with"
          width="250"
        />
      </div>

      <div className="my-4 flex justify-center items-center">
        <div className="w-full border-slate-300 border-t h-0" />
        <p className="mx-4">OR</p>
        <div className="w-full border-slate-300 border-t h-0" />
      </div>

      <form className="flex flex-col gap-y-2 mb-4" onSubmit={formik.handleSubmit}>
        <Input
          label="Email"
          size="sm"
          variant="bordered"
          {...formik.getFieldProps("email")}
          isInvalid={formik.touched.email && !!formik.errors.email}
          errorMessage={formik.errors.email}
        />
        <Input
          label="Password"
          size="sm"
          variant="bordered"
          type="password"
          {...formik.getFieldProps("password")}
          isInvalid={formik.touched.password && !!formik.errors.password}
          errorMessage={formik.errors.password}
        />
        <Button type="submit" color="primary" isDisabled={!formik.isValid} className="w-full">
          Log In
        </Button>
      </form>
    </div>
  );
}
