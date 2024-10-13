import { Button, Input } from "@nextui-org/react";
import { GoogleLogin } from "@react-oauth/google";
import { useFormik } from "formik";
import * as yup from "yup";
import GroceryIcon from "../assets/groceryIcon";

type Props = {
  onLogin: () => void;
  onClose: () => void;
};

const API_URL = process.env.REACT_APP_API_URL;

const schema = yup.object({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm Password is required")
});

export default function Signup({ onLogin, onClose }: Props) {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema: schema,
    onSubmit: console.log
  });

  return (
    <div className="pt-8 text-center">
      <div className="flex justify-center">
        <GroceryIcon width={75} height={75} />
      </div>
      <h1 className="text-2xl">Welcome to Grocery Planner</h1>
      <p className="text-xs mt-2 mb-8">
        Already have an account?
        <Button size="sm" className="bg-white p-0 pl-1 min-w-0 h-auto underline" onClick={onLogin}>
          Log in
        </Button>
      </p>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={credentialResponse => {
            fetch(API_URL + "/auth/google", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(credentialResponse)
            })
              .then(res => {
                // Handle successful login
                onClose();
              })
              .catch(err => {
                // Handle login error
              });
          }}
          onError={() => {
            console.log("Login Failed");
          }}
          useOneTap
          shape="circle"
          size="medium"
          text="signup_with"
          width="250"
        />
      </div>

      <div className="my-4 flex justify-center items-center">
        <div className="w-full border-slate-300 border-t h-0" />
        <p className="mx-4">OR</p>
        <div className="w-full border-slate-300 border-t h-0" />
      </div>

      <form className="flex flex-col gap-y-2 mb-4" onSubmit={formik.handleSubmit}>
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
        <Input
          label="Password"
          size="sm"
          variant="bordered"
          type="password"
          {...formik.getFieldProps("password")}
          isInvalid={formik.touched.password && !!formik.errors.password}
          errorMessage={formik.errors.password}
        />
        <Input
          label="Confirm Password"
          size="sm"
          variant="bordered"
          type="password"
          {...formik.getFieldProps("confirmPassword")}
          isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
          errorMessage={formik.errors.confirmPassword}
        />
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </div>
  );
}
