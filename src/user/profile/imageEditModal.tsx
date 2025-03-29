import { Listbox, ListboxItem, Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { ChangeEvent, useRef, useState } from "react";
import EditIcon from "../../assets/editIcon";
import PlusIcon from "../../assets/plus";
import DeleteIcon from "../../assets/deleteIcon";
import ConfirmationModal from "../../common/confirmationModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  oldImgSrc?: string;
  onSetNewImgSrc: (newImgSrc: string) => void;
  onDelete: () => void;
};

const iconProps = { height: "1rem", width: "1rem" };

export default function ImageEditModal({
  isOpen,
  onClose,
  oldImgSrc,
  onSetNewImgSrc,
  onDelete,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  const showDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(true);
  };

  const hideDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => onSetNewImgSrc(reader.result?.toString() || ""));
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleDelete = () => {
    hideDeleteConfirmationModal();
    onDelete();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="top-center"
        scrollBehavior="outside"
        className="my-1"
        size="xs"
      >
        <ModalContent>
          {() => (
            <ModalBody>
              <div className="w-full px-1 pt-8 pb-2">
                {oldImgSrc ? (
                  <Listbox aria-label="Listbox menu with icons" variant="faded">
                    <ListboxItem
                      key="new"
                      startContent={<EditIcon {...iconProps} />}
                      onClick={handleImageUpload}
                      textValue="Upload Image"
                    >
                      Update Image
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </ListboxItem>
                    <ListboxItem
                      key="new"
                      startContent={<DeleteIcon {...iconProps} />}
                      onClick={showDeleteConfirmationModal}
                      textValue="Upload Image"
                      className="text-danger"
                      color="danger"
                    >
                      Delete Image
                    </ListboxItem>
                  </Listbox>
                ) : (
                  <Listbox aria-label="Listbox menu with icons" variant="faded">
                    <ListboxItem
                      key="new"
                      startContent={<PlusIcon {...iconProps} />}
                      onClick={handleImageUpload}
                      textValue="Upload Image"
                    >
                      Upload Image
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </ListboxItem>
                  </Listbox>
                )}
              </div>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>

      <ConfirmationModal
        isModalOpen={isDeleteConfirmationOpen}
        onModalClose={hideDeleteConfirmationModal}
        onYesClick={handleDelete}
        message="Are you sure you want to Delete Profile Picture?"
      />
    </>
  );
}
