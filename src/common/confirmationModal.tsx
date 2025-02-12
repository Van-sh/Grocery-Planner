import { Button, Modal, ModalContent } from "@nextui-org/react";

type Props = {
  isModalOpen: boolean;
  onModalClose: () => void;
  onYesClick: () => void;
  isLoading?: boolean;
  message: string;
};

export default function ConfirmationModal({isModalOpen, onModalClose, onYesClick, isLoading = false, message}: Props) {
  return <Modal
    isOpen={isModalOpen}
    onClose={onModalClose}
    isDismissable={false}
    isKeyboardDismissDisabled
    placement="top-center"
    scrollBehavior="outside"
  >
    <ModalContent>
      {() => (
        <div className="p-6">
          <h2 className="text-lg">{message}</h2>
          <div className="flex justify-end gap-4 mt-6">
            <Button color="danger" onClick={onYesClick} isLoading={isLoading}>
              Yes
            </Button>
            <Button onClick={onModalClose} isLoading={isLoading}>
              No
            </Button>
          </div>
        </div>
      )}
    </ModalContent>
  </Modal>;
}
