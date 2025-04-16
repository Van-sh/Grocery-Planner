import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { TCreatePlanBase } from "./types";

export const schema = yup.object({
  name: yup.string().required("Name is required"),
});

type Props = {
  isModalOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onCreate: (data: TCreatePlanBase) => void;
};

export default function CreateForm({ isModalOpen, isLoading, onClose, onCreate }: Props) {
  const formik = useFormik({
    initialValues: {
      name: "",
      isPrivate: false,
    } as TCreatePlanBase,
    validationSchema: schema,
    onSubmit: (values) => {
      onCreate(values);
    },
  });

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onClose}
      isDismissable={false}
      isKeyboardDismissDisabled
      placement="top-center"
      scrollBehavior="outside"
    >
      <ModalContent>
        {() => (
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
        )}
      </ModalContent>
    </Modal>
  );
}
