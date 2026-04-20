import { Button, Input, Modal, ModalContent, useDisclosure } from "@heroui/react";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import ConfirmationModal from "../../../common/confirmationModal";
import { useData } from "../../../common/mealCards/context";
import { addToast } from "../../../common/toast/slice";
import { MealTypeKey, TCreatePlanBase, TDays, TMealDishBase } from "../../../common/types";
import { isDesktop } from "../../../constants";
import { useAppDispatch } from "../../../store";
import { useDeleteMealMutation, useUpdateMealMutation, type useGetPlanQuery } from "../api";
import DesktopView from "./desktopView";
import EditMeal from "./editMeal";
import MobileView from "./mobileView";

const schema = yup.object({
  name: yup.string().required("Name is required"),
});

type Props = {
  refetch: ReturnType<typeof useGetPlanQuery>["refetch"];
};

export default function EditPlanForm({ refetch }: Props) {
  const [selectedDay, setSelectedDay] = useState<TDays>();
  const [selectedMealType, setSelectedMealType] = useState<MealTypeKey>();
  const [selectedDishes, setSelectedDishes] = useState<TMealDishBase[]>();
  const [selectedMealId, setSelectedMealId] = useState<string>();
  const { data } = useData();
  const dispatch = useAppDispatch();
  const { id: planId = "" } = useParams();

  const [
    updateMeal,
    { isLoading: isUpdateMealLoading, isSuccess: isUpdateMealSuccess, isError: isUpdateMealError },
  ] = useUpdateMealMutation();
  const [
    deleteMeal,
    { isLoading: isDeleteMealLoading, isSuccess: isDeleteMealSuccess, isError: isDeleteMealError },
  ] = useDeleteMealMutation();

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

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
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

  const openDeletePlanConfirmation = (day: TDays, mealType: MealTypeKey) => {
    const mealId = (data.meals?.[day] || []).find((meal) => meal.mealType === mealType)?._id;
    if (!planId || !mealId) {
      dispatch(
        addToast({
          message: "Failed to delete meal",
          type: "error",
          autoClose: true,
        }),
      );
      return;
    }

    setSelectedDay(day);
    setSelectedMealType(mealType);
    setSelectedMealId(mealId);
    onDeleteModalOpen();
  };

  const handleDelete = () => {
    if (!planId || !selectedMealId) return;
    deleteMeal({ planId, mealId: selectedMealId });
  };

  useEffect(() => {
    if (isUpdateMealSuccess) {
      handleCreateClose();
      handleMutationSuccess("updated");
    } else if (isUpdateMealError) {
      handleMutationError("update");
    }
  }, [
    isUpdateMealSuccess,
    isUpdateMealError,
    handleCreateClose,
    handleMutationError,
    handleMutationSuccess,
  ]);

  useEffect(() => {
    if (isDeleteMealSuccess) {
      onDeleteModalClose();
      setSelectedDay(undefined);
      setSelectedMealType(undefined);
      handleMutationSuccess("deleted");
    } else if (isDeleteMealError) {
      handleMutationError("delete");
    }
  }, [
    isDeleteMealSuccess,
    isDeleteMealError,
    onDeleteModalClose,
    handleMutationSuccess,
    handleMutationError,
  ]);

  return (
    <>
      <form onSubmit={formik.handleSubmit} autoComplete="off" className="w-full px-4 md:px-6">
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
            openDeletePlanConfirmation={openDeletePlanConfirmation}
          />
        ) : (
          <MobileView
            openCreatePlanModal={openCreatePlanModal}
            openEditPlanModal={openEditPlanModal}
            openDeletePlanConfirmation={openDeletePlanConfirmation}
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

      <ConfirmationModal
        isModalOpen={isDeleteModalOpen}
        onModalClose={onDeleteModalClose}
        onYesClick={handleDelete}
        isLoading={isDeleteMealLoading}
        message="Are you sure you want to delete this meal?"
      />
    </>
  );
}
