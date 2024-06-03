import { Button, Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import BlankScreen from "../../common/blankScreen";
import Loader from "../../common/loader";
import { createIngredient, getIngredients, updateIngredient } from "./api";
import CreateForm from "./createForm";
import List from "./list";
import { TIngredients } from "./types";
import PlusIcon from "../../assets/plus";

// TODO:
// 1. Add search functionality
// 2. Pagination in FE and BE

export default function Ingredients() {
  const {
    isLoading,
    isError: onGetError,
    error,
    isSuccess: onGetSuccess,
    data,
    refetch
  } = useQuery({ queryKey: ["ingredients"], queryFn: getIngredients });
  const create = useMutation({ mutationFn: createIngredient, onSuccess: () => refetch() });
  const update = useMutation({ mutationFn: updateIngredient, onSuccess: () => refetch() });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredients>();

  const handleEdit = (item: TIngredients) => {
    setSelectedIngredient(item);
    onOpen();
  };

  const handleClose = () => {
    onClose();
    setSelectedIngredient(undefined);
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-[1024px] w-full px-6">
        <h1 className="text-2xl">Ingredients</h1>

        {isLoading && <Loader />}
        {onGetSuccess && (data.length === 0 ? <BlankScreen name="Ingredients" onAdd={onOpen} /> : <List data={data} onEdit={handleEdit} />)}
        {onGetError && <div>Error: {error.message}</div>}

        <Button color="primary" variant="shadow" className="fixed bottom-8 right-8" onClick={onOpen}>
          <PlusIcon />
          Create
        </Button>

        <Modal
          isOpen={isOpen}
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
                onClose={handleClose}
                onCreate={(data, id) => {
                  id ? update.mutate({ data, id }) : create.mutate(data);
                }}
              />
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
