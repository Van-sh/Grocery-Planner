import { Button, Input, Modal, ModalContent, useDisclosure } from "@heroui/react";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import { useData } from "../../../common/mealCards/context";
import { addToast } from "../../../common/toast/slice";
import { MealTypeKey, TDays, TMealDishBase } from "../../../common/types";
import { isDesktop } from "../../../constants";
import { getErrorMessage } from "../../../helper";
import { useAppDispatch, useAppSelector } from "../../../store";
import { userApi } from "../../../user/api";
import { useStartPlanMutation, useUpdateMealMutation, type useGetPlanQuery } from "../api";
import StartForm from "../startForm";
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
  const { data } = useData();
  const dispatch = useAppDispatch();
  const currentPlan = useAppSelector((state) => state.auth.userDetails?.currentPlan);
  const currentPlanId =
    typeof currentPlan?.plan === "string" ? currentPlan.plan : currentPlan?.plan?._id;
  const isCurrentPlanRunning =
    currentPlanId === data._id && !!currentPlan?.endsAt && new Date(currentPlan.endsAt) > new Date();

  const [
    updateMeal,
    { isLoading: isUpdateMealLoading, isSuccess: isUpdateMealSuccess, isError: isUpdateMealError },
  ] = useUpdateMealMutation();
  const [
    startPlan,
    {
      isLoading: isStartPlanLoading,
      status: startPlanStatus,
      error: startPlanError,
    },
  ] = useStartPlanMutation();

  const formik = useFormik({
    initialValues: {
      name: data.name,
    },
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
    isOpen: isStartModalOpen,
    onOpen: onStartModalOpen,
    onClose: onStartModalClose,
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
    if (startPlanStatus === "fulfilled") {
      onStartModalClose();
      dispatch(userApi.endpoints.getCurrentUser.initiate(null, { forceRefetch: true, subscribe: false }));
      dispatch(
        addToast({
          message: "Plan started successfully",
          type: "success",
          autoClose: true,
        }),
      );
    } else if (startPlanStatus === "rejected") {
      dispatch(
        addToast({
          message: getErrorMessage(startPlanError) || "Failed to start plan",
          type: "error",
          autoClose: true,
        }),
      );
    }
  }, [dispatch, onStartModalClose, startPlanError, startPlanStatus]);

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
          <div className="flex gap-2">
            <Button color="secondary" size="lg" type="button" onPress={onStartModalOpen} isDisabled={isStartPlanLoading}>
              {isCurrentPlanRunning ? "Restart Plan" : "Start Plan"}
            </Button>
            <Button color="primary" size="lg" type="submit">
              Save
            </Button>
          </div>
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

      <Modal
        isOpen={isStartModalOpen}
        onClose={onStartModalClose}
        isDismissable={false}
        isKeyboardDismissDisabled
        placement="top-center"
      >
        <ModalContent>
          {() => (
            <StartForm
              isLoading={isStartPlanLoading}
              onClose={onStartModalClose}
              onSubmit={(weeks) => startPlan({ planId: data._id, weeks })}
              planName={data.name}
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
