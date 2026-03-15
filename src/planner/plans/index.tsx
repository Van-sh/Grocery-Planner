import { Button, Modal, ModalContent, Pagination, useDisclosure } from "@nextui-org/react";
import { startTransition, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlusIcon from "../../assets/plus";
import BlankScreen from "../../common/blankScreen";
import ConfirmationModal from "../../common/confirmationModal";
import GetErrorScreen from "../../common/getErrorScreen";
import Loader from "../../common/loader";
import Search from "../../common/search";
import { addToast } from "../../common/toast/slice";
import { getErrorMessage } from "../../helper";
import { useAppDispatch } from "../../store";
import { useCreatePlansMutation, useDeletePlanMutation, useGetPlansQuery } from "./api";
import CreateForm from "./createForm";
import List from "./list";

const limit = 10;
export default function Plans() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    isError: isGetError,
    error,
    isSuccess: isGetSuccess,
    data: { data = [], count = 0 } = {},
    refetch,
  } = useGetPlansQuery({ query, page });
  const [create, { data: createData, isLoading: isCreateLoading, status: createStatus }] =
    useCreatePlansMutation();
  const [deleteP, { isLoading: isDeleteLoading, status: deleteStatus }] = useDeletePlanMutation();

  const {
    isOpen: isCreateModalOpen,
    onOpen: onCreateModalOpen,
    onClose: onCreateModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const goToAddNewPlanPage = () => {
    onCreateModalOpen();
  };

  const handleMutationSuccess = useCallback(
    (action: string) => {
      dispatch(
        addToast({
          message: `Plan ${action} successfully`,
          type: "success",
          autoClose: true,
        }),
      );
      if (action === "created") {
        startTransition(() => {
          navigate(`edit/${createData!.data._id}`);
        });
      }
    },
    [dispatch, navigate, createData],
  );

  const handleMutationError = useCallback(
    (action: string) => {
      dispatch(
        addToast({
          message: `Failed to ${action} plan`,
          type: "error",
          autoClose: true,
        }),
      );
    },
    [dispatch],
  );

  const handleDetails = (id: string) => {
    startTransition(() => {
      navigate(`edit/${id}`);
    });
  };

  const showDeleteModal = (id: string) => {
    setSelectedPlan(id);
    onDeleteModalOpen();
  };

  const handleDelete = (id: string) => {
    deleteP(id);
  };

  useEffect(() => {
    if (createStatus === "fulfilled") {
      onCreateModalClose();
      handleMutationSuccess("created");
    } else if (createStatus === "rejected") {
      handleMutationError("create");
    }
  }, [createStatus, onCreateModalClose, handleMutationSuccess, handleMutationError]);

  useEffect(() => {
    if (deleteStatus === "fulfilled") {
      onDeleteModalClose();
      setSelectedPlan(undefined);
      handleMutationSuccess("deleted");
    } else if (deleteStatus === "rejected") {
      handleMutationError("delete");
    }
  }, [deleteStatus, onDeleteModalClose, handleMutationSuccess, handleMutationError]);

  return (
    <div className="flex justify-center">
      <div className="max-w-[1024px] w-full px-6">
        <h1 className="text-2xl mb-6">Meal Plans</h1>
        <Search name="Plans" query={query} setQuery={setQuery} />

        {isLoading && <Loader />}
        {isGetSuccess &&
          (data.length === 0 ? (
            <BlankScreen name="Meal Plans" onAdd={goToAddNewPlanPage} />
          ) : (
            <>
              <List data={data} onDetails={handleDetails} onDelete={showDeleteModal} />
              <div className="mt-4 flex justify-end mb-24 sm-mb-0">
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
          onClick={goToAddNewPlanPage}
        >
          <PlusIcon />
          Create
        </Button>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={onCreateModalClose}
        isDismissable={false}
        isKeyboardDismissDisabled
        placement="top-center"
        scrollBehavior="outside"
      >
        <ModalContent>
          {() => (
            <CreateForm
              isLoading={isCreateLoading}
              onCreate={create}
              onClose={onCreateModalClose}
            />
          )}
        </ModalContent>
      </Modal>

      <ConfirmationModal
        isModalOpen={isDeleteModalOpen}
        onModalClose={onDeleteModalClose}
        onYesClick={() => handleDelete(selectedPlan!)}
        isLoading={isDeleteLoading}
        message="Are you sure you want to delete this dish?"
      />
    </div>
  );
}
