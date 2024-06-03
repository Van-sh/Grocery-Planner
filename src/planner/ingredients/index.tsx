import { Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import BlankScreen from "../../common/blankScreen";
import Loader from "../../common/loader";
import { createIngredient, getIngredients } from "./api";
import CreateForm from "./createForm";
import List from "./list";

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
  const mutation = useMutation({ mutationFn: createIngredient, onSuccess: () => refetch() });
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="flex justify-center">
      <div className="max-w-[1024px] w-full px-6">
        <h1 className="text-2xl">Ingredients</h1>

        {isLoading && <Loader />}
        {onGetSuccess && (data.length === 0 ? <BlankScreen name="Ingredients" onAdd={onOpen} /> : <List data={data} />)}
        {onGetError && <div>Error: {error.message}</div>}

        <Modal
          isOpen={isOpen}
          onClose={onClose}
          isDismissable={false}
          isKeyboardDismissDisabled
          placement="top-center"
          scrollBehavior="outside"
        >
          <ModalContent>
            {onClose => (
              <CreateForm
                onClose={onClose}
                onCreate={data => {
                  mutation.mutate(data);
                }}
              />
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
