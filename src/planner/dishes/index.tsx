import { Button, Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";

import GetErrorScreen from "../../common/getErrorScreen";
import Loader from "../../common/loader";
import { addToast } from "../../common/toast/slice";
import { getErrorMessage } from "../../helper";
import { useAppDispatch } from "../../store";
import { useCreateDishMutation, useGetDishesQuery, useUpdateDishMutation } from "./api";
import List from "./list";
import { type TDishes } from "./types";

import PlusIcon from "../../assets/plus";
import CreateForm from "./createForm";

export default function Dishes() {
   const [selectedDish, setSelectedDish] = useState<TDishes>();
   const dispatch = useAppDispatch();
   const {
      isLoading,
      isError: isGetError,
      error,
      isSuccess: isGetSuccess,
      data: { data = [] } = {},
      refetch,
   } = useGetDishesQuery();
   const {
      isOpen: isEditModalOpen,
      onOpen: onEditModalOpen,
      onClose: onEditModalClose,
   } = useDisclosure();

   const [create, { isLoading: isCreateLoading, status: createStatus }] = useCreateDishMutation();
   const [update, { isLoading: isUpdateLoading, status: updateStatus }] = useUpdateDishMutation();

   const handleClose = useCallback(() => {
      onEditModalClose();
      setSelectedDish(undefined);
   }, [onEditModalClose]);

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

   useEffect(() => {
      if (createStatus === "fulfilled") {
         handleClose();
         handleMutationSuccess("created");
      } else if (createStatus === "rejected") {
         handleMutationError("create");
      }
   }, [createStatus, handleClose, handleMutationSuccess, handleMutationError]);

   useEffect(() => {
      if (updateStatus === "fulfilled") {
         handleClose();
         handleMutationSuccess("updated");
      } else if (updateStatus === "rejected") {
         handleMutationError("update");
      }
   }, [updateStatus, handleClose, handleMutationSuccess, handleMutationError]);

   return (
      <div className="flex justify-center">
         <div className="max-w-[1024px] w-full px-6">
            <h1 className="text-2xl">Dishes</h1>
            {isLoading && <Loader />}
            {isGetSuccess && <List data={data} />}
            {isGetError && <GetErrorScreen errorMsg={getErrorMessage(error)} onRetry={refetch} />}
            <Button
               color="primary"
               variant="shadow"
               className="fixed bottom-8 right-8"
               onClick={onEditModalOpen}
            >
               <PlusIcon />
               Create
            </Button>

            <Modal
               isOpen={isEditModalOpen}
               onClose={handleClose}
               isDismissable={false}
               isKeyboardDismissDisabled
               placement="top-center"
               scrollBehavior="outside"
            >
               <ModalContent>
                  {() => (
                     <CreateForm
                        initialValues={selectedDish}
                        isLoading={isCreateLoading || isUpdateLoading}
                        onClose={handleClose}
                        onCreate={(data, id) => {
                           id ? update({ data, id }) : create(data);
                        }}
                     />
                  )}
               </ModalContent>
            </Modal>
         </div>
      </div>
   );
}
