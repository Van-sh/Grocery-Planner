import { Button, Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import BlankScreen from "../../common/blankScreen";
import Loader from "../../common/loader";
import { createIngredient, deleteIngredient, getIngredients, updateIngredient } from "./api";
import CreateForm from "./createForm";
import List from "./list";
import { TIngredients } from "./types";
import PlusIcon from "../../assets/plus";
import Search from "../../common/search";

// TODO:
// 1. Add search functionality
// 2. Pagination in FE and BE
// 3. Handle api errors

export default function Ingredients() {
  const [query, setQuery] = useState<string>("");
  const {
    isLoading,
    isError: onGetError,
    error,
    isSuccess: onGetSuccess,
    data,
    refetch
  } = useQuery({ queryKey: ["ingredients", query], queryFn: () => getIngredients(query) });
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const create = useMutation({
    mutationFn: createIngredient,
    onSuccess: () => {
      onEditModalClose();
      refetch();
    }
  });
  const update = useMutation({
    mutationFn: updateIngredient,
    onSuccess: () => {
      onEditModalClose();
      refetch();
    }
  });
  const deleteI = useMutation({
    mutationFn: deleteIngredient,
    onSettled: () => {
      onDeleteModalClose();
      refetch();
    }
  });
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredients>();

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

  const handleClose = () => {
    onEditModalClose();
    setSelectedIngredient(undefined);
  };

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
            </>
          ))}
        {onGetError && <div>Error: {error.message}</div>}

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
