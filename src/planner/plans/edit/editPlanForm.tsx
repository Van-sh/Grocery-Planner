import { Button, Input, Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import { useData } from "../../../common/mealCards/context";
import { addToast } from "../../../common/toast/slice";
import { MealTypeKey, TCreatePlanBase, TDays, TMealDishBase } from "../../../common/types";
import { isDesktop } from "../../../constants";
import { useAppDispatch } from "../../../store";
import { useUpdateMealMutation } from "../api";
import DesktopView from "./desktopView";
import EditMeal from "./editMeal";
import MobileView from "./mobileView";

export const schema = yup.object({
  name: yup.string().required("Name is required"),
});

type Props = {
  refetch: any;
};

export default function EditPlanForm({ refetch }: Props) {
  const [selectedDay, setSelectedDay] = useState<TDays>();
  const [selectedMealType, setSelectedMealType] = useState<MealTypeKey>();
  const [selectedDishes, setSelectedDishes] = useState<TMealDishBase[]>();
  const { data } = useData();
  const dispatch = useAppDispatch();

  const [
    updateMeal,
    { isLoading: isUpdateMealLoading, isSuccess: isUpdateMealSuccess, isError: isUpdateMealError },
  ] = useUpdateMealMutation();

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

  const openEditPlanModal = (day: TDays, mealType: MealTypeKey, dishes: TMealDishBase[]) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setSelectedDishes(dishes);
    onEditModalOpen();
  };

  const handleCreateClose = useCallback(() => {
    onEditModalClose();
    setSelectedDay(undefined);
    setSelectedMealType(undefined);
    setSelectedDishes(undefined);
  }, [onEditModalClose]);

  useEffect(() => {
    if (isUpdateMealSuccess) {
      handleCreateClose();
      handleMutationSuccess("created");
    } else if (isUpdateMealError) {
      handleMutationError("create");
    }
  }, [
    isUpdateMealSuccess,
    isUpdateMealError,
    handleCreateClose,
    handleMutationError,
    handleMutationSuccess,
  ]);

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
          <DesktopView
            openCreatePlanModal={openCreatePlanModal}
            openEditPlanModal={openEditPlanModal}
          />
        ) : (
          <MobileView
            openCreatePlanModal={openCreatePlanModal}
            openEditPlanModal={openEditPlanModal}
          />
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
            <EditMeal
              isLoading={isUpdateMealLoading}
              day={selectedDay!}
              mealType={selectedMealType}
              dishes={selectedDishes}
              onUpdate={updateMeal}
              onClose={handleCreateClose}
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
