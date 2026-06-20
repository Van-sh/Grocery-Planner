import { Modal, ModalContent, Spinner } from "@heroui/react";
import DetailedRecipe from ".";
import { TDishes } from "../../planner/dishes/types";

type Props = {
  dish?: TDishes;
  isFetching?: boolean;
  isOpen: boolean;
  onClose: () => void;
};

export default function RecipeModal({ dish, isFetching = false, isOpen, onClose }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="top-center" scrollBehavior="outside">
      <ModalContent>
        {isFetching ? (
          <div className="flex justify-center p-8">
            <Spinner />
          </div>
        ) : (
          <DetailedRecipe value={dish} />
        )}
      </ModalContent>
    </Modal>
  );
}
