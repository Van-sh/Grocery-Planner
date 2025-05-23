import { Button, Modal, ModalContent, Pagination, useDisclosure } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";

import GetErrorScreen from "../../common/getErrorScreen";
import Loader from "../../common/loader";
import { addToast } from "../../common/toast/slice";
import { getErrorMessage } from "../../helper";
import { useAppDispatch } from "../../store";
import { useCreateDishMutation, useGetDishesQuery, useUpdateDishMutation, useDeleteDishMutation } from "./api";
import List from "./list";
import { type TDishes } from "./types";

import PlusIcon from "../../assets/plus";
import BlankScreen from "../../common/blankScreen";
import Search from "../../common/search";
import CreateForm from "./createForm";
import ConfirmationModal from "../../common/confirmationModal";
import DetailedView from "./detailedView";

const limit = 10;
export default function Dishes() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [selectedDish, setSelectedDish] = useState<TDishes>();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    isError: isGetError,
    error,
    isSuccess: isGetSuccess,
    data: { data = [], count = 0 } = {},
    refetch,
  } = useGetDishesQuery({ query, page });

  const [create, { isLoading: isCreateLoading, status: createStatus }] = useCreateDishMutation();
  const [update, { isLoading: isUpdateLoading, status: updateStatus }] = useUpdateDishMutation();
  const [deleteD, { isLoading: isDeleteLoading, status: deleteStatus }] = useDeleteDishMutation();


  const {
    isOpen: isDetailsModalOpen,
    onOpen: onDetailsModalOpen,
    onClose: onDetailsModalClose,
  } = useDisclosure();
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

  const handleDetailsClose = useCallback(() => {
    onDetailsModalClose();
    setSelectedDish(undefined);
  }, [onDetailsModalClose]);

  const handleEditClose = useCallback(() => {
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

  const handleDetails = (item: TDishes) => {
    setSelectedDish(item);
    onDetailsModalOpen();
  };

  const handleEdit = (item: TDishes) => {
    setSelectedDish(item);
    onEditModalOpen();
  };

  const showDeleteModal = (id: string) => {
    setSelectedDish({ _id: id } as TDishes);
    onDeleteModalOpen();
  };

  const handleDelete = (id: string) => {
    deleteD(id);
  };

  useEffect(() => {
    if (!isLoading) {
      const pages = Math.ceil(count / limit);
      if (page > pages) setPage(Math.max(1, pages));
    }
  }, [data, count, page, isLoading]);

  useEffect(() => {
    if (createStatus === "fulfilled") {
      handleEditClose();
      handleMutationSuccess("created");
    } else if (createStatus === "rejected") {
      handleMutationError("create");
    }
  }, [createStatus, handleEditClose, handleMutationSuccess, handleMutationError]);

  useEffect(() => {
    if (updateStatus === "fulfilled") {
      handleEditClose();
      handleMutationSuccess("updated");
    } else if (updateStatus === "rejected") {
      handleMutationError("update");
    }
  }, [updateStatus, handleEditClose, handleMutationSuccess, handleMutationError]);

  useEffect(() => {
    if (deleteStatus === "fulfilled") {
      onDeleteModalClose();
      setSelectedDish(undefined);
      handleMutationSuccess("deleted");
    } else if (deleteStatus === "rejected") {
      handleMutationError("delete");
    }
  }, [deleteStatus, onDeleteModalClose, handleMutationSuccess, handleMutationError]);

  return (
    <div className="flex justify-center">
      <div className="max-w-[1024px] w-full px-6">
        <h1 className="text-2xl">Dishes</h1>
        <Search name="Ingredients" query={query} setQuery={setQuery} />

        {isLoading && <Loader />}
        {isGetSuccess &&
          (data.length === 0 ? (
            <BlankScreen name="Dishes" onAdd={onEditModalOpen} />
          ) : (
            <>
              <List
                data={data}
                onDetails={handleDetails}
                onEdit={handleEdit}
                onDelete={showDeleteModal}
              />
              <div className="mt-4 flex justify-end mb-24 sm:mb-0">
                <Pagination
                  showControls
                  total={Math.ceil(count / limit)}
                  page={page}
                  onChange={setPage}
                />
              </div>
            </>
          ))}
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
          isOpen={isDetailsModalOpen}
          onClose={handleDetailsClose}
          placement="top-center"
          scrollBehavior="outside"
        >
          <ModalContent><DetailedView value={selectedDish}/></ModalContent>
        </Modal>

        <Modal
          isOpen={isEditModalOpen}
          onClose={handleEditClose}
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
                onClose={handleEditClose}
                onCreate={(data, id) => {
                  id ? update({ data, id }) : create(data);
                }}
              />
            )}
          </ModalContent>
        </Modal>

        <ConfirmationModal
          isModalOpen={isDeleteModalOpen}
          onModalClose={onDeleteModalClose}
          onYesClick={() => handleDelete(selectedDish!._id)}
          isLoading={isDeleteLoading}
          message="Are you sure you want to delete this dish?"
        />
      </div>
    </div>
  );
}
