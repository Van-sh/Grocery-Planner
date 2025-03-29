import {
  Button,
  Input,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
} from "@nextui-org/react";
import { useFormik } from "formik";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import * as yup from "yup";
import EditIcon from "../../assets/editIcon";
import PlusIcon from "../../assets/plus";
import { addUserDetails } from "../../common/auth/slice";
import ImageCropperModal from "../../common/imageCropperModal";
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
  const [isImageOptionsModalOpen, setIsImageOptionsModalOpen] = useState(false);
  const [isImageCropperModalOpen, setIsImageCropperModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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

  const showImageOptionsModal = () => {
    setIsImageOptionsModalOpen(true);
  };

  const hideImageOptionsModal = () => {
    setIsImageOptionsModalOpen(false);
  };

  const showImageCropperModal = () => {
    setIsImageCropperModalOpen(true);
  };

  const hideImageCropperModal = () => {
    setIsImageCropperModalOpen(false);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      hideImageOptionsModal();
      showImageCropperModal();

      const reader = new FileReader();
      reader.addEventListener("load", () => setImgSrc(reader.result?.toString() || ""));
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handlePictureUpload = (picture: string) => {
    editUserDetails({ picture, oldEmail: userDetails?.email || "" });
  };

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
            <span
              className="group flex relative overflow-hidden outline-none text-tiny bg-default text-default-foreground rounded-full ring-2 ring-offset-2 ring-offset-background ring-default h-24 w-24"
              onClick={showImageOptionsModal}
            >
              <img src={userDetails?.picture} className="object-cover w-full h-full" alt="avatar" />
              <span className="opacity-0 absolute bottom-0 bg-black/25 w-full text-center text-white transition-opacity duration-250 group-hover:opacity-100">
                Edit
              </span>
            </span>
          </div>
          <div className="text-white ml-6 text-2xl">Hi {userName}!</div>
        </div>
      </div>
      <h1 className="text-2xl mx-16 mb-6 mt-10">Personal Details</h1>
      <form className="mx-16 flex flex-col gap-y-2 mb-4" onSubmit={formik.handleSubmit}>
        <div className="fixed z-20 bottom-0 w-full bg-white p-2 border-t border-slate-300 flex justify-center left-0">
          <Button
            type="submit"
            color="primary"
            isLoading={isLoading}
            isDisabled={!formik.isValid}
            className="px-16"
          >
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

      <Modal
        isOpen={isImageOptionsModalOpen}
        onClose={hideImageOptionsModal}
        placement="top-center"
        scrollBehavior="outside"
        className="my-1"
        size="xs"
      >
        <ModalContent>
          {() => {
            const iconProps = { height: "1rem", width: "1rem" };
            const AddIcon = userDetails?.picture ? EditIcon : PlusIcon;

            return (
              <ModalBody>
                <div className="w-full px-1 pt-8 pb-2">
                  <Listbox aria-label="Listbox menu with icons" variant="faded">
                    <ListboxItem
                      key="new"
                      startContent={<AddIcon {...iconProps} />}
                      onClick={handleImageUpload}
                      textValue="Upload Image"
                    >
                      {userDetails?.picture ? "Update Image" : "Upload Image"}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </ListboxItem>
                  </Listbox>
                </div>
              </ModalBody>
            );
          }}
        </ModalContent>
      </Modal>

      <ImageCropperModal
        isModalOpen={isImageCropperModalOpen}
        onModalClose={hideImageCropperModal}
        imgSrc={imgSrc}
        aspectRatio={1}
        onUpload={handlePictureUpload}
      />
    </section>
  );
}
