import { Button, Input, Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import { useData } from "../../../common/mealCards/context";
import { addToast } from "../../../common/toast/slice";
import { TCreatePlanBase, TDays } from "../../../common/types";
import { isDesktop } from "../../../constants";
import { useAppDispatch } from "../../../store";
import { useCreateMealMutation } from "../api";
import AddMeal from "./addMeal";
import DesktopView from "./desktopView";
import MobileView from "./mobileView";

export const schema = yup.object({
  name: yup.string().required("Name is required"),
});

type Props = {
  refetch: any;
};

export default function EditPlanForm({ refetch }: Props) {
  const [selectedDay, setSelectedDay] = useState<TDays>();
  const { data } = useData();
  const dispatch = useAppDispatch();

  const [createMeal, { isLoading: isCreateMealLoading, status: createMealStatus }] =
    useCreateMealMutation();

  const formik = useFormik({
    initialValues: {
      name: data.name,
    } as TCreatePlanBase,
    validationSchema: schema,
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const handleMutationSuccess = useCallback(
    (action: string) => {
      refetch();
      dispatch(
        addToast({
          message: `Dish ${action} successfully`,
          type: "success",
          autoClose: true,
        }),
      );
    },
    [dispatch, refetch],
  );

  const handleMutationError = useCallback(
    (action: string) => {
      dispatch(
        addToast({
          message: `Failed to ${action} dish`,
          type: "error",
          autoClose: true,
        }),
      );
    },
    [dispatch],
  );

  const openCreatePlanModal = (day: TDays) => {
    setSelectedDay(day);
    onEditModalOpen();
  };

  const handleCreateClose = useCallback(() => {
    onEditModalClose();
    setSelectedDay(undefined);
  }, [onEditModalClose]);

  useEffect(() => {
    if (createMealStatus === "fulfilled") {
      handleCreateClose();
      handleMutationSuccess("created");
    } else if (createMealStatus === "rejected") {
      handleMutationError("create");
    }
  }, [createMealStatus, handleCreateClose, handleMutationError, handleMutationSuccess]);

  return (
    <>
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

        {isDesktop ? (
          <DesktopView openCreatePlanModal={openCreatePlanModal} />
        ) : (
          <MobileView openCreatePlanModal={openCreatePlanModal} />
        )}
      </form>

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCreateClose}
        isDismissable={false}
        isKeyboardDismissDisabled
        placement="top-center"
        scrollBehavior="outside"
      >
        <ModalContent>
          {() => (
            <AddMeal
              isLoading={isCreateMealLoading}
              day={selectedDay!}
              onCreate={createMeal}
              onClose={handleCreateClose}
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
