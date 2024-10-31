import { Button, Modal, ModalContent, Pagination, useDisclosure } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import PlusIcon from "../../assets/plus";
import BlankScreen from "../../common/blankScreen";
import GetErrorScreen from "../../common/getErrorScreen";
import Loader from "../../common/loader";
import Search from "../../common/search";
import { addToast } from "../../common/toast/slice";
import { useAppDispatch } from "../../store";
import { createIngredient, deleteIngredient, getIngredients, updateIngredient } from "./api";
import CreateForm from "./createForm";
import List from "./list";
import { TIngredients } from "./types";

const limit = 10;
export default function Ingredients() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredients>();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    isError: onGetError,
    error,
    isSuccess: onGetSuccess,
    data: { data = [], count = 0 } = {},
    refetch
  } = useQuery({ queryKey: ["ingredients", page, query], queryFn: () => getIngredients({ query, page }) });
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();

  const handleClose = () => {
    onEditModalClose();
    setSelectedIngredient(undefined);
  };

  const handleMutationSuccess = (action: string) => {
    refetch();
    dispatch(addToast({ message: `Ingredient ${action} successfully`, type: "success", autoClose: true }));
  };

  const handleMutationError = (action: string) => {
    dispatch(addToast({ message: `Failed to ${action} ingredient`, type: "error", autoClose: true }));
  };

  const create = useMutation({
    mutationFn: createIngredient,
    onSuccess: () => {
      handleClose();
      handleMutationSuccess("created");
    },
    onError: () => handleMutationError("create")
  });
  const update = useMutation({
    mutationFn: updateIngredient,
    onSuccess: () => {
      handleClose();
      handleMutationSuccess("updated");
    },
    onError: () => handleMutationError("update")
  });
  const deleteI = useMutation({
    mutationFn: deleteIngredient,
    onSettled: () => {
      onDeleteModalClose();
      setSelectedIngredient(undefined);
      handleMutationSuccess("deleted");
    },
    onError: () => handleMutationError("delete")
  });

  const handleEdit = (item: TIngredients) => {
    setSelectedIngredient(item);
    onEditModalOpen();
  };

  const showDeleteModal = (id: string) => {
    setSelectedIngredient({ _id: id } as TIngredients);
    onDeleteModalOpen();
  };

  const handleDelete = (id: string) => {
    deleteI.mutate(id);
  };

  useEffect(() => {
    if (!isLoading) {
      const pages = Math.ceil(count / limit);
      if (page > pages) setPage(Math.max(1, pages));
    }
  }, [data, count, page, isLoading]);

  return (
    <div className="flex justify-center">
      <div className="max-w-[1024px] w-full px-6">
        <h1 className="text-2xl">Ingredients</h1>
        <Search name="Ingredients" query={query} setQuery={setQuery} />

        {isLoading && <Loader />}
        {onGetSuccess &&
          (data.length === 0 ? (
            <BlankScreen name="Ingredients" onAdd={onEditModalOpen} />
          ) : (
            <>
              <List data={data} onEdit={handleEdit} onDelete={showDeleteModal} />
              <div className="mt-4 flex justify-end mb-24 sm:mb-0">
                <Pagination showControls total={Math.ceil(count / limit)} page={page} onChange={setPage} />
              </div>
            </>
          ))}
        {onGetError && <GetErrorScreen errorMsg={error.message} onRetry={refetch} />}

        <Button color="primary" variant="shadow" className="fixed bottom-8 right-8" onClick={onEditModalOpen}>
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
                initialValues={selectedIngredient}
                isLoading={create.isPending || update.isPending}
                onClose={handleClose}
                onCreate={(data, id) => {
                  id ? update.mutate({ data, id }) : create.mutate(data);
                }}
              />
            )}
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={onDeleteModalClose}
          isDismissable={false}
          isKeyboardDismissDisabled
          placement="top-center"
          scrollBehavior="outside"
        >
          <ModalContent>
            {() => (
              <div className="p-6">
                <h2 className="text-lg">Are you sure you want to delete this ingredient?</h2>
                <div className="flex justify-end gap-4 mt-6">
                  <Button color="danger" onClick={() => handleDelete(selectedIngredient!._id)} isLoading={deleteI.isPending}>
                    Yes
                  </Button>
                  <Button onClick={onDeleteModalClose} isLoading={deleteI.isPending}>
                    No
                  </Button>
                </div>
              </div>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
