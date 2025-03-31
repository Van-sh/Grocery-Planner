import { Button, useDisclosure } from "@nextui-org/react";
import { startTransition, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlusIcon from "../../assets/plus";
import BlankScreen from "../../common/blankScreen";
import GetErrorScreen from "../../common/getErrorScreen";
import Loader from "../../common/loader";
import Search from "../../common/search";
import { addToast } from "../../common/toast/slice";
import { getErrorMessage } from "../../helper";
import { useAppDispatch } from "../../store";
import { useCreatePlansMutation, useGetPlansQuery } from "./api";
import CreateForm from "./createForm";

export default function Plans() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState(1);
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
  const {
    isOpen: isCreateModalOpen,
    onOpen: onCreateModalOpen,
    onClose: onCreateModalClose,
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
      startTransition(() => {
        navigate(`edit/${createData!.data._id}`);
      });
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

  useEffect(() => {
    if (createStatus === "fulfilled") {
      onCreateModalClose();
      handleMutationSuccess("created");
    } else if (createStatus === "rejected") {
      handleMutationError("create");
    }
  }, [createStatus, onCreateModalClose, handleMutationSuccess, handleMutationError]);

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
            <></>
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

      <CreateForm
        isModalOpen={isCreateModalOpen}
        isLoading={isCreateLoading}
        onCreate={create}
        onClose={onCreateModalClose}
      />
    </div>
  );
}
