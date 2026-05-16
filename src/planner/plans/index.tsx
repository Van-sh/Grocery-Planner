import { Button, Modal, ModalContent, Pagination, useDisclosure } from "@heroui/react";
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
import { useAppDispatch, useAppSelector } from "../../store";
import {
  useCreatePlansMutation,
  useDeletePlanMutation,
  useGetPlansQuery,
  useStartPlanMutation,
} from "./api";
import CreateForm from "./createForm";
import List from "./list";
import StartForm from "./startForm";
import { userApi } from "../../user/api";

const limit = 10;
export default function Plans() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string>();
  const [selectedPlanName, setSelectedPlanName] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentPlan = useAppSelector((state) => state.auth.userDetails?.currentPlan);
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
  const [
    startPlan,
    {
      isLoading: isStartPlanLoading,
      status: startPlanStatus,
      error: startPlanError,
    },
  ] = useStartPlanMutation();

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
  const {
    isOpen: isStartModalOpen,
    onOpen: onStartModalOpen,
    onClose: onStartModalClose,
  } = useDisclosure();

  const goToAddNewPlanPage = () => {
    onCreateModalOpen();
  };

  const handleMutationSuccess = useCallback(
    (action: string) => {
      refetch();
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
    [dispatch, navigate, createData, refetch],
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

  const showStartModal = (id: string, name: string) => {
    setSelectedPlan(id);
    setSelectedPlanName(name);
    onStartModalOpen();
  };

  const handleDelete = (id: string) => {
    deleteP(id);
  };

  const handleStartPlanClose = useCallback(() => {
    setSelectedPlan(undefined);
    setSelectedPlanName("");
    onStartModalClose();
  }, [onStartModalClose]);

  const handleStartPlan = (weeks: number) => {
    if (!selectedPlan) return;
    startPlan({ planId: selectedPlan, weeks });
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

  useEffect(() => {
    if (startPlanStatus === "fulfilled") {
      handleStartPlanClose();
      dispatch(userApi.endpoints.getCurrentUser.initiate(null, { forceRefetch: true, subscribe: false }));
      dispatch(
        addToast({
          message: "Plan started successfully",
          type: "success",
          autoClose: true,
        }),
      );
    } else if (startPlanStatus === "rejected") {
      dispatch(
        addToast({
          message: getErrorMessage(startPlanError) || "Failed to start plan",
          type: "error",
          autoClose: true,
        }),
      );
    }
  }, [dispatch, handleStartPlanClose, startPlanError, startPlanStatus]);

  return (
    <div className="flex justify-center">
      <div className="max-w-5xl w-full px-6">
        <h1 className="text-2xl mb-6">Meal Plans</h1>
        <Search name="Plans" query={query} setQuery={setQuery} />

        {isLoading && <Loader />}
        {isGetSuccess &&
          (data.length === 0 ? (
            <BlankScreen name="Meal Plans" onAdd={goToAddNewPlanPage} />
          ) : (
            <>
              <List
                data={data}
                onDetails={handleDetails}
                onDelete={showDeleteModal}
                onStart={showStartModal}
                currentPlan={currentPlan}
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
          className="fixed bottom-8 right-8 z-20"
          onPress={goToAddNewPlanPage}
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

      <Modal
        isOpen={isStartModalOpen}
        onClose={handleStartPlanClose}
        isDismissable={false}
        isKeyboardDismissDisabled
        placement="top-center"
      >
        <ModalContent>
          {() => (
            <StartForm
              isLoading={isStartPlanLoading}
              onClose={handleStartPlanClose}
              onSubmit={handleStartPlan}
              planName={selectedPlanName}
            />
          )}
        </ModalContent>
      </Modal>

      <ConfirmationModal
        isModalOpen={isDeleteModalOpen}
        onModalClose={onDeleteModalClose}
        onYesClick={() => handleDelete(selectedPlan!)}
        isLoading={isDeleteLoading}
        message="Are you sure you want to delete this plan?"
      />
    </div>
  );
}
